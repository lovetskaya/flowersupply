package com.flowersupply.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;
    
    @Column(name = "order_date")
    private LocalDate orderDate = LocalDate.now();
    
    @Column(name = "expected_date")
    private LocalDate expectedDate;
    
    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, IN_PROGRESS, DELIVERED, CANCELLED
    
    @Column(name = "total_amount", precision = 10, scale = 2)
    private Double totalAmount = 0.0;
}