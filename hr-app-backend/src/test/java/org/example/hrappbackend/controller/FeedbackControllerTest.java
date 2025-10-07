package org.example.hrappbackend.controller;

import org.example.hrappbackend.dto.CreateFeedbackRequest;
import org.example.hrappbackend.dto.EmployeeDTO;
import org.example.hrappbackend.dto.FeedbackDTO;
import org.example.hrappbackend.entity.Employee;
import org.example.hrappbackend.entity.User;
import org.example.hrappbackend.repository.UserRepository;
import org.example.hrappbackend.service.FeedbackAIService;
import org.example.hrappbackend.service.FeedbackService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FeedbackControllerTest {

    @Mock
    private FeedbackService feedbackService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FeedbackAIService feedbackAIService;

    @InjectMocks
    private FeedbackController feedbackController;

    private Authentication authentication;
    private User user;
    private UUID employeeId;

    @BeforeEach
    void setUp() {
        employeeId = UUID.randomUUID();
        Employee employee = new Employee();
        employee.setId(employeeId);

        user = new User();
        user.setUsername("testuser");
        user.setEmployee(employee);

        authentication = new UsernamePasswordAuthenticationToken("testuser", "password");
    }

    @Test
    @WithMockUser
    void giveFeedbackReturnsCreatedFeedbackWhenRequestIsValid() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        CreateFeedbackRequest request = new CreateFeedbackRequest(UUID.randomUUID(), "This is a valid feedback text.");
        EmployeeDTO fromEmployee = new EmployeeDTO(employeeId, "testuser", "lastname", "test@user.com", "pos", "dep", LocalDate.now(), BigDecimal.TEN, null, null, List.of());
        EmployeeDTO toEmployee = new EmployeeDTO(request.toEmployeeId(), "toUser", "lastname", "to@user.com", "pos", "dep", LocalDate.now(), BigDecimal.TEN, null, null, List.of());
        FeedbackDTO feedbackDTO = new FeedbackDTO(UUID.randomUUID(), fromEmployee, toEmployee, request.feedbackText(), LocalDateTime.now());
        when(feedbackService.createFeedback(employeeId, request)).thenReturn(feedbackDTO);

        ResponseEntity<FeedbackDTO> response = feedbackController.giveFeedback(request, authentication);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(feedbackDTO, response.getBody());
    }

    @Test
    @WithMockUser
    void giveFeedbackThrowsExceptionWhenUserNotFound() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        CreateFeedbackRequest request = new CreateFeedbackRequest(UUID.randomUUID(), "This is a valid feedback text.");

        assertThrows(RuntimeException.class, () -> feedbackController.giveFeedback(request, authentication));
    }

    @Test
    @WithMockUser
    void getFeedbackReceivedReturnsListOfFeedback() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        EmployeeDTO fromEmployee = new EmployeeDTO(employeeId, "testuser", "lastname", "test@user.com", "pos", "dep", LocalDate.now(), BigDecimal.TEN, null, null, List.of());
        EmployeeDTO toEmployee = new EmployeeDTO(UUID.randomUUID(), "toUser", "lastname", "to@user.com", "pos", "dep", LocalDate.now(), BigDecimal.TEN, null, null, List.of());
        List<FeedbackDTO> feedbackList = List.of(new FeedbackDTO(UUID.randomUUID(), fromEmployee, toEmployee, "This is a valid feedback text.", LocalDateTime.now()));
        when(feedbackService.getFeedbackReceived(employeeId)).thenReturn(feedbackList);

        ResponseEntity<List<FeedbackDTO>> response = feedbackController.getFeedbackReceived(authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(feedbackList, response.getBody());
    }

    @Test
    @WithMockUser
    void getFeedbackGivenReturnsListOfFeedback() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        EmployeeDTO fromEmployee = new EmployeeDTO(employeeId, "testuser", "lastname", "test@user.com", "pos", "dep", LocalDate.now(), BigDecimal.TEN, null, null, List.of());
        EmployeeDTO toEmployee = new EmployeeDTO(UUID.randomUUID(), "toUser", "lastname", "to@user.com", "pos", "dep", LocalDate.now(), BigDecimal.TEN, null, null, List.of());
        List<FeedbackDTO> feedbackList = List.of(new FeedbackDTO(UUID.randomUUID(), fromEmployee, toEmployee, "This is a valid feedback text.", LocalDateTime.now()));
        when(feedbackService.getFeedbackGiven(employeeId)).thenReturn(feedbackList);

        ResponseEntity<List<FeedbackDTO>> response = feedbackController.getFeedbackGiven(authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(feedbackList, response.getBody());
    }

    @Test
    @WithMockUser
    void getFeedbackSuggestionReturnsSuggestion() {
        String suggestion = "This is a great suggestion.";
        when(feedbackAIService.generateFeedbackSuggestion(anyString(), anyString())).thenReturn(suggestion);

        ResponseEntity<Map<String, String>> response = feedbackController.getFeedbackSuggestion("John Doe", "performance");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Map.of("suggestion", suggestion), response.getBody());
    }

    @Test
    @WithMockUser
    void getFeedbackSuggestionThrowsExceptionWhenServiceFails() {
        when(feedbackAIService.generateFeedbackSuggestion(anyString(), anyString())).thenThrow(new RuntimeException("AI service failure"));

        assertThrows(RuntimeException.class, () -> feedbackController.getFeedbackSuggestion("John Doe", "performance"));
    }
}
