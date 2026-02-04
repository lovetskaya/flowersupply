package com.flowersupply.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "suppliers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Название обязательно")
    @Column(nullable = false)
    private String name;
    
    private String country;
    
    private String phone;
    
    @Email(message = "Некорректный email")
    private String email;
    
    @Min(value = 1, message = "Рейтинг должен быть от 1 до 5")
    @Max(value = 5, message = "Рейтинг должен быть от 1 до 5")
    private Integer rating = 3;
}