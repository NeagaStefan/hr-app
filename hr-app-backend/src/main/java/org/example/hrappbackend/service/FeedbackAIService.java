package org.example.hrappbackend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class FeedbackAIService {

    private static final Logger log = LoggerFactory.getLogger(FeedbackAIService.class);
    private static final String BASE_URL = "https://router.huggingface.co/v1/chat/completions";
    private static final String MODEL = "meta-llama/Llama-3.2-1B-Instruct";
    private static final String DEFAULT_CONTEXT = "their general performance";
    private static final int MAX_WORDS = 100;

    private final RestTemplate restTemplate;

    @Value("${huggingface.api.key}")
    private String apiKey;

    public FeedbackAIService() {
        this.restTemplate = new RestTemplate();
    }

    public String generateFeedbackSuggestion(String employeeName, String context) {
        if (!isConfigured()) {
            log.warn("AI feedback service not configured - missing API key");
            return "AI feedback assistant not configured.";
        }

        try {
            String prompt = buildPrompt(employeeName, context);
            Map<String, Object> response = callHuggingFaceAPI(prompt);
            return extractContent(response);

        } catch (RestClientException e) {
            log.error("Failed to generate AI feedback: {}", e.getMessage(), e);
            return "Unable to generate feedback suggestion at this time.";
        } catch (Exception e) {
            log.error("Unexpected error generating feedback: {}", e.getMessage(), e);
            return "An unexpected error occurred.";
        }
    }

    private boolean isConfigured() {
        return apiKey != null && !apiKey.isEmpty();
    }

    private String buildPrompt(String employeeName, String context) {
        String effectiveContext = (context != null && !context.isEmpty()) ? context : DEFAULT_CONTEXT;
        return String.format(
                "Generate brief, professional feedback for employee %s about %s. " +
                "Be constructive and positive. Keep it under %d words.",
                employeeName,
                effectiveContext,
                MAX_WORDS
        );
    }

    private Map<String, Object> callHuggingFaceAPI(String prompt) {
        HttpHeaders headers = createHeaders();
        Map<String, Object> requestBody = createRequestBody(prompt);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        log.debug("Calling Hugging Face API with model: {}", MODEL);
        return restTemplate.postForObject(BASE_URL, request, Map.class);
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        return headers;
    }

    private Map<String, Object> createRequestBody(String prompt) {
        return Map.of(
                "messages", List.of(Map.of("role", "user", "content", prompt)),
                "model", MODEL,
                "stream", false
        );
    }

    private String extractContent(Map<String, Object> response) {
        if (response == null || !response.containsKey("choices")) {
            log.warn("Invalid response from Hugging Face API");
            return "No suggestion available";
        }

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        if (choices.isEmpty()) {
            log.warn("Empty choices in API response");
            return "No suggestion available";
        }

        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        String content = (String) message.get("content");

        return (content != null) ? content.trim() : "No suggestion available";
    }
}