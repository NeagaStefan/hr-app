package org.example.hrappbackend.controller;

import org.example.hrappbackend.dto.CreateTeamRequest;
import org.example.hrappbackend.dto.EmployeeDTO;
import org.example.hrappbackend.dto.TeamDTO;
import org.example.hrappbackend.entity.Employee;
import org.example.hrappbackend.entity.User;
import org.example.hrappbackend.repository.UserRepository;
import org.example.hrappbackend.service.TeamService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TeamControllerTest {

    @Mock
    private TeamService teamService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TeamController teamController;

    private Authentication authentication;
    private User user;
    private UUID employeeId;

    @BeforeEach
    void setUp() {
        employeeId = UUID.randomUUID();
        Employee employee = new Employee();
        employee.setId(employeeId);

        user = new User();
        user.setUsername("testuser");
        user.setEmployee(employee);

        authentication = new UsernamePasswordAuthenticationToken("testuser", "password");
    }

    @Test
    @WithMockUser(roles = "HR")
    void createTeamReturnsCreatedTeamWhenRequestIsValid() {
        CreateTeamRequest request = new CreateTeamRequest();
        request.setName("New Team");

        TeamDTO createdTeam = new TeamDTO();
        createdTeam.setId(UUID.randomUUID());
        createdTeam.setName("New Team");

        when(teamService.createTeam(request)).thenReturn(createdTeam);

        ResponseEntity<TeamDTO> response = teamController.createTeam(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(createdTeam, response.getBody());
    }

    @Test
    @WithMockUser(roles = "HR")
    void createTeamThrowsExceptionWhenServiceFails() {
        CreateTeamRequest request = new CreateTeamRequest();
        request.setName("New Team");

        when(teamService.createTeam(request)).thenThrow(new RuntimeException("Service failure"));

        assertThrows(RuntimeException.class, () -> teamController.createTeam(request));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getAllTeamsReturnsListOfTeams() {
        TeamDTO team1 = new TeamDTO();
        team1.setId(UUID.randomUUID());
        team1.setName("Team 1");

        TeamDTO team2 = new TeamDTO();
        team2.setId(UUID.randomUUID());
        team2.setName("Team 2");

        List<TeamDTO> teams = List.of(team1, team2);

        when(teamService.getAllTeams()).thenReturn(teams);

        ResponseEntity<List<TeamDTO>> response = teamController.getAllTeams();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(teams, response.getBody());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getAllTeamsThrowsExceptionWhenServiceFails() {
        when(teamService.getAllTeams()).thenThrow(new RuntimeException("Service failure"));

        assertThrows(RuntimeException.class, () -> teamController.getAllTeams());
    }

    @Test
    @WithMockUser(roles = "HR")
    void updateTeamReturnsUpdatedTeamWhenRequestIsValid() {
        UUID teamId = UUID.randomUUID();
        CreateTeamRequest request = new CreateTeamRequest();
        request.setName("Updated Team");

        TeamDTO updatedTeam = new TeamDTO();
        updatedTeam.setId(teamId);
        updatedTeam.setName("Updated Team");

        when(teamService.updateTeam(teamId, request)).thenReturn(updatedTeam);

        ResponseEntity<TeamDTO> response = teamController.updateTeam(teamId, request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedTeam, response.getBody());
    }

    @Test
    @WithMockUser(roles = "HR")
    void updateTeamThrowsExceptionWhenServiceFails() {
        UUID teamId = UUID.randomUUID();
        CreateTeamRequest request = new CreateTeamRequest();
        request.setName("Updated Team");

        when(teamService.updateTeam(teamId, request)).thenThrow(new RuntimeException("Service failure"));

        assertThrows(RuntimeException.class, () -> teamController.updateTeam(teamId, request));
    }

    @Test
    @WithMockUser
    void getMyTeamMembersReturnsMembersWhenUserIsEmployee() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        List<EmployeeDTO> teamMembers = Collections.singletonList(new EmployeeDTO(employeeId, "testuser", "lastname", "test@user.com", "pos", "dep", LocalDate.now(), BigDecimal.TEN, null, null, List.of()));
        ;
        when(teamService.getMyTeamMembers(employeeId)).thenReturn(teamMembers);

        ResponseEntity<List<EmployeeDTO>> response = teamController.getMyTeamMembers(authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(teamMembers, response.getBody());
    }

    @Test
    @WithMockUser
    void getMyTeamMembersThrowsExceptionWhenUserNotFound() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> teamController.getMyTeamMembers(authentication));
    }

    @Test
    @WithMockUser
    void getMyTeamReturnsTeamDetailsWhenTeamExists() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        TeamDTO team = new TeamDTO();
        when(teamService.getEmployeeTeam(employeeId)).thenReturn(team);

        ResponseEntity<TeamDTO> response = teamController.getMyTeam(authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(team, response.getBody());
    }

    @Test
    @WithMockUser
    void getMyTeamReturnsNotFoundWhenTeamDoesNotExist() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(teamService.getEmployeeTeam(employeeId)).thenReturn(null);

        ResponseEntity<TeamDTO> response = teamController.getMyTeam(authentication);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    @WithMockUser
    void getMyTeamThrowsExceptionWhenUserNotFound() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> teamController.getMyTeam(authentication));
    }
}