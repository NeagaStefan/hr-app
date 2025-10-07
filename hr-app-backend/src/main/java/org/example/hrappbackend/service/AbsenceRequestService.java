package org.example.hrappbackend.service;

import lombok.RequiredArgsConstructor;
import org.example.hrappbackend.dto.AbsenceRequestDTO;
import org.example.hrappbackend.dto.CreateAbsenceRequest;
import org.example.hrappbackend.dto.RespondAbsenceRequest;
import org.example.hrappbackend.entity.AbsenceRequest;
import org.example.hrappbackend.entity.Employee;
import org.example.hrappbackend.repository.AbsenceRequestRepository;
import org.example.hrappbackend.repository.EmployeeRepository;
import org.example.hrappbackend.util.SanitizerUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AbsenceRequestService {
    private final AbsenceRequestRepository absenceRequestRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public AbsenceRequestDTO createAbsenceRequest(UUID employeeId, CreateAbsenceRequest request) {
        String sanitizedReason = SanitizerUtil.sanitize(request.reason());
        Employee employee = employeeRepository.getEmployeeById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (request.endDate().isBefore(request.startDate())) {
            throw new RuntimeException("End date must be after start date");
        }

        AbsenceRequest absenceRequest = new AbsenceRequest();
        absenceRequest.setEmployee(employee);
        absenceRequest.setStartDate(request.startDate());
        absenceRequest.setEndDate(request.endDate());
        absenceRequest.setType(request.type());
        absenceRequest.setReason(sanitizedReason);
        absenceRequest.setStatus(AbsenceRequest.AbsenceStatus.PENDING);
        absenceRequest.setRequestedAt(LocalDateTime.now());

        AbsenceRequest saved = absenceRequestRepository.save(absenceRequest);
        return toDTO(saved);
    }

    public List<AbsenceRequestDTO> getMyAbsenceRequests(UUID employeeId) {
        return absenceRequestRepository.findByEmployeeIdOrderByRequestedAtDesc(employeeId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AbsenceRequestDTO> getTeamAbsenceRequests(UUID managerId) {
        return absenceRequestRepository.findByManagerId(managerId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AbsenceRequestDTO> getPendingAbsenceRequests(UUID managerId) {
        return absenceRequestRepository.findByManagerId(managerId)
                .stream()
                .filter(ar -> ar.getStatus() == AbsenceRequest.AbsenceStatus.PENDING)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AbsenceRequestDTO respondToAbsenceRequest(UUID requestId, UUID managerId,
                                                     RespondAbsenceRequest response) {
        AbsenceRequest absenceRequest = absenceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Absence request not found"));

        Employee manager = employeeRepository.getEmployeeById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        if (absenceRequest.getEmployee().getManager() == null ||
            !absenceRequest.getEmployee().getManager().getId().equals(managerId)) {
            throw new RuntimeException("You are not authorized to respond to this request");
        }

        if (absenceRequest.getStatus() != AbsenceRequest.AbsenceStatus.PENDING) {
            throw new RuntimeException("This request has already been processed");
        }

        absenceRequest.setStatus(response.status());
        absenceRequest.setApprovedBy(manager);
        absenceRequest.setRespondedAt(LocalDateTime.now());
        absenceRequest.setManagerComment(response.managerComment());

        AbsenceRequest saved = absenceRequestRepository.save(absenceRequest);
        return toDTO(saved);
    }

    private AbsenceRequestDTO toDTO(AbsenceRequest absenceRequest) {
        return new AbsenceRequestDTO(
                absenceRequest.getId(),
                absenceRequest.getEmployee().toDTO(),
                absenceRequest.getStartDate(),
                absenceRequest.getEndDate(),
                absenceRequest.getType(),
                absenceRequest.getReason(),
                absenceRequest.getStatus(),
                absenceRequest.getApprovedBy() != null ? absenceRequest.getApprovedBy().toDTO() : null,
                absenceRequest.getRequestedAt(),
                absenceRequest.getRespondedAt(),
                absenceRequest.getManagerComment()
        );
    }
}

