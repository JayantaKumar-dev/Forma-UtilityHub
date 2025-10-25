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
        String url = (ip == null || ip.isEmpty())
                ? "https://ipapi.co/json/"
                : "https://ipapi.co/" + ip + "/json/";

        try {
            String response = restTemplate.getForObject(url, String.class);
            if (response == null || response.contains("\"error\"")) {
                return fallbackAPI(ip);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return fallbackAPI(ip);
        }
    }

    private ResponseEntity<String> fallbackAPI(String ip) {
        String fallbackUrl = (ip == null || ip.isEmpty())
                ? "https://ipinfo.io/json?token=e96f7558f7edc2"
                : "https://ipinfo.io/" + ip + "/json?token=e96f7558f7edc2";

        try {
            String response = restTemplate.getForObject(fallbackUrl, String.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\":\"IP lookup failed\"}");
        }
    }
}
