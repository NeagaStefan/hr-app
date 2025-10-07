package org.example.hrappbackend.controller;

import org.example.hrappbackend.dto.AbsenceRequestDTO;
import org.example.hrappbackend.dto.CreateAbsenceRequest;
import org.example.hrappbackend.dto.EmployeeDTO;
import org.example.hrappbackend.dto.RespondAbsenceRequest;
import org.example.hrappbackend.entity.AbsenceRequest;
import org.example.hrappbackend.entity.Employee;
import org.example.hrappbackend.entity.User;
import org.example.hrappbackend.repository.UserRepository;
import org.example.hrappbackend.service.AbsenceRequestService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AbsenceRequestControllerTest {

    @Mock
    private AbsenceRequestService absenceRequestService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AbsenceRequestController controller;

    private UUID employeeId;
    private User user;
    private Employee employee;
    private AbsenceRequestDTO absenceRequestDTO;
    private CreateAbsenceRequest createRequest;
    private RespondAbsenceRequest respondRequest;

    @BeforeEach
    void setUp() {
        employeeId = UUID.randomUUID();
        employee = new Employee();
        employee.setId(employeeId);

        user = new User();
        user.setUsername("testuser");
        user.setEmployee(employee);

        EmployeeDTO employeeDTO = new EmployeeDTO(
            employeeId,
            "John",
            "Doe",
            "john.doe@example.com",
            "Developer",
            "IT",
            LocalDate.of(2020, 1, 1),
            null,
            null,
            null,
            null
        );

        absenceRequestDTO = new AbsenceRequestDTO(
            UUID.randomUUID(),
            employeeDTO,
            LocalDate.now(),
            LocalDate.now().plusDays(5),
            AbsenceRequest.AbsenceType.VACATION,
            "Family trip",
            AbsenceRequest.AbsenceStatus.PENDING,
            null,
            LocalDate.now().atStartOfDay(),
            null,
            null
        );

        createRequest = new CreateAbsenceRequest(
            LocalDate.now(),
            LocalDate.now().plusDays(5),
            AbsenceRequest.AbsenceType.VACATION,
            "Family trip"
        );

        respondRequest = new RespondAbsenceRequest(AbsenceRequest.AbsenceStatus.APPROVED, "Approved for vacation");
    }

    @Test
    void createsAbsenceRequestSuccessfully() {
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(absenceRequestService.createAbsenceRequest(eq(employeeId), any(CreateAbsenceRequest.class)))
            .thenReturn(absenceRequestDTO);

        ResponseEntity<AbsenceRequestDTO> response = controller.createAbsenceRequest(createRequest, authentication);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(absenceRequestDTO, response.getBody());
        verify(absenceRequestService).createAbsenceRequest(eq(employeeId), any(CreateAbsenceRequest.class));
    }

    @Test
    void throwsExceptionWhenUserNotFoundDuringAbsenceRequestCreation() {
        when(authentication.getName()).thenReturn("nonexistent");
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> controller.createAbsenceRequest(createRequest, authentication));
        verify(absenceRequestService, never()).createAbsenceRequest(any(), any());
    }

    @Test
    void retrievesMyAbsenceRequestsSuccessfully() {
        List<AbsenceRequestDTO> requests = List.of(absenceRequestDTO);
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(absenceRequestService.getMyAbsenceRequests(employeeId)).thenReturn(requests);

        ResponseEntity<List<AbsenceRequestDTO>> response = controller.getMyAbsenceRequests(authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(requests, response.getBody());
        verify(absenceRequestService).getMyAbsenceRequests(employeeId);
    }

    @Test
    void returnsEmptyListWhenNoAbsenceRequestsExist() {
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(absenceRequestService.getMyAbsenceRequests(employeeId)).thenReturn(Collections.emptyList());

        ResponseEntity<List<AbsenceRequestDTO>> response = controller.getMyAbsenceRequests(authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void retrievesTeamAbsenceRequestsSuccessfully() {
        List<AbsenceRequestDTO> teamRequests = List.of(absenceRequestDTO);
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(absenceRequestService.getTeamAbsenceRequests(employeeId)).thenReturn(teamRequests);

        ResponseEntity<List<AbsenceRequestDTO>> response = controller.getTeamAbsenceRequests(authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(teamRequests, response.getBody());
        verify(absenceRequestService).getTeamAbsenceRequests(employeeId);
    }

    @Test
    void respondsToAbsenceRequestSuccessfully() {
        UUID requestId = UUID.randomUUID();
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(absenceRequestService.respondToAbsenceRequest(requestId, employeeId, respondRequest))
            .thenReturn(absenceRequestDTO);

        ResponseEntity<AbsenceRequestDTO> response = controller.respondToAbsenceRequest(requestId, respondRequest, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(absenceRequestDTO, response.getBody());
        verify(absenceRequestService).respondToAbsenceRequest(requestId, employeeId, respondRequest);
    }

    @Test
    void throwsExceptionWhenUserNotFoundDuringResponseToAbsenceRequest() {
        UUID requestId = UUID.randomUUID();
        when(authentication.getName()).thenReturn("nonexistent");
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
            () -> controller.respondToAbsenceRequest(requestId, respondRequest, authentication));
        verify(absenceRequestService, never()).respondToAbsenceRequest(any(), any(), any());
    }

    @Test
    void throwsExceptionWhenUserHasNoEmployeeProfile() {
        User userWithoutEmployee = new User();
        userWithoutEmployee.setUsername("testuser");
        userWithoutEmployee.setEmployee(null);

        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(userWithoutEmployee));

        assertThrows(NullPointerException.class, () -> controller.getMyAbsenceRequests(authentication));
    }
}