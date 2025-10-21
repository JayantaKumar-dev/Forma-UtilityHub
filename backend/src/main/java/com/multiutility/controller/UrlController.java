package com.multiutility.controller;

import com.multiutility.entity.Url;
import com.multiutility.service.UrlService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/url")
public class UrlController {
    private final UrlService service;

    public UrlController(UrlService service) {
        this.service = service;
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
                    url.setClicks(url.getClicks() + 1);
                    service.shortenUrl(url.getOriginalUrl()); // update clicks
                    return new RedirectView(url.getOriginalUrl());
                })
                .orElseGet(() -> new RedirectView("/not-found"));
    }
}

