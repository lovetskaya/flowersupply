package com.flowersupply.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "sales")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sale {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "flower_type", nullable = false)
    private String flowerType;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false)
    private Double price;
    
    @Column(name = "sale_date")
    private LocalDate saleDate = LocalDate.now();
    
    @Column(name = "customer_name")
    private String customerName;
    
    @Column(name = "total_amount")
    private Double totalAmount;
    
    // Автоматический расчет общей суммы перед сохранением
    @PrePersist
    @PreUpdate
    private void calculateTotal() {
        if (price != null && quantity != null) {
            this.totalAmount = price * quantity;
        }
    }
}