package com.example.vocabular.translation.service;

import com.example.vocabular.translation.dto.LibreTranslateRequest;
import com.example.vocabular.translation.dto.LibreTranslateResponse;
import com.example.vocabular.translation.dto.TranslationRequest;
import com.example.vocabular.translation.dto.TranslationResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;

@Service
public class TranslationService {

    private static final Set<String> SUPPORTED_LANGUAGES =
            Set.of("uk");

    private final RestClient restClient;

    public TranslationService(
            @Value("${translation.api.url}") String apiUrl
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(apiUrl)
                .build();
    }

    public TranslationResponse translate(TranslationRequest request) {

        if (!SUPPORTED_LANGUAGES.contains(request.targetLanguage())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Unsupported target language"
            );
        }

        LibreTranslateRequest libreRequest =
                new LibreTranslateRequest(
                        request.text(),
                        "en",
                        request.targetLanguage(),
                        "text"
                );

        try {
            LibreTranslateResponse result = restClient.post()
                    .uri("/translate")
                    .body(libreRequest)
                    .retrieve()
                    .body(LibreTranslateResponse.class);

            if (result == null || result.translatedText() == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Translation provider returned an empty response"
                );
            }

            return new TranslationResponse(
                    request.text(),
                    result.translatedText(),
                    request.targetLanguage()
            );

        } catch (RestClientException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Translation service is unavailable",
                    e
            );
        }
    }
}