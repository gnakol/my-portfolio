package fr.kolgna_sec.portfolio_api.visit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeleteVisitsBatchRequest {
    private List<Long> ids;
}
