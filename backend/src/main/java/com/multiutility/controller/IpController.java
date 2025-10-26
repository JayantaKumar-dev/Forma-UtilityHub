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
        try {
            // ✅ When IP provided by user → Query exact IP
            if (ip != null && !ip.isEmpty()) {
                return ResponseEntity.ok(restTemplate.getForObject(
                        "https://ipapi.co/" + ip + "/json/", String.class));
            }

            // ✅ When NO IP provided → Use fallback API that detects real visitor IP
            return ResponseEntity.ok(restTemplate.getForObject(
                    "https://ipinfo.io/json?token=e96f7558f7edc2", String.class));

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("{\"error\": \"IP lookup failed\"}");
        }
    }
}
