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
    String targetIp = ip;

    // If no IP provided, fetch caller's IP
    if (targetIp == null || targetIp.isEmpty()) {
        // You can use a service like ipify to get the caller's IP
        try {
            String myIp = restTemplate.getForObject("https://api.ipify.org?format=json", String.class);
            // Extract IP from JSON (you might want to use a JSON parser here)
            targetIp = myIp.replaceAll(".*\"ip\"\\s*:\\s*\"(.*?)\".*", "$1");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\":\"Unable to detect IP\"}");
        }
    }

    String url = "https://ipapi.co/" + targetIp + "/json/";
    try {
        String response = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(500).body("{\"error\":\"Invalid IP or not found\"}");
    }
}

}
