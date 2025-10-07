package org.example.hrappbackend.controller.doc;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.hrappbackend.dto.CreateFeedbackRequest;
import org.example.hrappbackend.dto.EmployeeDTO;
import org.example.hrappbackend.dto.FeedbackDTO;
import org.example.hrappbackend.dto.TeamDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;

@Tag(name = "Team & Feedback", description = "Team and Feedback management APIs")
public interface TeamFeedbackApi {

    @Operation(summary = "Get my team members", description = "Retrieve all team members of the current employee (excluding self)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved team members"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    ResponseEntity<List<EmployeeDTO>> getMyTeamMembers(Authentication authentication);

    @Operation(summary = "Get my team details", description = "Retrieve the team details including all members")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved team details"),
            @ApiResponse(responseCode = "404", description = "Team not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    ResponseEntity<TeamDTO> getMyTeam(Authentication authentication);

    @Operation(summary = "Give feedback to a coworker", description = "Submit feedback for another employee in your team")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Feedback created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    ResponseEntity<FeedbackDTO> giveFeedback(@Valid CreateFeedbackRequest request, Authentication authentication);

    @Operation(summary = "Get feedback I received", description = "Retrieve all feedback received by the current employee")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved feedback"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    ResponseEntity<List<FeedbackDTO>> getFeedbackReceived(Authentication authentication);

    @Operation(summary = "Get feedback I gave", description = "Retrieve all feedback given by the current employee")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved feedback"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    ResponseEntity<List<FeedbackDTO>> getFeedbackGiven(Authentication authentication);
}

