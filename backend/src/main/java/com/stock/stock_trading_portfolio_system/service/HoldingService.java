package com.stock.stock_trading_portfolio_system.service;

import com.stock.stock_trading_portfolio_system.entity.Holding;
import com.stock.stock_trading_portfolio_system.repository.HoldingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HoldingService {

    private final HoldingRepository holdingRepository;

    public HoldingService(HoldingRepository holdingRepository) {
        this.holdingRepository = holdingRepository;
    }

    public List<Holding> getHoldingsByAccount(Long accountId) {
        return holdingRepository.findByAccountAccountId(accountId);
    }

    public Optional<Holding> getHolding(Long accountId, Long stockId) {
        return holdingRepository
                .findByAccountAccountIdAndStockStockId(accountId, stockId);
    }

    public Optional<Holding> getHoldingById(Long holdingId) {
        return holdingRepository.findById(holdingId);
    }

    public Holding saveHolding(Holding holding) {
        return holdingRepository.save(holding);
    }

    public void deleteHolding(Long holdingId) {
        holdingRepository.deleteById(holdingId);
    }
}