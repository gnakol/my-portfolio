package fr.kolgna_sec.portfolio_api.media.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MediaDTO {

    private Long mediaId;

    private Long accountId;

    private String mediaType; // video, photo

    private String url;

    private String thumbnailUrl; // facultatif au début

    private String fileName;

    private String caption;

    private boolean featured = false;

    private Integer orderIndex;

    private LocalDateTime createdAt;
}
