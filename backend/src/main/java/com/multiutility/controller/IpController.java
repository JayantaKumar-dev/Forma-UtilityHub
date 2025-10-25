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

    String url = "https://ipapi.co/" + ip + "/json/";

    try {
        String response = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(500).body("{\"error\":\"Invalid IP or not found\"}");
    }
}

}
