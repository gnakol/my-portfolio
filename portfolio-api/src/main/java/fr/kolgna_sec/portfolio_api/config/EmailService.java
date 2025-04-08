package fr.kolgna_sec.portfolio_api.config;


import fr.kolgna_sec.portfolio_api.contact.dto.ContactDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendNewContactNotification(String toEmail, ContactDTO contact) {
        System.out.println("Mot de passe SMTP : " + System.getenv("YAHOO_APP_PASSWORD"));
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("gna.kolie@yahoo.fr"); // From = ton vrai mail Yahoo ici
        message.setTo(toEmail);
        message.setSubject("📬 Nouveau message sur ton Portfolio !");
        String content = String.format(
                "📨 Un nouveau visiteur t’a contacté via le portfolio !\n\n" +
                        "👉 Email: %s\n" +
                        "📞 Téléphone: %s\n" +
                        "✉️ Message:\n%s\n\n" +
                        "Connecte-toi à ton espace admin pour voir tous les détails.",
                contact.getEmail(),
                contact.getTelephone() != null ? contact.getTelephone() : "Non fourni",
                contact.getMessage()
        );
        message.setText(content);
        mailSender.send(message);
    }

}
