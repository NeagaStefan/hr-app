package org.example.hrappbackend.dto;

import org.example.hrappbackend.entity.AbsenceRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record AbsenceRequestDTO(
        UUID id,
        EmployeeDTO employee,
        LocalDate startDate,
        LocalDate endDate,
        AbsenceRequest.AbsenceType type,
        String reason,
        AbsenceRequest.AbsenceStatus status,
        EmployeeDTO approvedBy,
        LocalDateTime requestedAt,
        LocalDateTime respondedAt,
        String managerComment
) {

}