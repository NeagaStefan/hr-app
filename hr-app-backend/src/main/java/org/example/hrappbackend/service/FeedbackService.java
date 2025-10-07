package org.example.hrappbackend.service;

import lombok.RequiredArgsConstructor;
import org.example.hrappbackend.dto.CreateFeedbackRequest;
import org.example.hrappbackend.dto.FeedbackDTO;
import org.example.hrappbackend.entity.Employee;
import org.example.hrappbackend.entity.Feedback;
import org.example.hrappbackend.repository.EmployeeRepository;
import org.example.hrappbackend.repository.FeedbackRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public FeedbackDTO createFeedback(UUID fromEmployeeId, CreateFeedbackRequest request) {
        Employee fromEmployee = employeeRepository.getEmployeeById(fromEmployeeId)
                .orElseThrow(() -> new RuntimeException("From employee not found"));

        Employee toEmployee = employeeRepository.getEmployeeById(request.toEmployeeId())
                .orElseThrow(() -> new RuntimeException("To employee not found"));

        if (fromEmployeeId.equals(request.toEmployeeId())) {
            throw new RuntimeException("Cannot give feedback to yourself");
        }

        Feedback feedback = new Feedback();
        feedback.setFromEmployee(fromEmployee);
        feedback.setToEmployee(toEmployee);
        feedback.setFeedbackText(request.feedbackText());
        feedback.setTimestamp(LocalDateTime.now());

        Feedback saved = feedbackRepository.save(feedback);
        return toDTO(saved);
    }

    public List<FeedbackDTO> getFeedbackReceived(UUID employeeId) {
        return feedbackRepository.findAll().stream()
                .filter(f -> f.getToEmployee().getId().equals(employeeId))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<FeedbackDTO> getFeedbackGiven(UUID employeeId) {
        return feedbackRepository.findAll().stream()
                .filter(f -> f.getFromEmployee().getId().equals(employeeId))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private FeedbackDTO toDTO(Feedback feedback) {
        return new FeedbackDTO(
                feedback.getId(),
                feedback.getFromEmployee().toDTO(),
                feedback.getToEmployee().toDTO(),
                feedback.getFeedbackText(),
                feedback.getTimestamp()
        );
    }
}

