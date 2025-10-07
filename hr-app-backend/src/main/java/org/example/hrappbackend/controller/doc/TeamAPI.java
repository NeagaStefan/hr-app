package org.example.hrappbackend.controller.doc;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.hrappbackend.dto.CreateTeamRequest;
import org.example.hrappbackend.dto.TeamDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;

@Tag(name = "Teams", description = "Team management APIs")
public interface TeamAPI {

    @Operation(
            summary = "Create a new team",
            description = "Create a new team with the provided details. Requires HR, ADMIN, or MANAGER role."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Team successfully created",
                    content = @Content(schema = @Schema(implementation = TeamDTO.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - insufficient permissions",
                    content = @Content
            )
    })
    ResponseEntity<TeamDTO> createTeam(@Valid @RequestBody CreateTeamRequest request);

    @Operation(
            summary = "Get all teams",
            description = "Retrieve a list of all teams. Requires HR, ADMIN, or MANAGER role."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved teams",
                    content = @Content(schema = @Schema(implementation = TeamDTO.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - insufficient permissions",
                    content = @Content
            )
    })
    ResponseEntity<List<TeamDTO>> getAllTeams();

    @Operation(
            summary = "Update a team",
            description = "Update an existing team by ID. Requires HR, ADMIN, or MANAGER role."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Team successfully updated",
                    content = @Content(schema = @Schema(implementation = TeamDTO.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - insufficient permissions",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Team not found",
                    content = @Content
            )
    })
    ResponseEntity<TeamDTO> updateTeam(@PathVariable UUID teamId, @Valid @RequestBody CreateTeamRequest request);
}