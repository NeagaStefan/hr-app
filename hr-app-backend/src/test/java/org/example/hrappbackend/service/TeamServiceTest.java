package org.example.hrappbackend.service;

import org.example.hrappbackend.dto.CreateTeamRequest;
import org.example.hrappbackend.dto.EmployeeDTO;
import org.example.hrappbackend.dto.TeamDTO;
import org.example.hrappbackend.entity.Employee;
import org.example.hrappbackend.entity.Team;
import org.example.hrappbackend.repository.EmployeeRepository;
import org.example.hrappbackend.repository.TeamRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private TeamService teamService;

    private UUID teamId;
    private UUID employeeId;
    private UUID managerId;
    private Team team;
    private Employee employee;
    private Employee manager;

    @BeforeEach
    void setUp() {
        teamId = UUID.randomUUID();
        employeeId = UUID.randomUUID();
        managerId = UUID.randomUUID();

        employee = new Employee();
        employee.setId(employeeId);
        employee.setFirstName("John");
        employee.setLastName("Doe");
        employee.setEmail("john.doe@example.com");

        manager = new Employee();
        manager.setId(managerId);
        manager.setFirstName("Jane");
        manager.setLastName("Manager");
        manager.setEmail("jane.manager@example.com");

        team = new Team();
        team.setId(teamId);
        team.setName("Engineering Team");
        team.setManager(manager);
        team.setEmployees(new HashSet<>(Set.of(employee)));
    }

    @Test
    void createTeam_succeeds_whenValidRequest() {
        CreateTeamRequest request = new CreateTeamRequest();
        request.setName("New Team");
        request.setManagerId(managerId);
        request.setEmployeeIds(List.of(employeeId));

        when(employeeRepository.findById(managerId)).thenReturn(Optional.of(manager));
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(teamRepository.save(any(Team.class))).thenReturn(team);

        TeamDTO result = teamService.createTeam(request);

        assertNotNull(result);
        assertEquals(teamId, result.getId());
        assertEquals("Engineering Team", result.getName());
        verify(teamRepository, times(1)).save(any(Team.class));
    }

    @Test
    void createTeam_succeeds_withoutManager() {
        CreateTeamRequest request = new CreateTeamRequest();
        request.setName("Team Without Manager");
        request.setEmployeeIds(List.of(employeeId));

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(teamRepository.save(any(Team.class))).thenReturn(team);

        TeamDTO result = teamService.createTeam(request);

        assertNotNull(result);
        verify(teamRepository, times(1)).save(any(Team.class));
    }

    @Test
    void createTeam_succeeds_withoutEmployees() {
        CreateTeamRequest request = new CreateTeamRequest();
        request.setName("Empty Team");
        request.setManagerId(managerId);

        when(employeeRepository.findById(managerId)).thenReturn(Optional.of(manager));
        when(teamRepository.save(any(Team.class))).thenReturn(team);

        TeamDTO result = teamService.createTeam(request);

        assertNotNull(result);
        verify(teamRepository, times(1)).save(any(Team.class));
    }

    @Test
    void createTeam_throwsException_whenManagerNotFound() {
        CreateTeamRequest request = new CreateTeamRequest();
        request.setName("New Team");
        request.setManagerId(managerId);

        when(employeeRepository.findById(managerId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> teamService.createTeam(request));

        assertEquals("Manager not found", exception.getMessage());
        verify(teamRepository, never()).save(any(Team.class));
    }

    @Test
    void createTeam_throwsException_whenEmployeeNotFound() {
        CreateTeamRequest request = new CreateTeamRequest();
        request.setName("New Team");
        request.setEmployeeIds(List.of(employeeId));

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> teamService.createTeam(request));

        assertTrue(exception.getMessage().contains("Employee not found"));
        verify(teamRepository, never()).save(any(Team.class));
    }

    @Test
    void getAllTeams_returnsListOfTeams() {
        Team team2 = new Team();
        team2.setId(UUID.randomUUID());
        team2.setName("Marketing Team");

        when(teamRepository.findAll()).thenReturn(List.of(team, team2));

        List<TeamDTO> result = teamService.getAllTeams();

        assertEquals(2, result.size());
        assertEquals("Engineering Team", result.get(0).getName());
        assertEquals("Marketing Team", result.get(1).getName());
    }

    @Test
    void getAllTeams_returnsEmptyList_whenNoTeamsExist() {
        when(teamRepository.findAll()).thenReturn(List.of());

        List<TeamDTO> result = teamService.getAllTeams();

        assertTrue(result.isEmpty());
    }

    @Test
    void getMyTeamMembers_returnsTeamMembers_excludingSelf() {
        Employee employee2 = new Employee();
        employee2.setId(UUID.randomUUID());
        employee2.setFirstName("Bob");
        employee2.setLastName("Smith");

        team.setEmployees(new HashSet<>(Set.of(employee, employee2)));

        when(teamRepository.findAll()).thenReturn(List.of(team));

        List<EmployeeDTO> result = teamService.getMyTeamMembers(employeeId);

        assertEquals(2, result.size());
        assertTrue(result.stream().noneMatch(e -> e.id().equals(employeeId)));
    }

    @Test
    void getMyTeamMembers_includesManager_whenManagerExists() {
        when(teamRepository.findAll()).thenReturn(List.of(team));

        List<EmployeeDTO> result = teamService.getMyTeamMembers(employeeId);

        assertTrue(result.stream().anyMatch(e -> e.id().equals(managerId)));
    }

    @Test
    void getMyTeamMembers_returnsEmptyList_whenNotInAnyTeam() {
        when(teamRepository.findAll()).thenReturn(List.of(team));

        UUID nonExistentEmployeeId = UUID.randomUUID();
        List<EmployeeDTO> result = teamService.getMyTeamMembers(nonExistentEmployeeId);

        assertTrue(result.isEmpty());
    }

    @Test
    void getMyTeamMembers_returnsDistinctMembers_whenInMultipleTeams() {
        Team team2 = new Team();
        team2.setId(UUID.randomUUID());
        team2.setName("Second Team");
        team2.setEmployees(new HashSet<>(Set.of(employee, manager)));

        when(teamRepository.findAll()).thenReturn(List.of(team, team2));

        List<EmployeeDTO> result = teamService.getMyTeamMembers(employeeId);

        assertEquals(1, result.size());
        assertEquals(managerId, result.getFirst().id());
    }

    @Test
    void getEmployeeTeam_returnsTeam_whenEmployeeInTeam() {
        employee.setTeams(new HashSet<>(Set.of(team)));
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));

        TeamDTO result = teamService.getEmployeeTeam(employeeId);

        assertNotNull(result);
        assertEquals(teamId, result.getId());
        assertEquals("Engineering Team", result.getName());
    }

    @Test
    void getEmployeeTeam_returnsNull_whenEmployeeNotInAnyTeam() {
        employee.setTeams(new HashSet<>());
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));

        TeamDTO result = teamService.getEmployeeTeam(employeeId);

        assertNull(result);
    }

    @Test
    void getEmployeeTeam_returnsNull_whenTeamsIsNull() {
        employee.setTeams(null);
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));

        TeamDTO result = teamService.getEmployeeTeam(employeeId);

        assertNull(result);
    }

    @Test
    void getEmployeeTeam_throwsException_whenEmployeeNotFound() {
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> teamService.getEmployeeTeam(employeeId));

        assertEquals("Employee not found", exception.getMessage());
    }

    @Test
    void updateTeam_succeeds_whenValidRequest() {
        CreateTeamRequest request = new CreateTeamRequest();
        request.setName("Updated Team");
        request.setManagerId(managerId);
        request.setEmployeeIds(List.of(employeeId));

        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(employeeRepository.findById(managerId)).thenReturn(Optional.of(manager));
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(teamRepository.save(any(Team.class))).thenReturn(team);

        TeamDTO result = teamService.updateTeam(teamId, request);

        assertNotNull(result);
        verify(teamRepository, times(1)).save(any(Team.class));
    }

    @Test
    void updateTeam_removesManager_whenManagerIdIsNull() {
        CreateTeamRequest request = new CreateTeamRequest();
        request.setName("Updated Team");
        request.setManagerId(null);
        request.setEmployeeIds(List.of(employeeId));

        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(teamRepository.save(any(Team.class))).thenReturn(team);

        TeamDTO result = teamService.updateTeam(teamId, request);

        assertNotNull(result);
        verify(teamRepository, times(1)).save(any(Team.class));
    }

    @Test
    void updateTeam_clearsEmployees_whenEmployeeIdsIsNull() {
        CreateTeamRequest request = new CreateTeamRequest();
        request.setName("Updated Team");
        request.setManagerId(managerId);
        request.setEmployeeIds(null);

        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(employeeRepository.findById(managerId)).thenReturn(Optional.of(manager));
        when(teamRepository.save(any(Team.class))).thenReturn(team);

        TeamDTO result = teamService.updateTeam(teamId, request);

        assertNotNull(result);
        verify(teamRepository, times(1)).save(any(Team.class));
    }

    @Test
    void updateTeam_throwsException_whenTeamNotFound() {
        CreateTeamRequest request = new CreateTeamRequest();
        request.setName("Updated Team");

        when(teamRepository.findById(teamId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> teamService.updateTeam(teamId, request));

        assertEquals("Team not found", exception.getMessage());
        verify(teamRepository, never()).save(any(Team.class));
    }

    @Test
    void updateTeam_throwsException_whenManagerNotFound() {
        CreateTeamRequest request = new CreateTeamRequest();
        request.setName("Updated Team");
        request.setManagerId(managerId);

        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(employeeRepository.findById(managerId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> teamService.updateTeam(teamId, request));

        assertEquals("Manager not found", exception.getMessage());
        verify(teamRepository, never()).save(any(Team.class));
    }

    @Test
    void updateTeam_throwsException_whenEmployeeNotFound() {
        CreateTeamRequest request = new CreateTeamRequest();
        request.setName("Updated Team");
        request.setEmployeeIds(List.of(employeeId));

        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> teamService.updateTeam(teamId, request));

        assertTrue(exception.getMessage().contains("Employee not found"));
        verify(teamRepository, never()).save(any(Team.class));
    }
}

