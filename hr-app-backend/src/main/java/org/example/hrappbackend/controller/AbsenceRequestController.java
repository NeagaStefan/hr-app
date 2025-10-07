package org.example.hrappbackend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.hrappbackend.controller.doc.AbsenceRequestApi;
import org.example.hrappbackend.dto.AbsenceRequestDTO;
import org.example.hrappbackend.dto.CreateAbsenceRequest;
import org.example.hrappbackend.dto.RespondAbsenceRequest;
import org.example.hrappbackend.entity.User;
import org.example.hrappbackend.repository.UserRepository;
import org.example.hrappbackend.service.AbsenceRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/absence-requests")
@RequiredArgsConstructor
public class AbsenceRequestController implements AbsenceRequestApi {
    private final AbsenceRequestService absenceRequestService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<AbsenceRequestDTO> createAbsenceRequest(@Valid @RequestBody CreateAbsenceRequest request,
                                                                   Authentication authentication) {
        UUID employeeId = getEmployeeIdFromAuth(authentication);
        AbsenceRequestDTO created = absenceRequestService.createAbsenceRequest(employeeId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<AbsenceRequestDTO>> getMyAbsenceRequests(Authentication authentication) {
        UUID employeeId = getEmployeeIdFromAuth(authentication);
        List<AbsenceRequestDTO> requests = absenceRequestService.getMyAbsenceRequests(employeeId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/team-requests")
    public ResponseEntity<List<AbsenceRequestDTO>> getTeamAbsenceRequests(Authentication authentication) {
        UUID managerId = getEmployeeIdFromAuth(authentication);
        List<AbsenceRequestDTO> requests = absenceRequestService.getTeamAbsenceRequests(managerId);
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/{requestId}/respond")
    public ResponseEntity<AbsenceRequestDTO> respondToAbsenceRequest(@PathVariable UUID requestId,
                                                                      @Valid @RequestBody RespondAbsenceRequest response,
                                                                      Authentication authentication) {
        UUID managerId = getEmployeeIdFromAuth(authentication);
        AbsenceRequestDTO updated = absenceRequestService.respondToAbsenceRequest(requestId, managerId, response);
        return ResponseEntity.ok(updated);
    }

    private UUID getEmployeeIdFromAuth(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getEmployee().getId();
    }
}


