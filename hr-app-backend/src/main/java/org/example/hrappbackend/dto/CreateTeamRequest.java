package org.example.hrappbackend.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class CreateTeamRequest {
    private String name;
    private UUID managerId;
    private List<UUID> employeeIds;
}
