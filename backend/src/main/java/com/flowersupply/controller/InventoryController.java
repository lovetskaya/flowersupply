package com.flowersupply.controller;

import com.flowersupply.model.Inventory;
import com.flowersupply.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inventory")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryController {
    
    @Autowired
    private InventoryService inventoryService;
    
    @GetMapping
    public ResponseEntity<List<Inventory>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }
    
    @GetMapping("/low-stock")
    public ResponseEntity<List<Inventory>> getLowStock() {
        return ResponseEntity.ok(inventoryService.getLowStock());
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getInventoryStats() {
        Integer totalItems = inventoryService.getTotalInventoryValue();
        Integer lowStockCount = inventoryService.getLowStock().size();
        
        return ResponseEntity.ok(Map.of(
            "totalItems", totalItems,
            "lowStockCount", lowStockCount
        ));
    }
    
    @PostMapping
    public ResponseEntity<Inventory> addToInventory(@RequestBody Inventory inventory) {
        return ResponseEntity.ok(inventoryService.addToInventory(inventory));
    }
    
    @PutMapping("/{id}/quantity")
    public ResponseEntity<Inventory> updateQuantity(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request) {
        Integer newQuantity = request.get("quantity");
        return ResponseEntity.ok(inventoryService.updateQuantity(id, newQuantity));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFromInventory(@PathVariable Long id) {
        inventoryService.deleteFromInventory(id);
        return ResponseEntity.noContent().build();
    }
}