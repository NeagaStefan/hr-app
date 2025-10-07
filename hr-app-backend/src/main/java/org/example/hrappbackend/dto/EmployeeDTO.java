package org.example.hrappbackend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record EmployeeDTO(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String position,
        String department,
        LocalDate hireDate,
        BigDecimal salary,
        UUID managerId,
        String managerName,
        List<UUID> teamIds
) {
}