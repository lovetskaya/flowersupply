package com.flowersupply.controller;

import com.flowersupply.model.Supplier;
import com.flowersupply.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/suppliers")
@CrossOrigin(origins = "http://localhost:3000")
public class SupplierController {
    
    @Autowired
    private SupplierService supplierService;
    
    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        return supplierService.getSupplierById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Supplier> createSupplier(@Valid @RequestBody Supplier supplier) {
        return ResponseEntity.ok(supplierService.createSupplier(supplier));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(
            @PathVariable Long id, 
            @Valid @RequestBody Supplier supplierDetails) {
        try {
            Supplier updated = supplierService.updateSupplier(id, supplierDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/rating/{minRating}")
    public ResponseEntity<List<Supplier>> getSuppliersByRating(
            @PathVariable Integer minRating) {
        return ResponseEntity.ok(supplierService.getSuppliersByRating(minRating));
    }
}