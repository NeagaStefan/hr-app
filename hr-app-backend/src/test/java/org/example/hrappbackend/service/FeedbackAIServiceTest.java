package org.example.hrappbackend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeedbackAIServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private FeedbackAIService feedbackAIService;

    private static final String TEST_API_KEY = "test-api-key-123";
    private static final String EMPLOYEE_NAME = "John Doe";
    private static final String CONTEXT = "project completion";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(feedbackAIService, "restTemplate", restTemplate);
        ReflectionTestUtils.setField(feedbackAIService, "apiKey", TEST_API_KEY);
    }

    @Test
    void generateFeedbackSuggestion_returnsSuccessfulResponse_whenApiCallSucceeds() {
        String expectedContent = "Great work on completing the project!";
        Map<String, Object> mockResponse = createMockApiResponse(expectedContent);
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class))).thenReturn(mockResponse);

        String result = feedbackAIService.generateFeedbackSuggestion(EMPLOYEE_NAME, CONTEXT);

        assertEquals(expectedContent, result);
        verify(restTemplate, times(1)).postForObject(anyString(), any(), eq(Map.class));
    }

    @Test
    void generateFeedbackSuggestion_usesDefaultContext_whenContextIsNull() {
        String expectedContent = "Keep up the good work!";
        Map<String, Object> mockResponse = createMockApiResponse(expectedContent);
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class))).thenReturn(mockResponse);

        String result = feedbackAIService.generateFeedbackSuggestion(EMPLOYEE_NAME, null);

        assertEquals(expectedContent, result);
    }

    @Test
    void generateFeedbackSuggestion_usesDefaultContext_whenContextIsEmpty() {
        String expectedContent = "Excellent performance!";
        Map<String, Object> mockResponse = createMockApiResponse(expectedContent);
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class))).thenReturn(mockResponse);

        String result = feedbackAIService.generateFeedbackSuggestion(EMPLOYEE_NAME, "");

        assertEquals(expectedContent, result);
    }

    @Test
    void generateFeedbackSuggestion_returnsErrorMessage_whenApiKeyIsNotConfigured() {
        ReflectionTestUtils.setField(feedbackAIService, "apiKey", null);

        String result = feedbackAIService.generateFeedbackSuggestion(EMPLOYEE_NAME, CONTEXT);

        assertEquals("AI feedback assistant not configured.", result);
        verify(restTemplate, never()).postForObject(anyString(), any(), eq(Map.class));
    }

    @Test
    void generateFeedbackSuggestion_returnsErrorMessage_whenApiKeyIsEmpty() {
        ReflectionTestUtils.setField(feedbackAIService, "apiKey", "");

        String result = feedbackAIService.generateFeedbackSuggestion(EMPLOYEE_NAME, CONTEXT);

        assertEquals("AI feedback assistant not configured.", result);
        verify(restTemplate, never()).postForObject(anyString(), any(), eq(Map.class));
    }

    @Test
    void generateFeedbackSuggestion_returnsErrorMessage_whenRestClientExceptionOccurs() {
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class)))
                .thenThrow(new RestClientException("API connection failed"));

        String result = feedbackAIService.generateFeedbackSuggestion(EMPLOYEE_NAME, CONTEXT);

        assertEquals("Unable to generate feedback suggestion at this time.", result);
    }

    @Test
    void generateFeedbackSuggestion_returnsErrorMessage_whenUnexpectedExceptionOccurs() {
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class)))
                .thenThrow(new RuntimeException("Unexpected error"));

        String result = feedbackAIService.generateFeedbackSuggestion(EMPLOYEE_NAME, CONTEXT);

        assertEquals("An unexpected error occurred.", result);
    }

    @Test
    void generateFeedbackSuggestion_returnsNoSuggestion_whenResponseIsNull() {
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class))).thenReturn(null);

        String result = feedbackAIService.generateFeedbackSuggestion(EMPLOYEE_NAME, CONTEXT);

        assertEquals("No suggestion available", result);
    }

    @Test
    void generateFeedbackSuggestion_returnsNoSuggestion_whenResponseHasNoChoices() {
        Map<String, Object> mockResponse = Map.of("usage", Map.of("tokens", 10));
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class))).thenReturn(mockResponse);

        String result = feedbackAIService.generateFeedbackSuggestion(EMPLOYEE_NAME, CONTEXT);

        assertEquals("No suggestion available", result);
    }

    @Test
    void generateFeedbackSuggestion_returnsNoSuggestion_whenChoicesArrayIsEmpty() {
        Map<String, Object> mockResponse = Map.of("choices", List.of());
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class))).thenReturn(mockResponse);

        String result = feedbackAIService.generateFeedbackSuggestion(EMPLOYEE_NAME, CONTEXT);

        assertEquals("No suggestion available", result);
    }

    @Test
    void generateFeedbackSuggestion_trimsWhitespace_fromApiResponse() {
        String contentWithWhitespace = "  Great job on the project!  \n";
        Map<String, Object> mockResponse = createMockApiResponse(contentWithWhitespace);
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class))).thenReturn(mockResponse);

        String result = feedbackAIService.generateFeedbackSuggestion(EMPLOYEE_NAME, CONTEXT);

        assertEquals("Great job on the project!", result);
    }

    @Test
    void generateFeedbackSuggestion_returnsNoSuggestion_whenContentIsNull() {
        Map<String, Object> message = Map.of("role", "assistant");
        Map<String, Object> choice = Map.of("message", message);
        Map<String, Object> mockResponse = Map.of("choices", List.of(choice));
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class))).thenReturn(mockResponse);

        String result = feedbackAIService.generateFeedbackSuggestion(EMPLOYEE_NAME, CONTEXT);

        assertEquals("No suggestion available", result);
    }

    private Map<String, Object> createMockApiResponse(String content) {
        Map<String, Object> message = Map.of(
                "role", "assistant",
                "content", content
        );
        Map<String, Object> choice = Map.of(
                "message", message,
                "index", 0
        );
        return Map.of(
                "choices", List.of(choice),
                "model", "meta-llama/Llama-3.2-1B-Instruct",
                "usage", Map.of("total_tokens", 50)
        );
    }
}

