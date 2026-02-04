package com.flowersupply.repository;

import com.flowersupply.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    
    List<Inventory> findByQuantityLessThan(Integer quantity);
    
    @Query("SELECT i FROM Inventory i WHERE i.quantity < i.minQuantity")
    List<Inventory> findLowStock();
    
    List<Inventory> findByFlowerTypeContainingIgnoreCase(String flowerType);
}