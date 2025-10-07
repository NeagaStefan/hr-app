package org.example.hrappbackend.controller;

import org.example.hrappbackend.dto.EmployeeDTO;
import org.example.hrappbackend.dto.UpdateOwnProfileRequest;
import org.example.hrappbackend.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeControllerTest {
    @Mock
    private EmployeeService employeeService;

    @InjectMocks
    private EmployeeController employeeController;

    @WithMockUser(roles = "EMPLOYEE")
    @Test
    void updateMyProfileReturnsUpdatedProfileWhenRequestIsValid() {
        UpdateOwnProfileRequest request = new UpdateOwnProfileRequest("John", "Doe", "john.doe@example.com", "Senior Manager", "HR", List.of());
        EmployeeDTO updatedProfile = new EmployeeDTO(UUID.randomUUID(), "John", "Doe", "john.doe@example.com", "Senior Manager", "HR", LocalDate.now(), new BigDecimal("50000"), null, null, List.of());
        when(employeeService.updateOwnProfile(request)).thenReturn(Optional.of(updatedProfile));

        ResponseEntity<EmployeeDTO> response = employeeController.updateMyProfile(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedProfile, response.getBody());
    }

    @WithMockUser(roles = "EMPLOYEE")
    @Test
    void updateMyProfileReturnsNotFoundWhenProfileDoesNotExist() {
        UpdateOwnProfileRequest request = new UpdateOwnProfileRequest("John", "Doe", "john.doe@example.com", "Senior Manager", "HR", List.of());
        when(employeeService.updateOwnProfile(request)).thenReturn(Optional.empty());

        ResponseEntity<EmployeeDTO> response = employeeController.updateMyProfile(request);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }

    @WithMockUser(roles = "HR")
    @Test
    void getManagersReturnsListOfManagersWhenManagersExist() {
        List<EmployeeDTO> managers = List.of(
                new EmployeeDTO(UUID.randomUUID(), "Alice", "Manager", "alice.manager@example.com", "Manager", "IT", LocalDate.now(), new BigDecimal("80000"), null, null, List.of()),
                new EmployeeDTO(UUID.randomUUID(), "Bob", "Lead", "bob.lead@example.com", "Team Lead", "Finance", LocalDate.now(), new BigDecimal("70000"), null, null, List.of())
        );
        when(employeeService.getAllEmployees()).thenReturn(managers);

        ResponseEntity<List<EmployeeDTO>> response = employeeController.getManagers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(managers, response.getBody());
    }

    @WithMockUser(roles = "HR")
    @Test
    void getManagersReturnsEmptyListWhenNoManagersExist() {
        when(employeeService.getAllEmployees()).thenReturn(List.of());

        ResponseEntity<List<EmployeeDTO>> response = employeeController.getManagers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
    }

    @WithMockUser(roles = "EMPLOYEE")
    @Test
    void getEmployeeByIdReturnsEmployeeWhenExists() {
        UUID employeeId = UUID.randomUUID();
        EmployeeDTO employee = new EmployeeDTO(employeeId, "John", "Doe", "john.doe@example.com", "Developer", "IT", LocalDate.now(), new BigDecimal("60000"), null, null, List.of());
        when(employeeService.getEmployeeById(employeeId)).thenReturn(Optional.of(employee));

        ResponseEntity<EmployeeDTO> response = employeeController.getEmployeeById(employeeId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(employee, response.getBody());
    }

    @WithMockUser(roles = "EMPLOYEE")
    @Test
    void getEmployeeByIdReturnsNotFoundWhenEmployeeDoesNotExist() {
        UUID employeeId = UUID.randomUUID();
        when(employeeService.getEmployeeById(employeeId)).thenReturn(Optional.empty());

        ResponseEntity<EmployeeDTO> response = employeeController.getEmployeeById(employeeId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }

    @WithMockUser(roles = "EMPLOYEE")
    @Test
    void updateMyProfileThrowsExceptionWhenServiceFails() {
        UpdateOwnProfileRequest request = new UpdateOwnProfileRequest("John", "Doe", "john.doe@example.com", "Senior Manager", "HR", List.of());
        when(employeeService.updateOwnProfile(request)).thenThrow(new RuntimeException("Service failure"));

        assertThrows(RuntimeException.class, () -> employeeController.updateMyProfile(request));
    }

    @WithMockUser(roles = "HR")
    @Test
    void getManagersThrowsExceptionWhenServiceFails() {
        when(employeeService.getAllEmployees()).thenThrow(new RuntimeException("Service failure"));

        assertThrows(RuntimeException.class, () -> employeeController.getManagers());
    }

    @WithMockUser(roles = "EMPLOYEE")
    @Test
    void getEmployeeByIdThrowsExceptionWhenServiceFails() {
        UUID employeeId = UUID.randomUUID();
        when(employeeService.getEmployeeById(employeeId)).thenThrow(new RuntimeException("Service failure"));

        assertThrows(RuntimeException.class, () -> employeeController.getEmployeeById(employeeId));
    }

}