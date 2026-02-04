package com.flowersupply.controller;

import com.flowersupply.model.Order;
import com.flowersupply.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.createOrder(order));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        return ResponseEntity.ok(orderService.updateOrderStatus(id, newStatus));
    }
    
    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<Order>> getOrdersBySupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(orderService.getOrdersBySupplier(supplierId));
    }
}