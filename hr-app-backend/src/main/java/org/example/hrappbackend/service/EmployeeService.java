package org.example.hrappbackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.hrappbackend.dto.CreateEmployeeRequest;
import org.example.hrappbackend.dto.EmployeeDTO;
import org.example.hrappbackend.dto.UpdateEmployeeRequest;
import org.example.hrappbackend.dto.UpdateOwnProfileRequest;
import org.example.hrappbackend.entity.Employee;
import org.example.hrappbackend.entity.Team;
import org.example.hrappbackend.entity.User;
import org.example.hrappbackend.exception.DuplicateEmailException;
import org.example.hrappbackend.repository.EmployeeRepository;
import org.example.hrappbackend.repository.TeamRepository;
import org.example.hrappbackend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    @Transactional(readOnly = true)
    public Optional<EmployeeDTO> getCurrentEmployeeProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .map(User::getEmployee)
                .map(Employee::toDTO);
    }

    public List<EmployeeDTO> getAllEmployees() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .orElseThrow()
                .getAuthority();

        if (role.equals("ROLE_HR") || role.equals("ROLE_ADMIN")) {
            return employeeRepository.findAll().stream().map(Employee::toDTO).toList();
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getEmployee() == null) {
            return List.of();
        }

        if (role.equals("ROLE_MANAGER")) {
            List<Employee> employees = employeeRepository.findAll();
            UUID managerId = user.getEmployee().getId();

            return employees.stream()
                    .filter(emp -> emp.getManager() != null && emp.getManager().getId().equals(managerId))
                    .map(Employee::toDTO)
                    .collect(Collectors.toList());
        }

        return List.of();
    }

    public Optional<EmployeeDTO> getEmployeeById(UUID id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .orElseThrow()
                .getAuthority();

        Optional<Employee> employee = employeeRepository.getEmployeeById(id);

        if (employee.isEmpty()) {
            return Optional.empty();
        }

        if (role.equals("ROLE_HR") || role.equals("ROLE_ADMIN")) {
            return employee.map(Employee::toDTO);
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getEmployee() == null) {
            return Optional.empty();
        }

        UUID currentEmployeeId = user.getEmployee().getId();

        if (role.equals("ROLE_MANAGER")) {
            Employee emp = employee.get();
            if (emp.getId().equals(currentEmployeeId) ||
                (emp.getManager() != null && emp.getManager().getId().equals(currentEmployeeId))) {
                return employee.map(Employee::toDTO);
            }
            return Optional.empty();
        }

        if (role.equals("ROLE_EMPLOYEE")) {
            if (employee.get().getId().equals(currentEmployeeId)) {
                return employee.map(Employee::toDTO);
            }
            return Optional.empty();
        }

        return Optional.empty();
    }

    public EmployeeDTO createEmployee(CreateEmployeeRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .orElseThrow()
                .getAuthority();

        if (employeeRepository.findByEmail(request.email()).isPresent()) {
            throw new DuplicateEmailException("Email address is already in use");
        }

        Employee employee = new Employee();
        employee.setFirstName(request.firstName());
        employee.setLastName(request.lastName());
        employee.setEmail(request.email());
        employee.setPosition(request.position());
        employee.setDepartment(request.department());
        employee.setHireDate(request.hireDate());
        employee.setSalary(request.salary());

        if (role.equals("ROLE_MANAGER")) {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (user.getEmployee() != null) {
                employee.setManager(user.getEmployee());
            }
        } else if (request.managerId() != null) {
            employeeRepository.getEmployeeById(request.managerId())
                    .ifPresent(employee::setManager);
        }

        Employee savedEmployee = employeeRepository.save(employee);

        if (request.teamIds() != null && !request.teamIds().isEmpty()) {
            Set<Team> teams = new HashSet<>();
            for (UUID teamId : request.teamIds()) {
                teamRepository.findById(teamId).ifPresent(teams::add);
            }

            for (Team team : teams) {
                if (team.getEmployees() == null) {
                    team.setEmployees(new HashSet<>());
                }
                team.getEmployees().add(savedEmployee);
                teamRepository.save(team);
            }
        }

        return savedEmployee.toDTO();
    }


    public Optional<EmployeeDTO> updateEmployee(UUID id, UpdateEmployeeRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .orElseThrow()
                .getAuthority();

        if (!role.equals("ROLE_HR") && !role.equals("ROLE_ADMIN")) {
            if (role.equals("ROLE_MANAGER")) {
                User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                if (user.getEmployee() == null) {
                    throw new SecurityException("You do not have permission to update employee records");
                }

                UUID managerId = user.getEmployee().getId();
                Optional<Employee> employeeToUpdate = employeeRepository.getEmployeeById(id);

                if (employeeToUpdate.isEmpty()) {
                    return Optional.empty();
                }

                Employee emp = employeeToUpdate.get();


                if (emp.getId().equals(managerId)) {
                    throw new SecurityException("Managers cannot edit their own data");
                }

                if (emp.getManager() == null || !emp.getManager().getId().equals(managerId)) {
                    throw new SecurityException("You can only edit your direct reports");
                }
            } else {
                throw new SecurityException("You do not have permission to update employee records");
            }
        }

        return employeeRepository.getEmployeeById(id)
                .map(existingEmployee -> {
                    if (!existingEmployee.getEmail().equals(request.email())) {
                        if (employeeRepository.findByEmail(request.email()).isPresent()) {
                            throw new DuplicateEmailException("Email address is already in use");
                        }
                    }

                    existingEmployee.setFirstName(request.firstName());
                    existingEmployee.setLastName(request.lastName());
                    existingEmployee.setEmail(request.email());

                    if (request.position() != null) {
                        existingEmployee.setPosition(request.position());
                    }
                    if (request.department() != null) {
                        existingEmployee.setDepartment(request.department());
                    }
                    if (request.hireDate() != null) {
                        existingEmployee.setHireDate(request.hireDate());
                    }
                    if (request.salary() != null) {
                        existingEmployee.setSalary(request.salary());
                    }

                    if (request.managerId() != null) {
                        employeeRepository.getEmployeeById(request.managerId())
                                .ifPresent(existingEmployee::setManager);
                    }

                    Employee updated = employeeRepository.save(existingEmployee);

                    if (request.teamIds() != null) {
                        List<Team> allTeams = teamRepository.findAll();
                        for (Team team : allTeams) {
                            if (team.getEmployees() != null && team.getEmployees().removeIf(e -> e.getId().equals(id))) {
                                teamRepository.save(team);
                            }
                        }

                        if (!request.teamIds().isEmpty()) {
                            for (UUID teamId : request.teamIds()) {
                                teamRepository.findById(teamId).ifPresent(team -> {
                                    if (team.getEmployees() == null) {
                                        team.setEmployees(new HashSet<>());
                                    }
                                    team.getEmployees().add(updated);
                                    teamRepository.save(team);
                                });
                            }
                        }
                    }

                    return updated.toDTO();
                });
    }

    @Transactional
    public boolean deleteEmployee(UUID id) {
        Optional<Employee> employeeOpt = employeeRepository.getEmployeeById(id);
        if (employeeOpt.isPresent()) {
            Employee employee = employeeOpt.get();

            for (Team team : employee.getTeams()) {
                team.getEmployees().remove(employee);
            }
            teamRepository.saveAll(employee.getTeams());


            Optional<User> userOpt = userRepository.findByEmployee(employee);
            userOpt.ifPresent(userRepository::delete);

            employeeRepository.deleteByIdEquals(id);
            return true;
        }
        return false;
    }

    @Transactional
    public Optional<EmployeeDTO> updateOwnProfile(UpdateOwnProfileRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getEmployee() == null) {
            throw new RuntimeException("No employee profile found for current user");
        }

        Employee currentEmployee = user.getEmployee();

        return employeeRepository.getEmployeeById(currentEmployee.getId())
                .map(existingEmployee -> {
                    if (!existingEmployee.getEmail().equals(request.email())) {
                        if (employeeRepository.findByEmail(request.email()).isPresent()) {
                            throw new DuplicateEmailException("Email address is already in use");
                        }
                    }

                    existingEmployee.setFirstName(request.firstName());
                    existingEmployee.setLastName(request.lastName());
                    existingEmployee.setEmail(request.email());

                    if (request.position() != null) {
                        existingEmployee.setPosition(request.position());
                    }
                    if (request.department() != null) {
                        existingEmployee.setDepartment(request.department());
                    }


                    Employee updated = employeeRepository.save(existingEmployee);

                    if (request.teamIds() != null) {
                        List<Team> allTeams = teamRepository.findAll();
                        for (Team team : allTeams) {
                            if (team.getEmployees() != null && team.getEmployees().removeIf(e -> e.getId().equals(currentEmployee.getId()))) {
                                teamRepository.save(team);
                            }
                        }

                        if (!request.teamIds().isEmpty()) {
                            for (UUID teamId : request.teamIds()) {
                                teamRepository.findById(teamId).ifPresent(team -> {
                                    if (team.getEmployees() == null) {
                                        team.setEmployees(new HashSet<>());
                                    }
                                    team.getEmployees().add(updated);
                                    teamRepository.save(team);
                                });
                            }
                        }
                    }

                    return updated.toDTO();
                });
    }

    private void updateTeamsForEmployee(Employee employee, Collection<UUID> newTeamIds) {
        if (newTeamIds == null) return;

        Set<UUID> newTeamIdsSet = new HashSet<>(newTeamIds);

        employee.getTeams().removeIf(team -> !newTeamIdsSet.contains(team.getId()));

        newTeamIdsSet.forEach(teamId -> {
            if (employee.getTeams().stream().noneMatch(t -> t.getId().equals(teamId))) {
                teamRepository.findById(teamId).ifPresent(team -> team.getEmployees().add(employee));
            }
        });
    }

    private void validateUpdatePermissions(Employee employeeToUpdate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .orElseThrow()
                .getAuthority();

        if (!role.equals("ROLE_HR") && !role.equals("ROLE_ADMIN")) {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getEmployee() == null) {
                throw new SecurityException("You do not have permission to update employee records");
            }

            UUID managerId = user.getEmployee().getId();

            if (employeeToUpdate.getId().equals(managerId)) {
                throw new SecurityException("Managers cannot edit their own data");
            }

            if (employeeToUpdate.getManager() == null || !employeeToUpdate.getManager().getId().equals(managerId)) {
                throw new SecurityException("You can only edit your direct reports");
            }
        }
    }

}
