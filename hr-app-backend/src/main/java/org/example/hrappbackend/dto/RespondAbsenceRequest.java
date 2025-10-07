package org.example.hrappbackend.dto;

import jakarta.validation.constraints.NotNull;
import org.example.hrappbackend.entity.AbsenceRequest;

public record RespondAbsenceRequest(
        @NotNull(message = "Status is required")
        AbsenceRequest.AbsenceStatus status,

        String managerComment
) {
}

