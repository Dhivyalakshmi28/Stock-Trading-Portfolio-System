package com.stock.stock_trading_portfolio_system.service;

import com.stock.stock_trading_portfolio_system.entity.Account;
import com.stock.stock_trading_portfolio_system.entity.Holding;
import com.stock.stock_trading_portfolio_system.entity.Order;
import com.stock.stock_trading_portfolio_system.entity.Stock;
import com.stock.stock_trading_portfolio_system.entity.Trade;
import com.stock.stock_trading_portfolio_system.entity.Transaction;
import com.stock.stock_trading_portfolio_system.repository.AccountRepository;
import com.stock.stock_trading_portfolio_system.repository.HoldingRepository;
import com.stock.stock_trading_portfolio_system.repository.OrderRepository;
import com.stock.stock_trading_portfolio_system.repository.StockRepository;
import com.stock.stock_trading_portfolio_system.repository.TradeRepository;
import com.stock.stock_trading_portfolio_system.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class TradingService {

    private final AccountRepository accountRepository;
    private final StockRepository stockRepository;
    private final OrderRepository orderRepository;
    private final TradeRepository tradeRepository;
    private final HoldingRepository holdingRepository;
    private final TransactionRepository transactionRepository;
    private final StockPriceService stockPriceService;

    public TradingService(
            AccountRepository accountRepository,
            StockRepository stockRepository,
            OrderRepository orderRepository,
            TradeRepository tradeRepository,
            HoldingRepository holdingRepository,
            TransactionRepository transactionRepository,
            StockPriceService stockPriceService) {

        this.accountRepository = accountRepository;
        this.stockRepository = stockRepository;
        this.orderRepository = orderRepository;
        this.tradeRepository = tradeRepository;
        this.holdingRepository = holdingRepository;
        this.transactionRepository = transactionRepository;
        this.stockPriceService = stockPriceService;
    }

    @Transactional
    public Order executeTrade(
            Long accountId,
            Long stockId,
            String orderType,
            Integer quantity) {

        // 1. Validate quantity
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than zero.");
        }

        // 2. Validate order type
        if (orderType == null ||
                (!orderType.equalsIgnoreCase("BUY")
                        && !orderType.equalsIgnoreCase("SELL"))) {

            throw new IllegalArgumentException(
                    "Order type must be BUY or SELL.");
        }

        // 3. Find account
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new RuntimeException("Account not found."));

        // 4. Find stock
        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() ->
                        new RuntimeException("Stock not found."));

        // 5. Get latest available historical price
        var latestPrice =
                stockPriceService.getLatestPrice(stockId);

        if (latestPrice.isEmpty()) {
            throw new RuntimeException(
                    "No historical price available for this stock.");
        }

        BigDecimal executionPrice =
                latestPrice.get().getClosePrice();

        // 6. Calculate total trade value
        BigDecimal totalAmount = executionPrice.multiply(
                BigDecimal.valueOf(quantity)
        );

        // 7. Create order
        Order order = new Order();

        order.setAccount(account);
        order.setStock(stock);
        order.setOrderType(orderType.toUpperCase());
        order.setQuantity(quantity);
        order.setOrderPrice(executionPrice);
        order.setOrderStatus("EXECUTED");
        order.setCreatedAt(LocalDateTime.now());

        order = orderRepository.save(order);

        // =====================================================
        // BUY
        // =====================================================
        if (orderType.equalsIgnoreCase("BUY")) {

            // Check sufficient virtual cash
            if (account.getCashBalance().compareTo(totalAmount) < 0) {
                throw new IllegalArgumentException(
                        "Insufficient virtual cash balance.");
            }

            // Deduct cash
            account.setCashBalance(
                    account.getCashBalance().subtract(totalAmount)
            );

            accountRepository.save(account);

            // Find existing holding
            Optional<Holding> existingHolding =
                    holdingRepository
                            .findByAccountAccountIdAndStockStockId(
                                    accountId,
                                    stockId
                            );

            if (existingHolding.isPresent()) {

                Holding holding = existingHolding.get();

                int oldQuantity = holding.getQuantity();

                BigDecimal oldAverage =
                        holding.getAverageBuyPrice();

                int newQuantity = oldQuantity + quantity;

                BigDecimal oldInvestment =
                        oldAverage.multiply(
                                BigDecimal.valueOf(oldQuantity)
                        );

                BigDecimal newInvestment =
                        executionPrice.multiply(
                                BigDecimal.valueOf(quantity)
                        );

                BigDecimal newAverage =
                        oldInvestment
                                .add(newInvestment)
                                .divide(
                                        BigDecimal.valueOf(newQuantity),
                                        4,
                                        java.math.RoundingMode.HALF_UP
                                );

                holding.setQuantity(newQuantity);
                holding.setAverageBuyPrice(newAverage);
                holding.setUpdatedAt(LocalDateTime.now());

                holdingRepository.save(holding);

            } else {

                Holding holding = new Holding();

                holding.setAccount(account);
                holding.setStock(stock);
                holding.setQuantity(quantity);
                holding.setAverageBuyPrice(executionPrice);
                holding.setUpdatedAt(LocalDateTime.now());

                holdingRepository.save(holding);
            }

            // Create BUY transaction
            createTransaction(
                    account,
                    order,
                    "BUY",
                    totalAmount
            );
        }

        // =====================================================
        // SELL
        // =====================================================
        else {

            Holding holding =
                    holdingRepository
                            .findByAccountAccountIdAndStockStockId(
                                    accountId,
                                    stockId
                            )
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "You do not own this stock."
                                    )
                            );

            // Check sufficient shares
            if (holding.getQuantity() < quantity) {
                throw new IllegalArgumentException(
                        "Insufficient shares to sell.");
            }

            // Add cash from sale
            account.setCashBalance(
                    account.getCashBalance().add(totalAmount)
            );

            accountRepository.save(account);

            // Reduce holding
            int remainingQuantity =
                    holding.getQuantity() - quantity;

            if (remainingQuantity == 0) {

                holdingRepository.delete(holding);

            } else {

                holding.setQuantity(remainingQuantity);
                holding.setUpdatedAt(LocalDateTime.now());

                holdingRepository.save(holding);
            }

            // Create SELL transaction
            createTransaction(
                    account,
                    order,
                    "SELL",
                    totalAmount
            );
        }

        // 8. Create trade
        Trade trade = new Trade();

        trade.setOrder(order);
        trade.setQuantity(quantity);
        trade.setExecutionPrice(executionPrice);
        trade.setExecutedAt(LocalDateTime.now());

        tradeRepository.save(trade);

        // 9. Return completed order
        return order;
    }

    private void createTransaction(
            Account account,
            Order order,
            String transactionType,
            BigDecimal amount) {

        Transaction transaction = new Transaction();

        transaction.setAccount(account);
        transaction.setOrder(order);
        transaction.setTransactionType(transactionType);
        transaction.setAmount(amount);
        transaction.setCreatedAt(LocalDateTime.now());

        transactionRepository.save(transaction);
    }
}