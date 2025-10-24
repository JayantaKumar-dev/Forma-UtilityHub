package com.multiutility.controller;

import com.multiutility.entity.Url;
import com.multiutility.service.UrlService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/url")
public class UrlController {

    private final UrlService service;

    public UrlController(UrlService service) {
        this.service = service;
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }

    @PostMapping("/shorten")
    public ResponseEntity<Url> shorten(@RequestBody Map<String, String> request) {
        String originalUrl = request.get("originalUrl");
        return ResponseEntity.ok(service.shortenUrl(originalUrl));
    }

    @GetMapping("/{code}")
    public RedirectView redirect(@PathVariable String code) {
        return service.getOriginalUrl(code)
                .map(url -> {
                    log.info("Redirecting code {} to {}", code, url.getOriginalUrl());
                    service.incrementClicks(url);
                    return new RedirectView(url.getOriginalUrl());
                })
                .orElseGet(() -> new RedirectView("/not-found"));
    }
}
