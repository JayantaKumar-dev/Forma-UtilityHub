package com.multiutility.service;

import com.multiutility.entity.Url;
import com.multiutility.repository.UrlRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.Random;

@Service
public class UrlService {
    private final UrlRepository repo;
    private final Random random = new Random();

    public UrlService(UrlRepository repo) {
        this.repo = repo;
    }

    public Url shortenUrl(String originalUrl) {
        String code = generateCode();
        Url url = Url.builder()
                .originalUrl(originalUrl)
                .shortCode(code)
                .clicks(0)
                .build();
        return repo.save(url);
    }

    public Optional<Url> getOriginalUrl(String code) {
        return repo.findByShortCode(code);
    }

    private String generateCode() {
        return Integer.toHexString(random.nextInt(999999));
    }
}
