package org.example.hrappbackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.hrappbackend.controller.doc.TeamAPI;
import org.example.hrappbackend.dto.CreateTeamRequest;
import org.example.hrappbackend.dto.EmployeeDTO;
import org.example.hrappbackend.dto.TeamDTO;
import org.example.hrappbackend.entity.User;
import org.example.hrappbackend.repository.UserRepository;
import org.example.hrappbackend.service.TeamService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController implements TeamAPI {

    private final TeamService teamService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('HR', 'ADMIN', 'MANAGER')")
    public ResponseEntity<TeamDTO> createTeam(@RequestBody CreateTeamRequest request) {
        TeamDTO createdTeam = teamService.createTeam(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTeam);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('HR', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @PutMapping("/{teamId}")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN', 'MANAGER')")
    public ResponseEntity<TeamDTO> updateTeam(@PathVariable UUID teamId, @RequestBody CreateTeamRequest request) {
        TeamDTO updatedTeam = teamService.updateTeam(teamId, request);
        return ResponseEntity.ok(updatedTeam);
    }

    @GetMapping("/my-team/members")
    public ResponseEntity<List<EmployeeDTO>> getMyTeamMembers(Authentication authentication) {
        UUID employeeId = getEmployeeIdFromAuth(authentication);
        List<EmployeeDTO> teamMembers = teamService.getMyTeamMembers(employeeId);
        return ResponseEntity.ok(teamMembers);
    }

    @GetMapping("/my-team/details")
    public ResponseEntity<TeamDTO> getMyTeam(Authentication authentication) {
        UUID employeeId = getEmployeeIdFromAuth(authentication);
        TeamDTO team = teamService.getEmployeeTeam(employeeId);

        if (team == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(team);
    }

    private UUID getEmployeeIdFromAuth(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getEmployee().getId();
    }
}
