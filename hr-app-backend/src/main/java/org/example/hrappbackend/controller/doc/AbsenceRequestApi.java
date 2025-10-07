package org.example.hrappbackend.controller.doc;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.hrappbackend.dto.AbsenceRequestDTO;
import org.example.hrappbackend.dto.CreateAbsenceRequest;
import org.example.hrappbackend.dto.RespondAbsenceRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.UUID;

@Tag(name = "Absence Requests", description = "Absence request management APIs")
public interface AbsenceRequestApi {

    @Operation(summary = "Create absence request", description = "Employee creates a new absence request")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Absence request created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    ResponseEntity<AbsenceRequestDTO> createAbsenceRequest(@Valid CreateAbsenceRequest request,
                                                            Authentication authentication);

    @Operation(summary = "Get my absence requests", description = "Retrieve all absence requests for the current employee")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved absence requests"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    ResponseEntity<List<AbsenceRequestDTO>> getMyAbsenceRequests(Authentication authentication);

    @Operation(summary = "Get team absence requests", description = "Manager retrieves all absence requests from their team")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved team absence requests"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    ResponseEntity<List<AbsenceRequestDTO>> getTeamAbsenceRequests(Authentication authentication);

    @Operation(summary = "Respond to absence request", description = "Manager approves or rejects an absence request")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Response recorded successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "Absence request not found")
    })
    ResponseEntity<AbsenceRequestDTO> respondToAbsenceRequest(UUID requestId,
                                                               @Valid RespondAbsenceRequest response,
                                                               Authentication authentication);
}

