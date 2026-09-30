package com.stock.stock_trading_portfolio_system.repository;

import com.stock.stock_trading_portfolio_system.entity.Holding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HoldingRepository extends JpaRepository<Holding, Long> {

    List<Holding> findByAccountAccountId(Long accountId);

    Optional<Holding> findByAccountAccountIdAndStockStockId(
            Long accountId,
            Long stockId
    );
}