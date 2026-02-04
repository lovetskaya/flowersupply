package com.flowersupply.repository;

import com.flowersupply.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    
    List<Sale> findBySaleDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Sale> findByFlowerTypeContainingIgnoreCase(String flowerType);
    
    @Query("SELECT SUM(s.totalAmount) FROM Sale s WHERE s.saleDate BETWEEN :startDate AND :endDate")
    Double getTotalRevenueBetweenDates(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT s.flowerType, SUM(s.quantity) as totalQuantity " +
           "FROM Sale s " +
           "GROUP BY s.flowerType " +
           "ORDER BY totalQuantity DESC")
    List<Object[]> getTopSellingFlowers();
}