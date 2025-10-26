package com.multiutility.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/ip")
public class IpController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping
    public ResponseEntity<String> getIpInfo(@RequestParam(required = false) String ip) {
        if (ip == null || ip.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"Missing required query param: ip\"}");
        }

        String url = "https://ipapi.co/" + ip + "/json/";

        try {
            String response = restTemplate.getForObject(url, String.class);
            if (response == null || response.contains("\"error\"")) {
                // fallback to ipinfo (optional) — keep simple response
                String fallbackUrl = "https://ipinfo.io/" + ip + "/json?token=YOUR_IPINFO_TOKEN";
                String fallbackResp = restTemplate.getForObject(fallbackUrl, String.class);
                return ResponseEntity.ok(fallbackResp != null ? fallbackResp : "{\"error\":\"Not found\"}");
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"IP lookup failed\"}");
        }
    }
}
