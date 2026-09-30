package com.stock.stock_trading_portfolio_system.repository;

import com.stock.stock_trading_portfolio_system.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByAccountAccountIdOrderByCreatedAtDesc(Long accountId);

    List<Order> findByStockStockIdOrderByCreatedAtDesc(Long stockId);

    List<Order> findByOrderStatus(String orderStatus);
}