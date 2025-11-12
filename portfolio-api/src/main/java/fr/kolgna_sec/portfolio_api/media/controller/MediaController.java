package fr.kolgna_sec.portfolio_api.media.controller;

import fr.kolgna_sec.portfolio_api.media.dto.MediaDTO;
import fr.kolgna_sec.portfolio_api.media.service.MediaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("media")
@Slf4j
@CrossOrigin(origins = {"http://localhost:4200", "https://kolie-portfolio.org", "https://v2.kolie-portfolio.org"})
public class MediaController {

    private final MediaService mediaService;

    /**
     * Upload d'un nouveau média
     *
     * POST /media/upload
     * @param file Le fichier à uploader
     * @param mediaType Type initial (image/video)
     * @param accountId ID du compte
     * @return MediaDTO du média créé
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MediaDTO> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam("mediaType") String mediaType,
            @RequestParam("accountId") Long accountId
    ) {
        log.info("📤 POST /media/upload - fileName={}, type={}, accountId={}",
                file.getOriginalFilename(), mediaType, accountId);

        try {
            MediaDTO mediaDTO = mediaService.uploadMedia(file, mediaType, accountId);
            return ResponseEntity.status(HttpStatus.CREATED).body(mediaDTO);
        } catch (Exception e) {
            log.error("❌ Erreur upload média", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Tag un média existant (lab, schema reseau, demo vlan)
     * DÉCLENCHE LA PERSISTANCE AWS
     *
     * POST /media/{id}/tag
     * @param mediaId ID du média
     * @param tag Tag à appliquer
     * @return MediaDTO mis à jour
     */
    @PostMapping("/{id}/tag")
    public ResponseEntity<MediaDTO> tagMedia(
            @PathVariable("id") Long mediaId,
            @RequestParam("tag") String tag
    ) {
        log.info("🏷️ POST /media/{}/tag - tag={}", mediaId, tag);

        try {
            MediaDTO mediaDTO = mediaService.tagMedia(mediaId, tag);
            return ResponseEntity.ok(mediaDTO);
        } catch (RuntimeException e) {
            log.error("❌ Erreur tag média: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("❌ Erreur tag média", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupère tous les médias d'un compte
     *
     * GET /media?accountId={accountId}
     * @param accountId ID du compte
     * @return Liste des MediaDTO
     */
    @GetMapping
    public ResponseEntity<List<MediaDTO>> getAllMedia(@RequestParam("accountId") Long accountId) {
        log.info("📋 GET /media?accountId={}", accountId);

        try {
            List<MediaDTO> mediaList = mediaService.getAllMediaByAccount(accountId);
            return ResponseEntity.ok(mediaList);
        } catch (Exception e) {
            log.error("❌ Erreur récupération médias", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupère les médias d'un compte filtrés par tag (PUBLIC)
     *
     * GET /media/public?accountId={accountId}&tag={tag}
     * @param accountId ID du compte
     * @param tag Tag du média (lab, schema reseau, demo vlan)
     * @return Liste des MediaDTO filtrés
     */
    @GetMapping("/public")
    public ResponseEntity<List<MediaDTO>> getMediaByTag(
            @RequestParam("accountId") Long accountId,
            @RequestParam("tag") String tag
    ) {
        log.info("🌐 GET /media/public?accountId={}&tag={}", accountId, tag);

        try {
            List<MediaDTO> mediaList = mediaService.getMediaByAccountAndTag(accountId, tag);
            return ResponseEntity.ok(mediaList);
        } catch (Exception e) {
            log.error("❌ Erreur récupération médias publics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Met à jour un média (remplace le fichier)
     *
     * PUT /media/{id}
     * @param mediaId ID du média
     * @param file Nouveau fichier
     * @return MediaDTO mis à jour
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MediaDTO> updateMedia(
            @PathVariable("id") Long mediaId,
            @RequestParam("file") MultipartFile file
    ) {
        log.info("🔄 PUT /media/{} - newFileName={}", mediaId, file.getOriginalFilename());

        try {
            MediaDTO mediaDTO = mediaService.updateMedia(mediaId, file);
            return ResponseEntity.ok(mediaDTO);
        } catch (RuntimeException e) {
            log.error("❌ Erreur update média: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("❌ Erreur update média", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Supprime un média
     *
     * DELETE /media/{id}
     * @param mediaId ID du média
     * @return 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedia(@PathVariable("id") Long mediaId) {
        log.info("🗑️ DELETE /media/{}", mediaId);

        try {
            mediaService.deleteMedia(mediaId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("❌ Erreur delete média: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("❌ Erreur delete média", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
