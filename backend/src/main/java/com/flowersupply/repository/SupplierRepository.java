package com.flowersupply.repository;

import com.flowersupply.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByRatingGreaterThanEqual(Integer rating);
    List<Supplier> findByNameContainingIgnoreCase(String name);
}