package com.stock.stock_trading_portfolio_system.controller;

import com.stock.stock_trading_portfolio_system.entity.Order;
import com.stock.stock_trading_portfolio_system.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "${FRONTEND_URL:http://localhost:5173}")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id).orElse(null);
    }

    @GetMapping("/account/{accountId}")
    public List<Order> getOrdersByAccount(
            @PathVariable Long accountId) {

        return orderService.getOrdersByAccount(accountId);
    }

    @GetMapping("/stock/{stockId}")
    public List<Order> getOrdersByStock(
            @PathVariable Long stockId) {

        return orderService.getOrdersByStock(stockId);
    }

    @GetMapping("/status/{status}")
    public List<Order> getOrdersByStatus(
            @PathVariable String status) {

        return orderService.getOrdersByStatus(status);
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.saveOrder(order);
    }
}