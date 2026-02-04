package com.flowersupply.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "flower_type", nullable = false)
    private String flowerType;
    
    @Column(name = "store_location")
    private String storeLocation = "Основной склад";
    
    @Column(nullable = false)
    private Integer quantity = 0;
    
    @Column(name = "min_quantity")
    private Integer minQuantity = 10;
    
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated = LocalDateTime.now();
}