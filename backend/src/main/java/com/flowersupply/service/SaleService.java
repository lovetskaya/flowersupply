package com.flowersupply.service;

import com.flowersupply.model.Sale;
import com.flowersupply.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class SaleService {
    
    @Autowired
    private SaleRepository saleRepository;
    
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }
    
    public Sale createSale(Sale sale) {
        return saleRepository.save(sale);
    }
    
    public List<Sale> getSalesByDateRange(LocalDate startDate, LocalDate endDate) {
        return saleRepository.findBySaleDateBetween(startDate, endDate);
    }
    
    public Double getTotalRevenue(LocalDate startDate, LocalDate endDate) {
        Double revenue = saleRepository.getTotalRevenueBetweenDates(startDate, endDate);
        return revenue != null ? revenue : 0.0;
    }
    
    public Map<String, Long> getTopSellingFlowers() {
        List<Object[]> results = saleRepository.getTopSellingFlowers();
        return results.stream()
            .collect(Collectors.toMap(
                row -> (String) row[0],
                row -> ((Number) row[1]).longValue()
            ));
    }
    
    public List<Sale> getRecentSales(int limit) {
        return saleRepository.findAll()
            .stream()
            .sorted((s1, s2) -> s2.getSaleDate().compareTo(s1.getSaleDate()))
            .limit(limit)
            .collect(Collectors.toList());
    }
}