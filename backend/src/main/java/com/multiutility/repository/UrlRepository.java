package com.multiutility.repository;

import com.multiutility.entity.Url;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UrlRepository extends MongoRepository<Url, String> {
    Optional<Url> findByShortCode(String shortCode);
}

