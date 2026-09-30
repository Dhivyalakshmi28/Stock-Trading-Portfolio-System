package com.stock.stock_trading_portfolio_system.service;

import com.stock.stock_trading_portfolio_system.entity.Trade;
import com.stock.stock_trading_portfolio_system.repository.TradeRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TradeService {

    private final TradeRepository tradeRepository;

    public TradeService(TradeRepository tradeRepository) {
        this.tradeRepository = tradeRepository;
    }

    public Optional<Trade> getTradeById(Long tradeId) {
        return tradeRepository.findById(tradeId);
    }

    public Optional<Trade> getTradeByOrderId(Long orderId) {
        return tradeRepository.findByOrderOrderId(orderId);
    }

    public Trade saveTrade(Trade trade) {
        return tradeRepository.save(trade);
    }
}