package fr.kolgna_sec.portfolio_api.cv_generate.controller;

import fr.kolgna_sec.portfolio_api.cv_generate.service.CvService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;

@RestController
@RequiredArgsConstructor
@RequestMapping("cv")
public class CvController {

    private final CvService cvService;

    @GetMapping("/download")
    public ResponseEntity<InputStreamResource> downloadCv()
    {
        ByteArrayInputStream pdfStream = cvService.generateCvPdf();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=cv.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdfStream));
    }

}
