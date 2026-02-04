package com.flowersupply.service;

import com.flowersupply.model.Inventory;
import com.flowersupply.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class InventoryService {
    
    @Autowired
    private InventoryRepository inventoryRepository;
    
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }
    
    public List<Inventory> getLowStock() {
        return inventoryRepository.findLowStock();
    }
    
    public Inventory addToInventory(Inventory inventory) {
        inventory.setLastUpdated(LocalDateTime.now());
        return inventoryRepository.save(inventory);
    }
    
    public Inventory updateQuantity(Long id, Integer newQuantity) {
        return inventoryRepository.findById(id)
            .map(inventory -> {
                inventory.setQuantity(newQuantity);
                inventory.setLastUpdated(LocalDateTime.now());
                return inventoryRepository.save(inventory);
            })
            .orElseThrow(() -> new RuntimeException("Товар не найден"));
    }
    
    public void deleteFromInventory(Long id) {
        inventoryRepository.deleteById(id);
    }
    
    public Integer getTotalInventoryValue() {
        return inventoryRepository.findAll()
            .stream()
            .mapToInt(Inventory::getQuantity)
            .sum();
    }
}