package com.multiutility.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/ip")
public class IpController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping
    public ResponseEntity<String> getIpInfo(@RequestParam(required = false) String ip, HttpServletRequest request) {
        String targetIp = ip;

        if (targetIp == null || targetIp.isEmpty()) {
            targetIp = request.getHeader("X-Forwarded-For"); // works on Render
            if (targetIp == null) {
                targetIp = request.getRemoteAddr(); // fallback
            }
        }

        targetIp = targetIp.split(",")[0].trim(); // handle multiple IPs

        String url = "https://ipapi.co/" + targetIp + "/json/";

        try {
            String response = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\":\"Invalid IP or not found\"}");
        }
    }
}
