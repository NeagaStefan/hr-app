package org.example.hrappbackend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.hrappbackend.dto.CreateFeedbackRequest;
import org.example.hrappbackend.dto.FeedbackDTO;
import org.example.hrappbackend.entity.User;
import org.example.hrappbackend.repository.UserRepository;
import org.example.hrappbackend.service.FeedbackAIService;
import org.example.hrappbackend.service.FeedbackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final UserRepository userRepository;
    private final FeedbackAIService feedbackAIService;

    @PostMapping
    public ResponseEntity<FeedbackDTO> giveFeedback(@Valid @RequestBody CreateFeedbackRequest request, Authentication authentication) {
        UUID employeeId = getEmployeeIdFromAuth(authentication);
        FeedbackDTO feedback = feedbackService.createFeedback(employeeId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(feedback);
    }

    @GetMapping("/received")
    public ResponseEntity<List<FeedbackDTO>> getFeedbackReceived(Authentication authentication) {
        UUID employeeId = getEmployeeIdFromAuth(authentication);
        List<FeedbackDTO> feedback = feedbackService.getFeedbackReceived(employeeId);
        return ResponseEntity.ok(feedback);
    }

    @GetMapping("/given")
    public ResponseEntity<List<FeedbackDTO>> getFeedbackGiven(Authentication authentication) {
        UUID employeeId = getEmployeeIdFromAuth(authentication);
        List<FeedbackDTO> feedback = feedbackService.getFeedbackGiven(employeeId);
        return ResponseEntity.ok(feedback);
    }

    @GetMapping("/suggest")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'HR', 'ADMIN')")
    public ResponseEntity<Map<String, String>> getFeedbackSuggestion(
            @RequestParam String employeeName,
            @RequestParam(required = false) String context
    ) {
        String suggestion = feedbackAIService.generateFeedbackSuggestion(
                employeeName,
                context != null ? context : "general performance"
        );
        return ResponseEntity.ok(Map.of("suggestion", suggestion));
    }

    private UUID getEmployeeIdFromAuth(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getEmployee().getId();
    }
}

