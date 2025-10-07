package org.example.hrappbackend.service;

import org.example.hrappbackend.dto.CreateFeedbackRequest;
import org.example.hrappbackend.dto.FeedbackDTO;
import org.example.hrappbackend.entity.Employee;
import org.example.hrappbackend.entity.Feedback;
import org.example.hrappbackend.repository.EmployeeRepository;
import org.example.hrappbackend.repository.FeedbackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeedbackServiceTest {

    @Mock
    private FeedbackRepository feedbackRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private FeedbackService feedbackService;

    private UUID fromEmployeeId;
    private UUID toEmployeeId;
    private Employee fromEmployee;
    private Employee toEmployee;
    private Feedback feedback;

    @BeforeEach
    void setUp() {
        fromEmployeeId = UUID.randomUUID();
        toEmployeeId = UUID.randomUUID();

        fromEmployee = new Employee();
        fromEmployee.setId(fromEmployeeId);
        fromEmployee.setFirstName("John");
        fromEmployee.setLastName("Doe");
        fromEmployee.setEmail("john.doe@example.com");

        toEmployee = new Employee();
        toEmployee.setId(toEmployeeId);
        toEmployee.setFirstName("Jane");
        toEmployee.setLastName("Smith");
        toEmployee.setEmail("jane.smith@example.com");

        feedback = new Feedback();
        feedback.setId(UUID.randomUUID());
        feedback.setFromEmployee(fromEmployee);
        feedback.setToEmployee(toEmployee);
        feedback.setFeedbackText("Great job on the project!");
        feedback.setTimestamp(LocalDateTime.now());
    }

    @Test
    void createFeedback_succeeds_whenValidRequest() {
        CreateFeedbackRequest request = new CreateFeedbackRequest(toEmployeeId, "Excellent work!");
        when(employeeRepository.getEmployeeById(fromEmployeeId)).thenReturn(Optional.of(fromEmployee));
        when(employeeRepository.getEmployeeById(toEmployeeId)).thenReturn(Optional.of(toEmployee));
        when(feedbackRepository.save(any(Feedback.class))).thenReturn(feedback);

        FeedbackDTO result = feedbackService.createFeedback(fromEmployeeId, request);

        assertNotNull(result);
        assertEquals(feedback.getId(), result.id());
        assertEquals(feedback.getFeedbackText(), result.feedbackText());
        verify(feedbackRepository, times(1)).save(any(Feedback.class));
    }

    @Test
    void createFeedback_throwsException_whenFromEmployeeNotFound() {
        CreateFeedbackRequest request = new CreateFeedbackRequest(toEmployeeId, "Great work!");
        when(employeeRepository.getEmployeeById(fromEmployeeId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> feedbackService.createFeedback(fromEmployeeId, request));

        assertEquals("From employee not found", exception.getMessage());
        verify(feedbackRepository, never()).save(any(Feedback.class));
    }

    @Test
    void createFeedback_throwsException_whenToEmployeeNotFound() {
        CreateFeedbackRequest request = new CreateFeedbackRequest(toEmployeeId, "Good job!");
        when(employeeRepository.getEmployeeById(fromEmployeeId)).thenReturn(Optional.of(fromEmployee));
        when(employeeRepository.getEmployeeById(toEmployeeId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> feedbackService.createFeedback(fromEmployeeId, request));

        assertEquals("To employee not found", exception.getMessage());
        verify(feedbackRepository, never()).save(any(Feedback.class));
    }

    @Test
    void createFeedback_throwsException_whenGivingFeedbackToSelf() {
        CreateFeedbackRequest request = new CreateFeedbackRequest(fromEmployeeId, "Self feedback");
        when(employeeRepository.getEmployeeById(fromEmployeeId)).thenReturn(Optional.of(fromEmployee));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> feedbackService.createFeedback(fromEmployeeId, request));

        assertEquals("Cannot give feedback to yourself", exception.getMessage());
        verify(feedbackRepository, never()).save(any(Feedback.class));
    }

    @Test
    void getFeedbackReceived_returnsListOfFeedback_whenFeedbackExists() {
        Feedback feedback1 = new Feedback();
        feedback1.setId(UUID.randomUUID());
        feedback1.setFromEmployee(fromEmployee);
        feedback1.setToEmployee(toEmployee);
        feedback1.setFeedbackText("Great work!");
        feedback1.setTimestamp(LocalDateTime.now());

        Feedback feedback2 = new Feedback();
        feedback2.setId(UUID.randomUUID());
        feedback2.setFromEmployee(fromEmployee);
        feedback2.setToEmployee(toEmployee);
        feedback2.setFeedbackText("Excellent job!");
        feedback2.setTimestamp(LocalDateTime.now());

        when(feedbackRepository.findAll()).thenReturn(List.of(feedback1, feedback2));

        List<FeedbackDTO> result = feedbackService.getFeedbackReceived(toEmployeeId);

        assertEquals(2, result.size());
        assertEquals("Great work!", result.get(0).feedbackText());
        assertEquals("Excellent job!", result.get(1).feedbackText());
    }

    @Test
    void getFeedbackReceived_returnsEmptyList_whenNoFeedbackExists() {
        when(feedbackRepository.findAll()).thenReturn(List.of());

        List<FeedbackDTO> result = feedbackService.getFeedbackReceived(toEmployeeId);

        assertTrue(result.isEmpty());
    }

    @Test
    void getFeedbackReceived_filtersCorrectly_whenMultipleFeedbacksExist() {
        Employee anotherEmployee = new Employee();
        anotherEmployee.setId(UUID.randomUUID());

        Feedback feedbackForTarget = new Feedback();
        feedbackForTarget.setId(UUID.randomUUID());
        feedbackForTarget.setFromEmployee(fromEmployee);
        feedbackForTarget.setToEmployee(toEmployee);
        feedbackForTarget.setFeedbackText("For target");
        feedbackForTarget.setTimestamp(LocalDateTime.now());

        Feedback feedbackForOther = new Feedback();
        feedbackForOther.setId(UUID.randomUUID());
        feedbackForOther.setFromEmployee(fromEmployee);
        feedbackForOther.setToEmployee(anotherEmployee);
        feedbackForOther.setFeedbackText("For other");
        feedbackForOther.setTimestamp(LocalDateTime.now());

        when(feedbackRepository.findAll()).thenReturn(List.of(feedbackForTarget, feedbackForOther));

        List<FeedbackDTO> result = feedbackService.getFeedbackReceived(toEmployeeId);

        assertEquals(1, result.size());
        assertEquals("For target", result.getFirst().feedbackText());
    }

    @Test
    void getFeedbackGiven_returnsListOfFeedback_whenFeedbackExists() {
        Feedback feedback1 = new Feedback();
        feedback1.setId(UUID.randomUUID());
        feedback1.setFromEmployee(fromEmployee);
        feedback1.setToEmployee(toEmployee);
        feedback1.setFeedbackText("Nice work!");
        feedback1.setTimestamp(LocalDateTime.now());

        when(feedbackRepository.findAll()).thenReturn(List.of(feedback1));

        List<FeedbackDTO> result = feedbackService.getFeedbackGiven(fromEmployeeId);

        assertEquals(1, result.size());
        assertEquals("Nice work!", result.getFirst().feedbackText());
    }

    @Test
    void getFeedbackGiven_returnsEmptyList_whenNoFeedbackExists() {
        when(feedbackRepository.findAll()).thenReturn(List.of());

        List<FeedbackDTO> result = feedbackService.getFeedbackGiven(fromEmployeeId);

        assertTrue(result.isEmpty());
    }

    @Test
    void getFeedbackGiven_filtersCorrectly_whenMultipleFeedbacksExist() {
        Employee anotherEmployee = new Employee();
        anotherEmployee.setId(UUID.randomUUID());

        Feedback feedbackFromTarget = new Feedback();
        feedbackFromTarget.setId(UUID.randomUUID());
        feedbackFromTarget.setFromEmployee(fromEmployee);
        feedbackFromTarget.setToEmployee(toEmployee);
        feedbackFromTarget.setFeedbackText("From target");
        feedbackFromTarget.setTimestamp(LocalDateTime.now());

        Feedback feedbackFromOther = new Feedback();
        feedbackFromOther.setId(UUID.randomUUID());
        feedbackFromOther.setFromEmployee(anotherEmployee);
        feedbackFromOther.setToEmployee(toEmployee);
        feedbackFromOther.setFeedbackText("From other");
        feedbackFromOther.setTimestamp(LocalDateTime.now());

        when(feedbackRepository.findAll()).thenReturn(List.of(feedbackFromTarget, feedbackFromOther));

        List<FeedbackDTO> result = feedbackService.getFeedbackGiven(fromEmployeeId);

        assertEquals(1, result.size());
        assertEquals("From target", result.getFirst().feedbackText());
    }

    @Test
    void createFeedback_setTimestamp_whenCreatingFeedback() {
        CreateFeedbackRequest request = new CreateFeedbackRequest(toEmployeeId, "Well done!");
        LocalDateTime beforeCreate = LocalDateTime.now().minusSeconds(1);

        when(employeeRepository.getEmployeeById(fromEmployeeId)).thenReturn(Optional.of(fromEmployee));
        when(employeeRepository.getEmployeeById(toEmployeeId)).thenReturn(Optional.of(toEmployee));
        when(feedbackRepository.save(any(Feedback.class))).thenAnswer(invocation -> {
            Feedback saved = invocation.getArgument(0);
            saved.setId(UUID.randomUUID());
            return saved;
        });

        FeedbackDTO result = feedbackService.createFeedback(fromEmployeeId, request);

        assertNotNull(result.timestamp());
        assertTrue(result.timestamp().isAfter(beforeCreate));
        assertTrue(result.timestamp().isBefore(LocalDateTime.now().plusSeconds(1)));
    }
}

