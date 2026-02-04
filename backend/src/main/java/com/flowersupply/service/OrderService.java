package com.flowersupply.service;

import com.flowersupply.model.Order;
import com.flowersupply.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }
    
    public Order createOrder(Order order) {
        order.setOrderDate(LocalDate.now());
        return orderRepository.save(order);
    }
    
    public Order updateOrderStatus(Long id, String newStatus) {
        return orderRepository.findById(id)
            .map(order -> {
                order.setStatus(newStatus);
                return orderRepository.save(order);
            })
            .orElseThrow(() -> new RuntimeException("Заказ не найден"));
    }
    
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }
    
    public List<Order> getOrdersBySupplier(Long supplierId) {
        return orderRepository.findBySupplierId(supplierId);
    }
    
    public List<Order> getActiveOrders() {
        return orderRepository.findByStatusIn(List.of("PENDING", "IN_PROGRESS"));
    }
    
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}