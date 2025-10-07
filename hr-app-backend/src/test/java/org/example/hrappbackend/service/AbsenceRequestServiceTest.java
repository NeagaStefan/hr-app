package org.example.hrappbackend.service;

import org.example.hrappbackend.dto.AbsenceRequestDTO;
import org.example.hrappbackend.dto.CreateAbsenceRequest;
import org.example.hrappbackend.dto.RespondAbsenceRequest;
import org.example.hrappbackend.entity.AbsenceRequest;
import org.example.hrappbackend.entity.Employee;
import org.example.hrappbackend.repository.AbsenceRequestRepository;
import org.example.hrappbackend.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AbsenceRequestServiceTest {

    @Mock
    private AbsenceRequestRepository absenceRequestRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private AbsenceRequestService absenceRequestService;

    private Employee employee;
    private Employee manager;
    private UUID employeeId;
    private UUID managerId;

    @BeforeEach
    void setUp() {
        employeeId = UUID.randomUUID();
        managerId = UUID.randomUUID();

        manager = new Employee();
        manager.setId(managerId);
        manager.setFirstName("Manager");
        manager.setLastName("Test");

        employee = new Employee();
        employee.setId(employeeId);
        employee.setFirstName("Employee");
        employee.setLastName("Test");
        employee.setManager(manager);
    }

    @Test
    void createAbsenceRequest_whenValidRequest_returnsAbsenceRequestDTO() {
        CreateAbsenceRequest request = new CreateAbsenceRequest(LocalDate.now(), LocalDate.now().plusDays(1), AbsenceRequest.AbsenceType.VACATION, "Vacation");
        when(employeeRepository.getEmployeeById(employeeId)).thenReturn(Optional.of(employee));
        when(absenceRequestRepository.save(any(AbsenceRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AbsenceRequestDTO result = absenceRequestService.createAbsenceRequest(employeeId, request);

        assertNotNull(result);
        assertEquals(employeeId, result.employee().id());
        assertEquals(AbsenceRequest.AbsenceStatus.PENDING, result.status());
    }

    @Test
    void createAbsenceRequest_whenEmployeeNotFound_throwsException() {
        CreateAbsenceRequest request = new CreateAbsenceRequest(LocalDate.now(), LocalDate.now().plusDays(1), AbsenceRequest.AbsenceType.VACATION, "Vacation");
        when(employeeRepository.getEmployeeById(employeeId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> absenceRequestService.createAbsenceRequest(employeeId, request));
    }

    @Test
    void createAbsenceRequest_whenEndDateIsBeforeStartDate_throwsException() {
        CreateAbsenceRequest request = new CreateAbsenceRequest(LocalDate.now(), LocalDate.now().minusDays(1), AbsenceRequest.AbsenceType.VACATION, "Vacation");
        when(employeeRepository.getEmployeeById(employeeId)).thenReturn(Optional.of(employee));

        assertThrows(RuntimeException.class, () -> absenceRequestService.createAbsenceRequest(employeeId, request));
    }

    @Test
    void getMyAbsenceRequests_whenRequestsExist_returnsListOfDTOs() {
        AbsenceRequest absenceRequest = new AbsenceRequest();
        absenceRequest.setId(UUID.randomUUID());
        absenceRequest.setEmployee(employee);
        absenceRequest.setStartDate(LocalDate.now());
        absenceRequest.setEndDate(LocalDate.now().plusDays(1));
        absenceRequest.setStatus(AbsenceRequest.AbsenceStatus.PENDING);
        absenceRequest.setRequestedAt(LocalDateTime.now());

        when(absenceRequestRepository.findByEmployeeIdOrderByRequestedAtDesc(employeeId)).thenReturn(List.of(absenceRequest));

        List<AbsenceRequestDTO> result = absenceRequestService.getMyAbsenceRequests(employeeId);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void getTeamAbsenceRequests_whenRequestsExist_returnsListOfDTOs() {
        AbsenceRequest absenceRequest = new AbsenceRequest();
        absenceRequest.setId(UUID.randomUUID());
        absenceRequest.setEmployee(employee);
        absenceRequest.setStartDate(LocalDate.now());
        absenceRequest.setEndDate(LocalDate.now().plusDays(1));
        absenceRequest.setStatus(AbsenceRequest.AbsenceStatus.PENDING);
        absenceRequest.setRequestedAt(LocalDateTime.now());

        when(absenceRequestRepository.findByManagerId(managerId)).thenReturn(List.of(absenceRequest));

        List<AbsenceRequestDTO> result = absenceRequestService.getTeamAbsenceRequests(managerId);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void respondToAbsenceRequest_whenValidRequest_returnsUpdatedDTO() {
        UUID requestId = UUID.randomUUID();
        RespondAbsenceRequest respondRequest = new RespondAbsenceRequest(AbsenceRequest.AbsenceStatus.APPROVED, "Approved");

        AbsenceRequest absenceRequest = new AbsenceRequest();
        absenceRequest.setId(requestId);
        absenceRequest.setEmployee(employee);
        absenceRequest.setStatus(AbsenceRequest.AbsenceStatus.PENDING);

        when(absenceRequestRepository.findById(requestId)).thenReturn(Optional.of(absenceRequest));
        when(employeeRepository.getEmployeeById(managerId)).thenReturn(Optional.of(manager));
        when(absenceRequestRepository.save(any(AbsenceRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AbsenceRequestDTO result = absenceRequestService.respondToAbsenceRequest(requestId, managerId, respondRequest);

        assertNotNull(result);
        assertEquals(AbsenceRequest.AbsenceStatus.APPROVED, result.status());
        assertEquals("Approved", result.managerComment());
    }

    @Test
    void respondToAbsenceRequest_whenRequestNotFound_throwsException() {
        UUID requestId = UUID.randomUUID();
        RespondAbsenceRequest respondRequest = new RespondAbsenceRequest(AbsenceRequest.AbsenceStatus.APPROVED, "Approved");
        when(absenceRequestRepository.findById(requestId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> absenceRequestService.respondToAbsenceRequest(requestId, managerId, respondRequest));
    }

    @Test
    void respondToAbsenceRequest_whenManagerNotAuthorized_throwsException() {
        UUID requestId = UUID.randomUUID();
        RespondAbsenceRequest respondRequest = new RespondAbsenceRequest(AbsenceRequest.AbsenceStatus.APPROVED, "Approved");
        employee.setManager(new Employee()); // Different manager

        AbsenceRequest absenceRequest = new AbsenceRequest();
        absenceRequest.setId(requestId);
        absenceRequest.setEmployee(employee);
        absenceRequest.setStatus(AbsenceRequest.AbsenceStatus.PENDING);

        when(absenceRequestRepository.findById(requestId)).thenReturn(Optional.of(absenceRequest));
        when(employeeRepository.getEmployeeById(managerId)).thenReturn(Optional.of(manager));

        assertThrows(RuntimeException.class, () -> absenceRequestService.respondToAbsenceRequest(requestId, managerId, respondRequest));
    }

    @Test
    void respondToAbsenceRequest_whenRequestAlreadyProcessed_throwsException() {
        UUID requestId = UUID.randomUUID();
        RespondAbsenceRequest respondRequest = new RespondAbsenceRequest(AbsenceRequest.AbsenceStatus.APPROVED, "Approved");

        AbsenceRequest absenceRequest = new AbsenceRequest();
        absenceRequest.setId(requestId);
        absenceRequest.setEmployee(employee);
        absenceRequest.setStatus(AbsenceRequest.AbsenceStatus.APPROVED); // Already approved

        when(absenceRequestRepository.findById(requestId)).thenReturn(Optional.of(absenceRequest));
        when(employeeRepository.getEmployeeById(managerId)).thenReturn(Optional.of(manager));

        assertThrows(RuntimeException.class, () -> absenceRequestService.respondToAbsenceRequest(requestId, managerId, respondRequest));
    }
}

