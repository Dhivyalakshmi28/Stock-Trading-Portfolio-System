package com.stock.stock_trading_portfolio_system.service;

import com.stock.stock_trading_portfolio_system.entity.Order;
import com.stock.stock_trading_portfolio_system.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    public List<Order> getOrdersByAccount(Long accountId) {
        return orderRepository
                .findByAccountAccountIdOrderByCreatedAtDesc(accountId);
    }

    public List<Order> getOrdersByStock(Long stockId) {
        return orderRepository
                .findByStockStockIdOrderByCreatedAtDesc(stockId);
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByOrderStatus(status);
    }

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }
}