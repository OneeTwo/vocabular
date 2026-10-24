package com.example.vocabular.story.service;

import com.example.vocabular.story.dto.StoryTemplateDto;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.Arrays;
import java.util.List;

@Service
public class StoryService {

    private final ObjectMapper objectMapper;

    public StoryService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public List<StoryTemplateDto> getAllStories() {

        try {
            PathMatchingResourcePatternResolver resolver =
                    new PathMatchingResourcePatternResolver();

            Resource[] resources =
                    resolver.getResources("classpath*:stories/*.json");

            return Arrays.stream(resources)
                    .map(this::readStory)
                    .toList();

        } catch (IOException e) {
            throw new UncheckedIOException("Failed to load stories", e);
        }
    }

    public StoryTemplateDto getStoryById(String id) {

        return getAllStories().stream()
                .filter(story -> story.id().equals(id))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Story not found: " + id
                ));
    }

    public List<StoryTemplateDto> getStoriesByLevel(String level) {

        return getAllStories().stream()
                .filter(story -> story.level().equalsIgnoreCase(level))
                .toList();
    }

    private StoryTemplateDto readStory(Resource resource) {

        try (var inputStream = resource.getInputStream()) {

            return objectMapper.readValue(
                    inputStream.readAllBytes(),
                    StoryTemplateDto.class
            );

        } catch (IOException e) {
            throw new UncheckedIOException(
                    "Failed to read story: " + resource.getFilename(), e
            );
        }
    }
}