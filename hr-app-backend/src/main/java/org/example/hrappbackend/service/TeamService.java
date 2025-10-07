package org.example.hrappbackend.service;

import lombok.RequiredArgsConstructor;
import org.example.hrappbackend.dto.CreateTeamRequest;
import org.example.hrappbackend.dto.EmployeeDTO;
import org.example.hrappbackend.dto.TeamDTO;
import org.example.hrappbackend.entity.Employee;
import org.example.hrappbackend.entity.Team;
import org.example.hrappbackend.repository.EmployeeRepository;
import org.example.hrappbackend.repository.TeamRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final EmployeeRepository employeeRepository;

    public TeamDTO createTeam(CreateTeamRequest request) {
        Team team = new Team();
        team.setName(request.getName());

        if (request.getManagerId() != null) {
            Employee manager = employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new RuntimeException("Manager not found"));
            team.setManager(manager);
        }

        if (request.getEmployeeIds() != null && !request.getEmployeeIds().isEmpty()) {
            getEmployeesSet(request, team);
        }

        Team savedTeam = teamRepository.save(team);
        return savedTeam.toDTO();
    }

    private void getEmployeesSet(CreateTeamRequest request, Team team) {
        Set<Employee> employees = new HashSet<>();
        for (UUID employeeId : request.getEmployeeIds()) {
            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new RuntimeException("Employee not found: " + employeeId));
            employees.add(employee);
        }
        team.setEmployees(employees);
    }

    public List<TeamDTO> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(Team::toDTO)
                .collect(Collectors.toList());
    }

    public List<EmployeeDTO> getMyTeamMembers(UUID employeeId) {
        return teamRepository.findAll().stream()
                .filter(team -> team.getEmployees() != null &&
                                team.getEmployees().stream().anyMatch(e -> e.getId().equals(employeeId)))
                .flatMap(team -> {
                    Set<Employee> members = new HashSet<>(team.getEmployees());
                    if (team.getManager() != null) {
                        members.add(team.getManager());
                    }
                    return members.stream();
                })
                .filter(e -> !e.getId().equals(employeeId))
                .distinct()
                .map(Employee::toDTO)
                .collect(Collectors.toList());
    }

    public TeamDTO getEmployeeTeam(UUID employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (employee.getTeams() != null && !employee.getTeams().isEmpty()) {
            return employee.getTeams().stream()
                    .findFirst()
                    .map(Team::toDTO)
                    .orElse(null);
        }

        return null;
    }

    public TeamDTO updateTeam(UUID teamId, CreateTeamRequest request) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        team.setName(request.getName());

        if (request.getManagerId() != null) {
            Employee manager = employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new RuntimeException("Manager not found"));
            team.setManager(manager);
        } else {
            team.setManager(null);
        }

        if (request.getEmployeeIds() != null) {
            getEmployeesSet(request, team);
        } else {
            team.setEmployees(new HashSet<>());
        }

        Team savedTeam = teamRepository.save(team);
        return savedTeam.toDTO();
    }
}
