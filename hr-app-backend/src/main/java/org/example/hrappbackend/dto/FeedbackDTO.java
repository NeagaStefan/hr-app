package org.example.hrappbackend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record FeedbackDTO(
        UUID id,
        EmployeeDTO fromEmployee,
        EmployeeDTO toEmployee,
        String feedbackText,
        LocalDateTime timestamp
) {
}

