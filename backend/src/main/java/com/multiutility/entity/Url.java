package com.multiutility.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "urls")
public class Url {
    @Id
    private String id;
    private String originalUrl;
    private String shortCode;
    private long clicks;
}
