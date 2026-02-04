package com.flowersupply.service;

import com.flowersupply.model.Supplier;
import com.flowersupply.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SupplierService {
    
    @Autowired
    private SupplierRepository supplierRepository;
    
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }
    
    public Optional<Supplier> getSupplierById(Long id) {
        return supplierRepository.findById(id);
    }
    
    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }
    
    public Supplier updateSupplier(Long id, Supplier supplierDetails) {
        return supplierRepository.findById(id)
            .map(supplier -> {
                supplier.setName(supplierDetails.getName());
                supplier.setCountry(supplierDetails.getCountry());
                supplier.setPhone(supplierDetails.getPhone());
                supplier.setEmail(supplierDetails.getEmail());
                supplier.setRating(supplierDetails.getRating());
                return supplierRepository.save(supplier);
            })
            .orElseThrow(() -> new RuntimeException("Поставщик не найден"));
    }
    
    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }
    
    public List<Supplier> getSuppliersByRating(Integer minRating) {
        return supplierRepository.findByRatingGreaterThanEqual(minRating);
    }
}