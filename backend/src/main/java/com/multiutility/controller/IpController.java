package com.multiutility.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/ip")
public class IpController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping
    public ResponseEntity<String> getIpInfo(@RequestParam(required = false) String ip) {
        String url;
        if (ip == null || ip.isEmpty()) {
            url = "https://ipapi.co/json/"; // Get current IP
        } else {
            url = "https://ipapi.co/" + ip + "/json/"; // Get info for specific IP
        }

        try {
            String response = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\":\"Failed to fetch IP data\"}");
        }
    }
}
