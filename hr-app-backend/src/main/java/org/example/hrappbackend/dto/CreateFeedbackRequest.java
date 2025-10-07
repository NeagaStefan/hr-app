package org.example.hrappbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateFeedbackRequest(
        @NotNull(message = "To employee ID is required")
        UUID toEmployeeId,

        @NotBlank(message = "Feedback text is required")
        @Size(min = 10, max = 1000, message = "Feedback must be between 10 and 1000 characters")
        String feedbackText
) {
}

