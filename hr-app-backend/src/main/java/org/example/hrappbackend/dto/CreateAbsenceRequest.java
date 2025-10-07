package org.example.hrappbackend.dto;

import jakarta.validation.constraints.NotNull;
import org.example.hrappbackend.entity.AbsenceRequest;

import java.time.LocalDate;

public record CreateAbsenceRequest(
        @NotNull(message = "Start date is required")
        LocalDate startDate,

        @NotNull(message = "End date is required")
        LocalDate endDate,

        @NotNull(message = "Absence type is required")
        AbsenceRequest.AbsenceType type,

        String reason
) {
}