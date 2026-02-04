package com.flowersupply.controller;

import com.flowersupply.model.Sale;
import com.flowersupply.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sales")
@CrossOrigin(origins = "http://localhost:3000")
public class SaleController {
    
    @Autowired
    private SaleService saleService;
    
    @GetMapping
    public ResponseEntity<List<Sale>> getAllSales() {
        return ResponseEntity.ok(saleService.getAllSales());
    }
    
    @PostMapping
    public ResponseEntity<Sale> createSale(@RequestBody Sale sale) {
        return ResponseEntity.ok(saleService.createSale(sale));
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<Sale>> getRecentSales(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(saleService.getRecentSales(limit));
    }
    
    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        Double revenue = saleService.getTotalRevenue(startDate, endDate);
        List<Sale> sales = saleService.getSalesByDateRange(startDate, endDate);
        
        return ResponseEntity.ok(Map.of(
            "revenue", revenue,
            "salesCount", sales.size(),
            "startDate", startDate,
            "endDate", endDate
        ));
    }
    
    @GetMapping("/top-selling")
    public ResponseEntity<Map<String, Long>> getTopSellingFlowers() {
        return ResponseEntity.ok(saleService.getTopSellingFlowers());
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<Sale>> getSalesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        return ResponseEntity.ok(saleService.getSalesByDateRange(startDate, endDate));
    }
}