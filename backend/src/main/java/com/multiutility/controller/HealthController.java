package com.multiutility.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String home() {
        return "UtilityHub API is Live!";
    }

    @GetMapping("/health")
    public String health() {
        return "Healthy ✅";
    }
}
