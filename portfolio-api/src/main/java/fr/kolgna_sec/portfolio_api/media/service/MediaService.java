package fr.kolgna_sec.portfolio_api.media.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.account.repositories.AccountRepository;
import fr.kolgna_sec.portfolio_api.media.bean.Media;
import fr.kolgna_sec.portfolio_api.media.dto.MediaDTO;
import fr.kolgna_sec.portfolio_api.media.mappers.MediaMapper;
import fr.kolgna_sec.portfolio_api.media.repositories.MediaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaService {

    private final MediaRepository mediaRepository;
    private final MediaMapper mediaMapper;
    private final AccountRepository accountRepository;
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${cloud.aws.s3.mediaFolder}")
    private String mediaFolder;

    /**
     * Upload d'un média sur AWS S3 et sauvegarde en base
     *
     * @param file Le fichier à uploader
     * @param mediaType Le type de média (initial: "image" ou "video", puis tagué: "lab", "schema reseau", "demo vlan")
     * @param accountId L'ID du compte
     * @return MediaDTO du média créé
     */
    @Transactional
    public MediaDTO uploadMedia(MultipartFile file, String mediaType, Long accountId) {
        try {
            log.info("Début upload média: fileName={}, type={}, accountId={}", file.getOriginalFilename(), mediaType, accountId);

            // Vérification du compte
            Account account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new RuntimeException("Account not found: " + accountId));

            // Génération du nom de fichier unique
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            String s3Key = mediaFolder + uniqueFileName;

            // Détermination du Content-Type
            String contentType = file.getContentType();
            if (contentType == null || contentType.isEmpty()) {
                contentType = "application/octet-stream";
            }

            // Création des métadonnées
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(contentType);
            metadata.setContentLength(file.getSize());
            metadata.addUserMetadata("original-filename", originalFilename);
            metadata.addUserMetadata("media-type", mediaType);
            metadata.addUserMetadata("account-id", accountId.toString());

            // Upload vers S3
            log.info("Upload vers S3: bucket={}, key={}", bucketName, s3Key);
            PutObjectRequest putObjectRequest = new PutObjectRequest(
                    bucketName,
                    s3Key,
                    file.getInputStream(),
                    metadata
            );
            putObjectRequest.setCannedAcl(CannedAccessControlList.Private);
            amazonS3.putObject(putObjectRequest);

            // Génération de l'URL (URL signée valide 7 jours pour l'accès privé)
            String url = generatePresignedUrl(s3Key);

            // Création de l'entité Media
            Media media = new Media();
            media.setAccount(account);
            media.setMediaType(mediaType);
            media.setUrl(url);
            media.setFileName(originalFilename);
            media.setCreatedAt(LocalDateTime.now());
            media.setFeatured(false);

            // Sauvegarde en base
            Media savedMedia = mediaRepository.save(media);
            log.info("✅ Média uploadé avec succès: id={}, s3Key={}", savedMedia.getMediaId(), s3Key);

            return mediaMapper.fromMedia(savedMedia);

        } catch (IOException e) {
            log.error("❌ Erreur lors de l'upload du média", e);
            throw new RuntimeException("Erreur upload média: " + e.getMessage(), e);
        }
    }

    /**
     * Tag un média existant (lab, schema reseau, demo vlan)
     * Cette action met à jour le type et les métadonnées S3
     *
     * @param mediaId ID du média
     * @param tag Tag à appliquer
     * @return MediaDTO mis à jour
     */
    @Transactional
    public MediaDTO tagMedia(Long mediaId, String tag) {
        log.info("Début tag média: mediaId={}, tag={}", mediaId, tag);

        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found: " + mediaId));

        // Extraction de la clé S3 depuis l'URL
        String s3Key = extractS3KeyFromUrl(media.getUrl());

        // Mise à jour des métadonnées S3
        try {
            ObjectMetadata existingMetadata = amazonS3.getObjectMetadata(bucketName, s3Key);
            ObjectMetadata newMetadata = existingMetadata.clone();
            newMetadata.addUserMetadata("media-type", tag);

            // Copie de l'objet avec nouvelles métadonnées
            CopyObjectRequest copyRequest = new CopyObjectRequest(bucketName, s3Key, bucketName, s3Key)
                    .withNewObjectMetadata(newMetadata);
            amazonS3.copyObject(copyRequest);

            log.info("✅ Métadonnées S3 mises à jour: s3Key={}, tag={}", s3Key, tag);
        } catch (Exception e) {
            log.error("⚠️ Erreur mise à jour métadonnées S3 (non bloquante): {}", e.getMessage());
        }

        // Mise à jour en base
        media.setMediaType(tag);
        Media updatedMedia = mediaRepository.save(media);

        log.info("✅ Média tagué avec succès: id={}, tag={}", mediaId, tag);
        return mediaMapper.fromMedia(updatedMedia);
    }

    /**
     * Récupère tous les médias d'un compte
     *
     * @param accountId ID du compte
     * @return Liste des MediaDTO
     */
    @Transactional(readOnly = true)
    public List<MediaDTO> getAllMediaByAccount(Long accountId) {
        log.info("Récupération médias pour accountId={}", accountId);

        List<Media> mediaList = mediaRepository.findAll().stream()
                .filter(media -> media.getAccount().getIdAccount().equals(accountId))
                .collect(Collectors.toList());

        // Régénération des URLs signées (au cas où elles auraient expiré)
        mediaList.forEach(media -> {
            String s3Key = extractS3KeyFromUrl(media.getUrl());
            String newUrl = generatePresignedUrl(s3Key);
            media.setUrl(newUrl);
        });

        return mediaList.stream()
                .map(mediaMapper::fromMedia)
                .collect(Collectors.toList());
    }

    /**
     * Récupère tous les médias d'un compte filtrés par tag (PUBLIC - pour visiteurs)
     *
     * @param accountId ID du compte
     * @param tag Tag du média (lab, schema reseau, demo vlan)
     * @return Liste des MediaDTO correspondants
     */
    @Transactional(readOnly = true)
    public List<MediaDTO> getMediaByAccountAndTag(Long accountId, String tag) {
        log.info("Récupération médias publics pour accountId={}, tag={}", accountId, tag);

        List<Media> mediaList = mediaRepository.findByAccount_IdAccountAndMediaType(accountId, tag);

        // Régénération des URLs signées
        mediaList.forEach(media -> {
            String s3Key = extractS3KeyFromUrl(media.getUrl());
            String newUrl = generatePresignedUrl(s3Key);
            media.setUrl(newUrl);
        });

        log.info("✅ {} médias trouvés pour tag={}", mediaList.size(), tag);
        return mediaList.stream()
                .map(mediaMapper::fromMedia)
                .collect(Collectors.toList());
    }

    /**
     * Met à jour un média existant (remplace le fichier)
     *
     * @param mediaId ID du média
     * @param file Nouveau fichier
     * @return MediaDTO mis à jour
     */
    @Transactional
    public MediaDTO updateMedia(Long mediaId, MultipartFile file) {
        log.info("Début update média: mediaId={}, newFileName={}", mediaId, file.getOriginalFilename());

        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found: " + mediaId));

        // Suppression de l'ancien fichier S3
        String oldS3Key = extractS3KeyFromUrl(media.getUrl());
        try {
            amazonS3.deleteObject(bucketName, oldS3Key);
            log.info("Ancien fichier S3 supprimé: {}", oldS3Key);
        } catch (Exception e) {
            log.error("⚠️ Erreur suppression ancien fichier S3: {}", e.getMessage());
        }

        // Upload du nouveau fichier
        try {
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            String s3Key = mediaFolder + uniqueFileName;

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());
            metadata.addUserMetadata("original-filename", originalFilename);
            metadata.addUserMetadata("media-type", media.getMediaType());

            PutObjectRequest putObjectRequest = new PutObjectRequest(
                    bucketName,
                    s3Key,
                    file.getInputStream(),
                    metadata
            );
            putObjectRequest.setCannedAcl(CannedAccessControlList.Private);
            amazonS3.putObject(putObjectRequest);

            String newUrl = generatePresignedUrl(s3Key);

            // Mise à jour en base
            media.setUrl(newUrl);
            media.setFileName(originalFilename);
            Media updatedMedia = mediaRepository.save(media);

            log.info("✅ Média mis à jour avec succès: id={}", mediaId);
            return mediaMapper.fromMedia(updatedMedia);

        } catch (IOException e) {
            log.error("❌ Erreur lors de la mise à jour du média", e);
            throw new RuntimeException("Erreur update média: " + e.getMessage(), e);
        }
    }

    /**
     * Supprime un média (S3 + base de données)
     *
     * @param mediaId ID du média
     */
    @Transactional
    public void deleteMedia(Long mediaId) {
        log.info("Début suppression média: mediaId={}", mediaId);

        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found: " + mediaId));

        // Suppression du fichier S3
        String s3Key = extractS3KeyFromUrl(media.getUrl());
        try {
            amazonS3.deleteObject(bucketName, s3Key);
            log.info("Fichier S3 supprimé: {}", s3Key);
        } catch (Exception e) {
            log.error("⚠️ Erreur suppression fichier S3: {}", e.getMessage());
        }

        // Suppression en base
        mediaRepository.delete(media);
        log.info("✅ Média supprimé avec succès: id={}", mediaId);
    }

    /**
     * Génère une URL signée valide 7 jours
     */
    private String generatePresignedUrl(String s3Key) {
        java.util.Date expiration = new java.util.Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += 1000 * 60 * 60 * 24 * 7; // 7 jours
        expiration.setTime(expTimeMillis);

        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName, s3Key)
                .withMethod(com.amazonaws.HttpMethod.GET)
                .withExpiration(expiration);

        return amazonS3.generatePresignedUrl(generatePresignedUrlRequest).toString();
    }

    /**
     * Extrait la clé S3 depuis l'URL signée
     */
    private String extractS3KeyFromUrl(String url) {
        // Exemple URL: https://portfolio-bucket.s3.eu-north-1.amazonaws.com/media/uuid.jpg?params...
        // On extrait "media/uuid.jpg"
        try {
            String path = url.split("\\?")[0]; // Supprime les query params
            String[] parts = path.split(".com/");
            return parts.length > 1 ? parts[1] : mediaFolder;
        } catch (Exception e) {
            log.error("Erreur extraction clé S3 depuis URL: {}", url, e);
            return mediaFolder;
        }
    }
}
