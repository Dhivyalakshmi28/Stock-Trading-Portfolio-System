import { useEffect, useState } from "react";
import {
  getAccountByUserId,
  getStocks,
  getStockPrices,
  executeTrade,
  getOrdersByAccount,
  getHoldingsByAccount,
  getWatchlistsByUser,
  getWatchlistItems,
  getTradeByOrderId,
  getTransactionsByAccount,
  addToWatchlist,
  removeFromWatchlist
} from "./api";

function UserDashboard({ user, onLogout }) {
  
  const [activePage, setActivePage] = useState("dashboard");
  const [account, setAccount] = useState(null);
const [accountLoading, setAccountLoading] = useState(true);
const [accountError, setAccountError] = useState("");
  const [stocks, setStocks] = useState([]);
  const [stocksLoading, setStocksLoading] = useState(false);
  const [dashboardPrices, setDashboardPrices] = useState([]);
const [dashboardLoading, setDashboardLoading] = useState(false);
const [dashboardError, setDashboardError] = useState("");
  const [stocksError, setStocksError] = useState("");
  const [search, setSearch] = useState("");
  const [watchlists, setWatchlists] = useState([]);
const [watchlistItems, setWatchlistItems] = useState([]);
const [watchlistLoading, setWatchlistLoading] = useState(false);
const [watchlistError, setWatchlistError] = useState("");
const [watchlistActionLoading, setWatchlistActionLoading] = useState(false);
  const [exchangeFilter, setExchangeFilter] = useState("ALL");
  const [selectedMarketStock, setSelectedMarketStock] = useState(null);
  const [holdings, setHoldings] = useState([]);
const [holdingsLoading, setHoldingsLoading] = useState(false);
const [holdingsError, setHoldingsError] = useState("");
  const [tradeType, setTradeType] = useState(null);
const [quantity, setQuantity] = useState(1);
const [tradeLoading, setTradeLoading] = useState(false);
const [tradeMessage, setTradeMessage] = useState("");
const [tradeError, setTradeError] = useState("");
  const [prices, setPrices] = useState([]);
  const [orders, setOrders] = useState([]);
const [ordersLoading, setOrdersLoading] = useState(false);
const [ordersError, setOrdersError] = useState("");
const [trades, setTrades] = useState([]);
const [transactions, setTransactions] = useState([]);
const [ordersTab, setOrdersTab] = useState("orders");
  const [portfolioPrices, setPortfolioPrices] = useState({});
const [priceLoading, setPriceLoading] = useState(false);
const [priceError, setPriceError] = useState("");
  const hour = new Date().getHours();

  let greeting = "Good evening";

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 17) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good night";
  }

  /* ================= ACCOUNT ================= */

  useEffect(() => {
    async function loadAccount() {
      if (!user?.userId) {
        setAccountLoading(false);
        return;
      }

      try {
        const data = await getAccountByUserId(user.userId);
        setAccount(data);
      } catch (error) {
        console.error(error);
        setAccountError("Unable to load account details.");
      } finally {
        setAccountLoading(false);
      }
    }

    loadAccount();
  }, [user?.userId]);
  useEffect(() => {
  async function loadWatchlist() {
    if (activePage !== "watchlist" || !user?.userId) {
      return;
    }

    setWatchlistLoading(true);
    setWatchlistError("");

    try {
      let lists = await getWatchlistsByUser(user.userId);

      // Create the default watchlist if the user has none
      if (lists.length === 0) {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/watchlists`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user: {
                userId: user.userId,
              },
              watchlistName: "My Watchlist",
              createdAt: new Date().toISOString(),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Unable to create watchlist");
        }

        const created = await response.json();
        lists = [created];
      }

      setWatchlists(lists);

      const items = await getWatchlistItems(
        lists[0].watchlistId
      );

      setWatchlistItems(items);

    } catch (error) {
      console.error(error);
      setWatchlistError(
        error.message || "Unable to load watchlist."
      );
    } finally {
      setWatchlistLoading(false);
    }
  }

  loadWatchlist();
}, [activePage, user?.userId]);
  useEffect(() => {
  async function loadHoldings() {
    if (!account?.accountId) {
      return;
    }

    setHoldingsLoading(true);
    setHoldingsError("");

    try {
      const data = await getHoldingsByAccount(account.accountId);
      setHoldings(data);
    } catch (error) {
      console.error(error);
      setHoldingsError("Unable to load portfolio holdings.");
    } finally {
      setHoldingsLoading(false);
    }
  }

  loadHoldings();
}, [account?.accountId]);

  /* ================= STOCKS ================= */
  useEffect(() => {
  async function loadPrices() {
    if (!selectedMarketStock?.stockId) {
      setPrices([]);
      return;
    }

    setPriceLoading(true);
    setPriceError("");

    try {
      const data = await getStockPrices(
        selectedMarketStock.stockId
      );

      setPrices(data);
    } catch (error) {
      console.error(error);
      setPriceError("Unable to load historical prices.");
    } finally {
      setPriceLoading(false);
    }
  }

    loadPrices();
}, [selectedMarketStock]);



useEffect(() => {
  async function loadStocks() {
   if (
  activePage !== "markets" &&
  activePage !== "dashboard"
) {
  return;
}

    setStocksLoading(true);
    setStocksError("");

    try {
      const data = await getStocks();
      setStocks(data);
    } catch (error) {
      console.error(error);
      setStocksError("Unable to load market data.");
    } finally {
      setStocksLoading(false);
    }
  }

  loadStocks();
}, [activePage]);

  const cashBalance = account?.cashBalance ?? 0;

  function formatMoney(value) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  function handleNavigation(page) {
    setActivePage(page);
  }

  const exchanges = [
    ...new Set(
      stocks
        .map((stock) => stock.exchange?.exchangeName)
        .filter(Boolean)
    ),
  ];

  const filteredStocks = stocks.filter((stock) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      stock.symbol?.toLowerCase().includes(searchText) ||
      stock.stockName?.toLowerCase().includes(searchText);

    const matchesExchange =
      exchangeFilter === "ALL" ||
      stock.exchange?.exchangeName === exchangeFilter;

    return matchesSearch && matchesExchange;
  });


  useEffect(() => {
  async function loadOrdersData() {
    if (activePage !== "orders" || !account?.accountId) {
      return;
    }

    setOrdersLoading(true);
    setOrdersError("");

    try {
      // Load orders
      const orderData = await getOrdersByAccount(account.accountId);
      setOrders(orderData);

      // Load transactions
      const transactionData =
        await getTransactionsByAccount(account.accountId);

      setTransactions(transactionData);

      // Load trades belonging to the orders
      const tradeResults = await Promise.all(
        orderData.map(async (order) => {
          try {
            const trade = await getTradeByOrderId(order.orderId);

            if (trade) {
              return {
                ...trade,
                order: order,
              };
            }


            return null;
          } catch (error) {
            console.error(
              `Trade loading failed for order ${order.orderId}:`,
              error
            );
            return null;
          }
        })
      );

      setTrades(tradeResults.filter(Boolean));

    } catch (error) {
      console.error(error);
      setOrdersError("Unable to load trading activity.");
    } finally {
      setOrdersLoading(false);
    }
  }

  loadOrdersData();
}, [activePage, account?.accountId]);

  useEffect(() => {
  async function loadPortfolioPrices() {
  if (!holdings || holdings.length === 0) {
    setPortfolioPrices({});
    return;
  }

  try {
    const priceResults = {};

    await Promise.all(
      holdings.map(async (holding) => {
        const stockId =
          holding.stock?.stockId ||
          holding.stockId;

        if (!stockId) return;

        const data = await getStockPrices(stockId);

        if (data && data.length > 0) {
          const latest = data[data.length - 1];
          const previous =
            data.length > 1
              ? data[data.length - 2]
              : null;

          const currentPrice = Number(
            latest.closePrice ??
            latest.close ??
            0
          );

          const previousClose = previous
            ? Number(
                previous.closePrice ??
                previous.close ??
                0
              )
            : currentPrice;

          const dayChange =
            currentPrice - previousClose;

          const dayChangePercent =
            previousClose > 0
              ? (dayChange / previousClose) * 100
              : 0;

          priceResults[stockId] = {
            currentPrice,
            previousClose,
            dayChange,
            dayChangePercent,
            latestDate: latest.timestamp
          };
        }
      })
    );

    setPortfolioPrices(priceResults);

  } catch (error) {
    console.error(
      "Portfolio price loading failed:",
      error
    );
  }
}

  loadPortfolioPrices();
}, [holdings]);
useEffect(() => {
  async function loadDashboardMarketData() {
    if (activePage !== "dashboard") return;

    setDashboardLoading(true);
    setDashboardError("");

    try {
      const stockData = stocks.length > 0
        ? stocks
        : await getStocks();

      if (stocks.length === 0) {
        setStocks(stockData);
      }

      const selectedStocks = stockData.slice(0, 12);

      const marketData = await Promise.all(
        selectedStocks.map(async (stock) => {
          try {
            const data = await getStockPrices(stock.stockId);

            if (!data || data.length === 0) {
              return null;
            }

            const latest = data[data.length - 1];
            const previous =
              data.length > 1
                ? data[data.length - 2]
                : latest;

            const currentPrice = Number(
              latest.closePrice ??
              latest.close ??
              0
            );

            const previousPrice = Number(
              previous.closePrice ??
              previous.close ??
              currentPrice
            );

            const change =
              currentPrice - previousPrice;

            const changePercent =
              previousPrice > 0
                ? (change / previousPrice) * 100
                : 0;

            return {
              ...stock,
              currentPrice,
              previousPrice,
              change,
              changePercent,
              volume: Number(latest.volume || 0),
              latestDate: latest.timestamp,
            };
          } catch (error) {
            console.error(
              `Failed to load ${stock.symbol}`,
              error
            );

            return null;
          }
        })
      );

      setDashboardPrices(
        marketData.filter(Boolean)
      );

    } catch (error) {
      console.error(error);
      setDashboardError(
        "Unable to load market overview."
      );
    } finally {
      setDashboardLoading(false);
    }
  }

  loadDashboardMarketData();
}, [activePage]);

  /* ================= NAVBAR ================= */

  function renderNavbar() {
    return (
      <nav className="user-navbar">

        <div className="user-brand">
          <span className="user-brand-mark">ST</span>

          <div>
            <strong>Stock Trading</strong>
            <span>Portfolio Management System</span>
          </div>
        </div>

        <div className="user-nav-links">

          <button
            className={
              activePage === "dashboard"
                ? "user-nav-active"
                : ""
            }
            onClick={() => handleNavigation("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={
              activePage === "markets"
                ? "user-nav-active"
                : ""
            }
            onClick={() => handleNavigation("markets")}
          >
            Markets
          </button>

          <button
            className={
              activePage === "portfolio"
                ? "user-nav-active"
                : ""
            }
            onClick={() => handleNavigation("portfolio")}
          >
            Portfolio
          </button>

          <button
            className={
              activePage === "watchlist"
                ? "user-nav-active"
                : ""
            }
            onClick={() => handleNavigation("watchlist")}
          >
            Watchlist
          </button>

          <button
            className={
              activePage === "orders"
                ? "user-nav-active"
                : ""
            }
            onClick={() => handleNavigation("orders")}
          >
            Orders
          </button>

        </div>

        <div className="user-profile">

          <span className="user-avatar">
            {user?.fullName?.charAt(0).toUpperCase()}
          </span>

          <div>
            <strong>{user?.fullName}</strong>
            <small>User</small>
          </div>

          <button
            className="user-logout"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </nav>
    );
  }

  /* ================= DASHBOARD ================= */

 function renderDashboard() {
  const totalInvestment = holdings.reduce(
    (sum, holding) =>
      sum +
      Number(holding.quantity || 0) *
        Number(holding.averageBuyPrice || 0),
    0
  );

 const totalPortfolioValue = holdings.reduce(
  (sum, holding) => {
    const stockId =
      holding.stock?.stockId ||
      holding.stockId;

    const rawPrice = portfolioPrices[stockId];

    const currentPrice = Number.isFinite(Number(rawPrice))
      ? Number(rawPrice)
      : Number(holding.averageBuyPrice || 0);

    const quantity = Number(holding.quantity || 0);

    return sum + quantity * currentPrice;
  },
  0
);

  const totalPL =
    totalPortfolioValue - totalInvestment;

  const topGainers = [...dashboardPrices]
    .sort(
      (a, b) =>
        b.changePercent - a.changePercent
    )
    .slice(0, 3);

  const topLosers = [...dashboardPrices]
    .sort(
      (a, b) =>
        a.changePercent - b.changePercent
    )
    .slice(0, 3);

  const mostActive = [...dashboardPrices]
    .sort(
      (a, b) =>
        b.volume - a.volume
    )
    .slice(0, 3);

  return (
    <div className="dashboard-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="dashboard-hero">

        <div>
          <span className="user-eyebrow">
            MARKET OVERVIEW
          </span>

         <h1>
  {greeting},{" "}
  {user?.fullName?.split(" ")[0]} 👋
</h1>

          <p>
            Monitor markets, track your portfolio,
            and manage your paper trades.
          </p>
        </div>

        <div className="dashboard-market-status">
          <span className="status-dot"></span>
          Historical Market Data
        </div>

      </section>


      {/* =========================
          ACCOUNT SUMMARY
      ========================= */}

      <section className="dashboard-summary-grid">

        <div className="dashboard-summary-card">

          <span>Available Cash</span>

          <strong>
            {accountLoading
              ? "..."
              : `$${formatMoney(cashBalance)}`}
          </strong>

          <small>
            Trading account balance
          </small>

        </div>


        <div className="dashboard-summary-card">

          <span>Portfolio Value</span>

          <strong>
            ${formatMoney(totalPortfolioValue)}
          </strong>

          <small>
            Current holdings value
          </small>

        </div>


        <div className="dashboard-summary-card">

          <span>Total Investment</span>

          <strong>
            ${formatMoney(totalInvestment)}
          </strong>

          <small>
            Cost of current holdings
          </small>

        </div>


        <div className="dashboard-summary-card">

          <span>Total P/L</span>

          <strong
            className={
              totalPL > 0
                ? "profit-positive"
                : totalPL < 0
                ? "profit-negative"
                : ""
            }
          >
            {totalPL >= 0 ? "+" : ""}
            ${formatMoney(totalPL)}
          </strong>

          <small>
            Portfolio performance
          </small>

        </div>

      </section>


      {/* =========================
          MARKET SNAPSHOT
      ========================= */}

      <section className="dashboard-market-section">

        <div className="dashboard-section-heading">

          <div>
            <span className="user-eyebrow">
              MARKET SNAPSHOT
            </span>

            <h2>
              Today's Market Activity
            </h2>
          </div>

          <button
            className="dashboard-link-button"
            onClick={() =>
              handleNavigation("markets")
            }
          >
            View All Markets →
          </button>

        </div>


        {dashboardLoading ? (

          <div className="dashboard-loading">
            <div className="spinner"></div>
            <p>Loading market data...</p>
          </div>

        ) : dashboardError ? (

          <div className="alert alert-error">
            <span className="alert-icon">!</span>
            <p>{dashboardError}</p>
          </div>

        ) : (

          <div className="dashboard-market-grid">

            {/* TOP GAINERS */}

            <div className="dashboard-market-card">

              <div className="market-card-title">
                <div>
                  <span className="market-card-icon">
                    ↗
                  </span>

                  <div>
                    <strong>
                      Top Gainers
                    </strong>

                    <small>
                      Strongest recent movement
                    </small>
                  </div>
                </div>
              </div>


              <div className="market-list">

                {topGainers.map((stock) => (

                  <button
                    key={stock.stockId}
                    className="market-list-row"
                    onClick={() => {
                      setSelectedMarketStock(stock);
                      setActivePage("stock");
                    }}
                  >

                    <div>
                      <strong>
                        {stock.symbol}
                      </strong>

                      <small>
                        {stock.stockName}
                      </small>
                    </div>

                    <div className="market-price-block">

                      <strong>
                        $
                        {formatMoney(
                          stock.currentPrice
                        )}
                      </strong>

                      <span className="profit-positive">
                        +
                        {stock.changePercent.toFixed(
                          2
                        )}
                        %
                      </span>

                    </div>

                  </button>

                ))}

              </div>

            </div>


            {/* TOP LOSERS */}

            <div className="dashboard-market-card">

              <div className="market-card-title">
                <div>
                  <span className="market-card-icon">
                    ↘
                  </span>

                  <div>
                    <strong>
                      Top Losers
                    </strong>

                    <small>
                      Weakest recent movement
                    </small>
                  </div>
                </div>
              </div>


              <div className="market-list">

                {topLosers.map((stock) => (

                  <button
                    key={stock.stockId}
                    className="market-list-row"
                    onClick={() => {
                      setSelectedMarketStock(stock);
                      setActivePage("stock");
                    }}
                  >

                    <div>
                      <strong>
                        {stock.symbol}
                      </strong>

                      <small>
                        {stock.stockName}
                      </small>
                    </div>

                    <div className="market-price-block">

                      <strong>
                        $
                        {formatMoney(
                          stock.currentPrice
                        )}
                      </strong>

                      <span
                        className={
                          stock.changePercent < 0
                            ? "profit-negative"
                            : "profit-positive"
                        }
                      >
                        {stock.changePercent >= 0
                          ? "+"
                          : ""}
                        {stock.changePercent.toFixed(
                          2
                        )}
                        %
                      </span>

                    </div>

                  </button>

                ))}

              </div>

            </div>


            {/* MOST ACTIVE */}

            <div className="dashboard-market-card">

              <div className="market-card-title">

                <div>

                  <span className="market-card-icon">
                    ≋
                  </span>

                  <div>

                    <strong>
                      Most Active
                    </strong>

                    <small>
                      Highest trading volume
                    </small>

                  </div>

                </div>

              </div>


              <div className="market-list">

                {mostActive.map((stock) => (

                  <button
                    key={stock.stockId}
                    className="market-list-row"
                    onClick={() => {
                      setSelectedMarketStock(stock);
                      setActivePage("stock");
                    }}
                  >

                    <div>

                      <strong>
                        {stock.symbol}
                      </strong>

                      <small>
                        Volume
                      </small>

                    </div>


                    <div className="market-price-block">

                      <strong>
                        $
                        {formatMoney(
                          stock.currentPrice
                        )}
                      </strong>

                      <span>
                        {stock.volume.toLocaleString()}
                      </span>

                    </div>

                  </button>

                ))}

              </div>

            </div>

          </div>

        )}

      </section>


      {/* =========================
          PORTFOLIO + QUICK ACTIONS
      ========================= */}

      <section className="dashboard-bottom-grid">


        {/* PORTFOLIO */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>
              <span className="user-eyebrow">
                YOUR PORTFOLIO
              </span>

              <h2>
                Holdings
              </h2>
            </div>

            <button
              className="dashboard-link-button"
              onClick={() =>
                handleNavigation("portfolio")
              }
            >
              View Portfolio →
            </button>

          </div>


          {holdings.length === 0 ? (

            <div className="dashboard-empty">

              <span>◈</span>

              <p>
                No holdings yet.
              </p>

              <button
                onClick={() =>
                  handleNavigation("markets")
                }
              >
                Explore Markets
              </button>

            </div>

          ) : (

            <div className="dashboard-holdings-list">

              {holdings.slice(0, 4).map((holding) => {

                const stockId =
                  holding.stock?.stockId ||
                  holding.stockId;

                const currentPrice =
                  portfolioPrices[stockId] ??
                  Number(
                    holding.averageBuyPrice || 0
                  );

                const investment =
                  Number(holding.quantity || 0) *
                  Number(
                    holding.averageBuyPrice || 0
                  );

                const currentValue =
                  Number(holding.quantity || 0) *
                  currentPrice;

                const pl =
                  currentValue - investment;

                return (
                  <div
                    className="dashboard-holding-row"
                    key={holding.holdingId}
                  >

                    <div>
                      <strong>
                        {holding.stock?.symbol ||
                          holding.stockSymbol ||
                          "—"}
                      </strong>

                      <small>
                        {holding.quantity} share
                        {holding.quantity > 1
                          ? "s"
                          : ""}
                      </small>
                    </div>

                    <div>

                      <strong>
                        $
                        {formatMoney(
                          currentValue
                        )}
                      </strong>

                      <small
                        className={
                          pl < 0
                            ? "profit-negative"
                            : "profit-positive"
                        }
                      >
                        {pl >= 0 ? "+" : ""}
                        $
                        {formatMoney(pl)}
                      </small>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </div>


        {/* QUICK ACTIONS */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>
              <span className="user-eyebrow">
                QUICK ACTIONS
              </span>

              <h2>
                Trade & Manage
              </h2>
            </div>

          </div>


          <div className="dashboard-actions">

            <button
              onClick={() =>
                handleNavigation("markets")
              }
            >
              <span>↗</span>

              <div>
                <strong>
                  Explore Markets
                </strong>

                <small>
                  Browse 38 instruments
                </small>
              </div>

            </button>


            <button
              onClick={() =>
                handleNavigation("watchlist")
              }
            >
              <span>☆</span>

              <div>
                <strong>
                  My Watchlist
                </strong>

                <small>
                  Track stocks you follow
                </small>
              </div>

            </button>


            <button
              onClick={() =>
                handleNavigation("portfolio")
              }
            >
              <span>◈</span>

              <div>
                <strong>
                  Portfolio
                </strong>

                <small>
                  Monitor your positions
                </small>
              </div>

            </button>


            <button
              onClick={() =>
                handleNavigation("orders")
              }
            >
              <span>≡</span>

              <div>
                <strong>
                  Orders & Trades
                </strong>

                <small>
                  View trading activity
                </small>

              </div>

            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

  /* ================= MARKETS ================= */

  function renderMarkets() {
    return (
      <section className="markets-page">

        <div className="markets-header">

          <div>
            <span className="user-eyebrow">
              MARKET DATA
            </span>

            <h1>Markets</h1>

            <p>
              Explore historical market instruments available
              in the Stock Trading system.
            </p>
          </div>

          <div className="markets-count">
            <strong>{stocks.length}</strong>
            <span>Instruments</span>
          </div>

        </div>

        <div className="markets-toolbar">

          <div className="market-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search symbol or company..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

          <select
            value={exchangeFilter}
            onChange={(event) =>
              setExchangeFilter(event.target.value)
            }
          >
            <option value="ALL">
              All Exchanges
            </option>

            {exchanges.map((exchange) => (
              <option
                key={exchange}
                value={exchange}
              >
                {exchange}
              </option>
            ))}
          </select>

        </div>

        {stocksLoading && (
          <div className="markets-loading">
            <div className="spinner"></div>
            <p>Loading market instruments...</p>
          </div>
        )}

        {stocksError && (
          <div className="alert alert-error">
            <span className="alert-icon">!</span>
            <p>{stocksError}</p>
          </div>
        )}

        {!stocksLoading && !stocksError && (
          <>
            <div className="markets-result-bar">
              <span>
                Showing <strong>{filteredStocks.length}</strong>{" "}
                of <strong>{stocks.length}</strong> instruments
              </span>
            </div>

            {filteredStocks.length === 0 ? (
              <div className="markets-empty">
                <div>⌕</div>
                <h3>No instruments found</h3>
                <p>
                  Try another symbol, company name, or exchange.
                </p>
              </div>
            ) : (
              <div className="markets-grid">

                {filteredStocks.map((stock) => (

                  <article
                    key={stock.stockId}
                    className="market-card"
                  >

                    <div className="market-card-top">

                      <div className="market-symbol">
                        {stock.symbol}
                      </div>

                      <span className="market-status">
                        ● {stock.status || "ACTIVE"}
                      </span>

                    </div>

                    <h3>
                      {stock.stockName}
                    </h3>

                    <div className="market-card-details">

                      <div>
                        <span>Exchange</span>
                        <strong>
                          {stock.exchange?.exchangeName || "—"}
                        </strong>
                      </div>

                      <div>
                        <span>Type</span>
                        <strong>
                          {stock.instrumentType || "STOCK"}
                        </strong>
                      </div>

                    </div>

                    <button
                      className="market-view-button"
                      onClick={() => {
                        setActivePage("stock");
                        setSelectedMarketStock(stock);
                      }}
                    >
                      View Details →
                    </button>

                  </article>

                ))}

              </div>
            )}
          </>
        )}

      </section>
    );
  }

  /* ================= STOCK DETAILS ================= */
  async function handleTrade() {
  if (!selectedMarketStock) {
    return;
  }

  if (!account?.accountId) {
    setTradeError("Trading account could not be loaded.");
    return;
  }

  if (!quantity || Number(quantity) <= 0) {
    setTradeError("Enter a valid quantity.");
    return;
  }

  setTradeLoading(true);
  setTradeError("");
  setTradeMessage("");

  try {
    const result = await executeTrade(
      account.accountId,
      selectedMarketStock.stockId,
      tradeType,
      Number(quantity)
    );

    setTradeMessage(
      `${tradeType} order completed successfully.`
    );

    setQuantity(1);

    // Refresh account balance
    try {
      const updatedAccount = await getAccountByUserId(user.userId);
      setAccount(updatedAccount);
      const updatedHoldings = await getHoldingsByAccount(
  updatedAccount.accountId
);

setHoldings(updatedHoldings);
    } catch (error) {
      console.error("Account refresh failed:", error);
    }

    console.log("Trade result:", result);

  } catch (error) {
    console.error(error);
    setTradeError(
      error.message || "Trade execution failed."
    );
  } finally {
    setTradeLoading(false);
  }
}
  function renderStockDetails() {
    return (
      <section className="stock-details-page">

        <button
          className="back-button"
          onClick={() => setActivePage("markets")}
        >
          ← Back to Markets
        </button>

        <div className="stock-details-header">

          <div>
            <span className="user-eyebrow">
              INSTRUMENT
            </span>

            <h1>
              {selectedMarketStock?.symbol}
            </h1>

            <p>
              {selectedMarketStock?.stockName}
            </p>
          </div>

          <div className="stock-detail-actions">

  <button
    className="btn btn-buy"
    onClick={() => {
      setTradeType("BUY");
      setTradeMessage("");
      setTradeError("");
    }}
  >
    Buy
  </button>

  <button
    className="btn btn-sell"
    onClick={() => {
      setTradeType("SELL");
      setTradeMessage("");
      setTradeError("");
    }}
  >
    Sell
  </button>

</div>

        </div>

        <div className="stock-detail-card">
          {tradeType && (
  <div className="trade-panel">

    <div className="trade-panel-header">

      <div>
        <span className="user-eyebrow">
          PAPER TRADING
        </span>

        <h2>
          {tradeType} {selectedMarketStock?.symbol}
        </h2>
      </div>

      <button
        className="trade-close"
        onClick={() => {
          setTradeType(null);
          setTradeError("");
          setTradeMessage("");
        }}
      >
        ×
      </button>

    </div>

    <div className="trade-form">

      <div className="trade-stock-info">

        <span>
          {selectedMarketStock?.stockName}
        </span>

        <strong>
          {tradeType === "BUY"
            ? "Purchase shares"
            : "Sell shares"}
        </strong>

      </div>

      <label>
        Quantity
      </label>

      <input
        type="number"
        min="1"
        step="1"
        value={quantity}
        onChange={(event) =>
          setQuantity(event.target.value)
        }
      />

      <div className="trade-balance">

        <span>
          Available Cash
        </span>

        <strong>
          {account
            ? `$${Number(
                account.cashBalance || 0
              ).toFixed(2)}`
            : "—"}
        </strong>

      </div>

      {tradeError && (
        <div className="trade-error">
          {tradeError}
        </div>
      )}

      {tradeMessage && (
        <div className="trade-success">
          {tradeMessage}
        </div>
      )}

      <button
        className={
          tradeType === "BUY"
            ? "trade-submit trade-submit-buy"
            : "trade-submit trade-submit-sell"
        }
        disabled={tradeLoading}
        onClick={handleTrade}
      >
        {tradeLoading
          ? "Processing..."
          : `Confirm ${tradeType}`}
      </button>

    </div>

  </div>
)}

          <div>
            <span>Exchange</span>
            <strong>
              {selectedMarketStock?.exchange?.exchangeName || "—"}
            </strong>
          </div>

          <div>
            <span>Instrument Type</span>
            <strong>
              {selectedMarketStock?.instrumentType || "STOCK"}
            </strong>
          </div>

          <div>
            <span>Status</span>
            <strong>
              {selectedMarketStock?.status || "ACTIVE"}
            </strong>
          </div>

          <div>
            <span>Listed Date</span>
            <strong>
              {selectedMarketStock?.listedDate
                ? new Date(
                    selectedMarketStock.listedDate
                  ).toLocaleDateString()
                : "—"}
            </strong>
          </div>

        </div>

        <div className="stock-history-panel">

          <div className="stock-history-header">

            <div>
              <span className="user-eyebrow">
                HISTORICAL DATA
              </span>

              <h2>
                Price History
              </h2>
            </div>

            <span>
              Historical dataset
            </span>

          </div>
          <div className="real-chart-card">

  {priceLoading ? (
    <div className="markets-loading">
      <div className="spinner"></div>
      <p>Loading historical prices...</p>
    </div>
  ) : priceError ? (
    <div className="alert alert-error">
      <span className="alert-icon">!</span>
      <p>{priceError}</p>
    </div>
  ) : prices.length === 0 ? (
    <div className="markets-empty">
      <h3>No historical data available</h3>
    </div>
  ) : (
    <>
      <div className="chart-summary">

        <div>
          <span>Latest Close</span>
          <strong>
            ${Number(
              prices[prices.length - 1]?.closePrice || 0
            ).toFixed(2)}
          </strong>
        </div>

        <div>
          <span>Records</span>
          <strong>{prices.length.toLocaleString()}</strong>
        </div>

        <div>
          <span>Latest Date</span>
          <strong>
            {new Date(
              prices[prices.length - 1]?.timestamp
            ).toLocaleDateString()}
          </strong>
        </div>

      </div>

      <div className="svg-chart-wrapper">

        <svg
          viewBox="0 0 1000 400"
          preserveAspectRatio="none"
          className="stock-svg-chart"
        >

          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            points={prices
              .slice(-120)
              .map((price, index, arr) => {

                const values = arr.map(
                  item => Number(item.closePrice)
                );

                const min = Math.min(...values);
                const max = Math.max(...values);

                const range =
                  max - min || 1;

                const x =
                  (index / (arr.length - 1 || 1)) * 1000;

                const y =
                  360 -
                  ((Number(price.closePrice) - min) /
                    range) *
                    320;

                return `${x},${y}`;
              })
              .join(" ")}
          />

        </svg>

      </div>

      <div className="chart-labels">
        <span>
          {new Date(
            prices[Math.max(0, prices.length - 120)]
              ?.timestamp
          ).toLocaleDateString()}
        </span>

        <span>
          {new Date(
            prices[prices.length - 1]?.timestamp
          ).toLocaleDateString()}
        </span>
      </div>

      <p className="chart-note">
        Closing-price history from the PostgreSQL
        historical market dataset.
      </p>
    </>
  )}

</div>

        </div>

      </section>
    );
  }
/* ================= PORTFOLIO ================= */

function renderPortfolio() {
  const totalInvestment = holdings.reduce(
    (sum, holding) =>
      sum +
      Number(holding.quantity || 0) *
        Number(holding.averageBuyPrice || 0),
    0
  );

  const totalPortfolioValue = holdings.reduce(
    (sum, holding) => {
      const stockId =
        holding.stock?.stockId ||
        holding.stockId;

      const quantity = Number(holding.quantity || 0);
      const averageBuyPrice =
        Number(holding.averageBuyPrice || 0);

      const currentPrice =
  Number(portfolioPrices[stockId]) ||
  averageBuyPrice;

      return sum + quantity * currentPrice;
    },
    0
  );

  const totalProfitLoss =
    totalPortfolioValue - totalInvestment;

  const totalProfitLossPercent =
    totalInvestment > 0
      ? (totalProfitLoss / totalInvestment) * 100
      : 0;

  return (
    <section className="portfolio-page">

      <div className="portfolio-header">

        <div>
          <span className="user-eyebrow">
            PORTFOLIO MANAGEMENT
          </span>

          <h1>My Portfolio</h1>

          <p>
            Track your holdings, investment value, and
            paper-trading performance.
          </p>
        </div>

        <div className="portfolio-cash">
          <span>Available Cash</span>

          <strong>
            ${formatMoney(cashBalance)}
          </strong>
        </div>

      </div>

      <div className="portfolio-stats">

        <div className="user-stat-card">
          <span>Holdings</span>

          <strong>
            {holdings.length}
          </strong>

          <small>
            Stocks currently owned
          </small>
        </div>


        <div className="user-stat-card">
          <span>Total Investment</span>

          <strong>
            ${formatMoney(totalInvestment)}
          </strong>

          <small>
            Cost of current holdings
          </small>
        </div>


        <div className="user-stat-card">
          <span>Portfolio Value</span>

          <strong>
            ${formatMoney(totalPortfolioValue)}
          </strong>

          <small>
            Current market value
          </small>
        </div>


        <div className="user-stat-card">
          <span>Total P/L</span>

          <strong
            className={
              totalProfitLoss > 0
                ? "profit-positive"
                : totalProfitLoss < 0
                ? "profit-negative"
                : ""
            }
          >
            {totalProfitLoss >= 0 ? "+" : "-"}$
            {formatMoney(Math.abs(totalProfitLoss))}
          </strong>

          <small>
            {totalProfitLoss >= 0 ? "+" : ""}
            {totalProfitLossPercent.toFixed(2)}%
            {" "}portfolio performance
          </small>
        </div>

      </div>


      <div className="portfolio-panel">

        <div className="portfolio-panel-header">

          <div>
            <span className="user-eyebrow">
              HOLDINGS
            </span>

            <h2>Your Investments</h2>
          </div>

          <span>
            {holdings.length} positions
          </span>

        </div>


        {holdingsLoading ? (

          <div className="markets-loading">
            <div className="spinner"></div>
            <p>Loading portfolio...</p>
          </div>

        ) : holdingsError ? (

          <div className="alert alert-error">
            <span className="alert-icon">!</span>
            <p>{holdingsError}</p>
          </div>

        ) : holdings.length === 0 ? (

          <div className="portfolio-empty">

            <div>◈</div>

            <h3>No holdings yet</h3>

            <p>
              Buy a stock from the Markets page to create
              your first portfolio position.
            </p>

            <button
              className="market-view-button"
              onClick={() =>
                handleNavigation("markets")
              }
            >
              Explore Markets →
            </button>

          </div>

        ) : (

          <div className="portfolio-table-wrap">

            <table className="portfolio-table">

              <thead>
                <tr>
                  <th>Stock</th>
<th>Quantity</th>
<th>Avg. Buy Price</th>
<th>Current Price</th>
<th>Investment</th>
<th>Current Value</th>
<th>Latest Change</th>
<th>P/L</th>
                </tr>
              </thead>


              <tbody>

                {holdings.map((holding) => {

                  const stockId =
                    holding.stock?.stockId ||
                    holding.stockId;

                  const quantity =
                    Number(holding.quantity || 0);

                  const averageBuyPrice =
                    Number(
                      holding.averageBuyPrice || 0
                    );

                  const investment =
                    quantity * averageBuyPrice;

                  const currentPrice =
  portfolioPrices[stockId]?.currentPrice ||
  averageBuyPrice;

const dayChange =
  portfolioPrices[stockId]?.dayChange || 0;

const dayChangePercent =
  portfolioPrices[stockId]?.dayChangePercent || 0;

                  const currentValue =
                    quantity * currentPrice;

                  const profitLoss =
                    currentValue - investment;

                  return (

                    <tr
                      key={holding.holdingId}
                    >

                      <td>
                        <strong>
                          {holding.stock?.symbol ||
                            holding.stockSymbol ||
                            "—"}
                        </strong>
                      </td>


                      <td>
                        {quantity}
                      </td>


                      <td>
                        $
                        {formatMoney(
                          averageBuyPrice
                        )}
                      </td>
                      <td>
  $
  {formatMoney(currentPrice)}
</td>


                      <td>
                        $
                        {formatMoney(
                          investment
                        )}
                      </td>


                      <td>
                        $
                        {formatMoney(
                          currentValue
                        )}
                      </td>


                      <td
                        className={
                          profitLoss > 0
                            ? "profit-positive"
                            : profitLoss < 0
                            ? "profit-negative"
                            : ""
                        }
                      >
                        {profitLoss >= 0
                          ? "+"
                          : "-"}
                        $
                        {formatMoney(
                          Math.abs(profitLoss)
                        )}
                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </section>
  );
}
function renderWatchlist() {
  const currentWatchlist = watchlists[0];

  async function handleAddStock(stockId) {
    if (!currentWatchlist) return;

    setWatchlistActionLoading(true);
    setWatchlistError("");

    try {
      await addToWatchlist(
        currentWatchlist.watchlistId,
        stockId
      );

      const items = await getWatchlistItems(
        currentWatchlist.watchlistId
      );

      setWatchlistItems(items);

    } catch (error) {
      console.error(error);
      setWatchlistError(error.message);
    } finally {
      setWatchlistActionLoading(false);
    }
  }

  async function handleRemoveStock(itemId) {
    setWatchlistActionLoading(true);
    setWatchlistError("");

    try {
      await removeFromWatchlist(itemId);

      setWatchlistItems((current) =>
        current.filter(
          (item) => item.watchlistItemId !== itemId
        )
      );

    } catch (error) {
      console.error(error);
      setWatchlistError(error.message);
    } finally {
      setWatchlistActionLoading(false);
    }
  }

  const watchedStockIds = new Set(
    watchlistItems.map(
      (item) => item.stock?.stockId
    )
  );

  return (
    <section className="watchlist-page">

      <div className="watchlist-header">

        <div>
          <span className="user-eyebrow">
            MARKET MONITOR
          </span>

          <h1>Watchlist</h1>

          <p>
            Keep track of instruments you want to monitor.
          </p>
        </div>

        <div className="watchlist-count">
          <strong>{watchlistItems.length}</strong>
          <span>Watched</span>
        </div>

      </div>

      {watchlistError && (
        <div className="alert alert-error">
          <span className="alert-icon">!</span>
          <p>{watchlistError}</p>
        </div>
      )}

      {watchlistLoading ? (

        <div className="markets-loading">
          <div className="spinner"></div>
          <p>Loading watchlist...</p>
        </div>

      ) : (

        <>
          <div className="watchlist-panel">

            <div className="watchlist-panel-header">
              <div>
                <span className="user-eyebrow">
                  YOUR LIST
                </span>

                <h2>
                  {currentWatchlist?.watchlistName ||
                    "My Watchlist"}
                </h2>
              </div>
            </div>

            {watchlistItems.length === 0 ? (

              <div className="watchlist-empty">
                <div>☆</div>

                <h3>Your watchlist is empty</h3>

                <p>
                  Add instruments from the Markets page
                  to monitor them here.
                </p>

                <button
                  className="market-view-button"
                  onClick={() =>
                    handleNavigation("markets")
                  }
                >
                  Explore Markets →
                </button>
              </div>

            ) : (

              <div className="watchlist-grid">

                {watchlistItems.map((item) => (

                  <div
                    className="watchlist-card"
                    key={item.watchlistItemId}
                  >

                    <div className="watchlist-card-top">

                      <div>
                        <strong>
                          {item.stock?.symbol || "—"}
                        </strong>

                        <span>
                          {item.stock?.stockName || "—"}
                        </span>
                      </div>

                      <button
                        className="watchlist-remove"
                        disabled={watchlistActionLoading}
                        onClick={() =>
                          handleRemoveStock(
                            item.watchlistItemId
                          )
                        }
                      >
                        ×
                      </button>

                    </div>

                    <div className="watchlist-card-info">

                      <div>
                        <span>Exchange</span>
                        <strong>
                          {item.stock?.exchange?.exchangeName ||
                            "—"}
                        </strong>
                      </div>

                      <div>
                        <span>Type</span>
                        <strong>
                          {item.stock?.instrumentType ||
                            "STOCK"}
                        </strong>
                      </div>

                    </div>

                    <button
                      className="market-view-button"
                      onClick={() => {
                        setSelectedMarketStock(item.stock);
                        setActivePage("stock");
                      }}
                    >
                      View Stock →
                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

          <div className="watchlist-add-panel">

            <div>
              <span className="user-eyebrow">
                ADD INSTRUMENT
              </span>

              <h2>Market Instruments</h2>

              <p>
                Add an instrument to your watchlist.
              </p>
            </div>

            <div className="watchlist-add-grid">

              {stocks.slice(0, 12).map((stock) => {

                const alreadyAdded =
                  watchedStockIds.has(stock.stockId);

                return (
                  <div
                    className="watchlist-add-card"
                    key={stock.stockId}
                  >

                    <div>
                      <strong>{stock.symbol}</strong>
                      <span>{stock.stockName}</span>
                    </div>

                    <button
                      disabled={
                        alreadyAdded ||
                        watchlistActionLoading
                      }
                      onClick={() =>
                        handleAddStock(stock.stockId)
                      }
                    >
                      {alreadyAdded
                        ? "Added ✓"
                        : "+ Add"}
                    </button>

                  </div>
                );
              })}

            </div>

          </div>
        </>

      )}

    </section>
  );
}
function renderOrders() {
  return (
    <section className="orders-page">

      <div className="orders-header">
        <div>
          <span className="user-eyebrow">
            TRADING ACTIVITY
          </span>

          <h1>Orders & Trades</h1>

          <p>
            Review your orders, executions, and account transactions.
          </p>
        </div>

        <div className="orders-count-card">
          <strong>
            {orders.length}
          </strong>

          <span>Total Orders</span>
        </div>
      </div>

      <div className="orders-panel">

        <div className="orders-tabs">

          <button
            className={ordersTab === "orders" ? "active" : ""}
            onClick={() => setOrdersTab("orders")}
          >
            Orders
          </button>

          <button
            className={ordersTab === "trades" ? "active" : ""}
            onClick={() => setOrdersTab("trades")}
          >
            Trades
          </button>

          <button
            className={ordersTab === "transactions" ? "active" : ""}
            onClick={() => setOrdersTab("transactions")}
          >
            Transactions
          </button>

        </div>

        {ordersLoading ? (

          <div className="markets-loading">
            <div className="spinner"></div>
            <p>Loading trading activity...</p>
          </div>

        ) : ordersError ? (

          <div className="alert alert-error">
            <span className="alert-icon">!</span>
            <p>{ordersError}</p>
          </div>

        ) : (

          <>
            {/* ORDERS */}

            {ordersTab === "orders" && (
              <div className="orders-table-wrap">

                {orders.length === 0 ? (

                  <div className="orders-empty">
                    <div className="orders-empty-icon">
                      ≡
                    </div>

                    <h3>No orders yet</h3>

                    <p>
                      Your BUY and SELL orders will appear here.
                    </p>

                    <button
                      className="market-view-button"
                      onClick={() =>
                        handleNavigation("markets")
                      }
                    >
                      Explore Markets →
                    </button>
                  </div>

                ) : (

                  <table className="orders-table">

                    <thead>
                      <tr>
                        <th>TYPE</th>
                        <th>STOCK</th>
                        <th>QUANTITY</th>
                        <th>ORDER PRICE</th>
                        <th>STATUS</th>
                        <th>DATE</th>
                      </tr>
                    </thead>

                    <tbody>

                      {orders.map((order) => {

                        const orderType =
                          String(
                            order.orderType || ""
                          ).toUpperCase();

                        const stockSymbol =
                          order.stock?.symbol ||
                          order.stockSymbol ||
                          "—";

                        const status =
                          String(
                            order.orderStatus || "—"
                          ).toUpperCase();

                        return (
                          <tr key={order.orderId}>

                            <td>
                              <span
                                className={
                                  orderType === "BUY"
                                    ? "order-type-buy"
                                    : "order-type-sell"
                                }
                              >
                                {orderType}
                              </span>
                            </td>

                            <td>
                              <strong>
                                {stockSymbol}
                              </strong>
                            </td>

                            <td>
                              {order.quantity}
                            </td>

                            <td>
                              $
                              {formatMoney(
                                order.orderPrice || 0
                              )}
                            </td>

                            <td>
                              <span className="order-status">
                                {status}
                              </span>
                            </td>

                            <td>
                              {order.createdAt
                                ? new Date(
                                    order.createdAt
                                  ).toLocaleDateString()
                                : "—"}
                            </td>

                          </tr>
                        );
                      })}

                    </tbody>

                  </table>
                )}

              </div>
            )}

            {/* TRADES */}

            {ordersTab === "trades" && (
              <div className="orders-table-wrap">

                {trades.length === 0 ? (

                  <div className="orders-empty">
                    <div className="orders-empty-icon">
                      ↗
                    </div>

                    <h3>No executions yet</h3>

                    <p>
                      Executed trades will appear here.
                    </p>
                  </div>

                ) : (

                  <table className="orders-table">

                    <thead>
                      <tr>
                        <th>TYPE</th>
                        <th>STOCK</th>
                        <th>QUANTITY</th>
                        <th>EXECUTION PRICE</th>
                        <th>EXECUTED</th>
                      </tr>
                    </thead>

                    <tbody>

                      {trades.map((trade) => {

                        const order = trade.order;

                        const orderType =
                          String(
                            order?.orderType || ""
                          ).toUpperCase();

                        const stockSymbol =
                          order?.stock?.symbol ||
                          order?.stockSymbol ||
                          "—";

                        return (
                          <tr key={trade.tradeId}>

                            <td>
                              <span
                                className={
                                  orderType === "BUY"
                                    ? "order-type-buy"
                                    : "order-type-sell"
                                }
                              >
                                {orderType}
                              </span>
                            </td>

                            <td>
                              <strong>
                                {stockSymbol}
                              </strong>
                            </td>

                            <td>
                              {trade.quantity}
                            </td>

                            <td>
                              $
                              {formatMoney(
                                trade.executionPrice || 0
                              )}
                            </td>

                            <td>
                              {trade.executedAt
                                ? new Date(
                                    trade.executedAt
                                  ).toLocaleString()
                                : "—"}
                            </td>

                          </tr>
                        );
                      })}

                    </tbody>

                  </table>
                )}

              </div>
            )}

            {/* TRANSACTIONS */}

            {ordersTab === "transactions" && (
              <div className="orders-table-wrap">

                {transactions.length === 0 ? (

                  <div className="orders-empty">
                    <div className="orders-empty-icon">
                      $
                    </div>

                    <h3>No transactions yet</h3>

                    <p>
                      Account transactions will appear here.
                    </p>
                  </div>

                ) : (

                  <table className="orders-table">

                    <thead>
                      <tr>
                        <th>TYPE</th>
                        <th>AMOUNT</th>
                        <th>ORDER</th>
                        <th>DATE</th>
                      </tr>
                    </thead>

                    <tbody>

                      {transactions.map((transaction) => (

                        <tr
                          key={
                            transaction.transactionId
                          }
                        >

                          <td>
                            <span className="transaction-type">
                              {String(
                                transaction.transactionType ||
                                  "—"
                              ).toUpperCase()}
                            </span>
                          </td>

                          <td>
                            <strong>
                              $
                              {formatMoney(
                                transaction.amount || 0
                              )}
                            </strong>
                          </td>

                          <td>
                            {transaction.order?.orderId ||
                              transaction.orderId ||
                              "—"}
                          </td>

                          <td>
                            {transaction.createdAt
                              ? new Date(
                                  transaction.createdAt
                                ).toLocaleString()
                              : "—"}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>
                )}

              </div>
            )}

          </>
        )}

      </div>

    </section>
  );
}
  /* ================= OTHER PAGES ================= */

  function renderComingSoon(title, description) {
    return (
      <section className="coming-page">

        <span className="user-eyebrow">
          PORTFOLIO SYSTEM
        </span>

        <h1>{title}</h1>

        <p>{description}</p>

        <div className="coming-card">
          <span>◈</span>
          <strong>Module ready for integration</strong>
          <small>
            This section will be connected to the PostgreSQL
            data and Spring Boot APIs next.
          </small>
        </div>

      </section>
    );
  }

 

  return (
    <div className="user-shell">

      {renderNavbar()}

      <main className="user-main">

        {activePage === "dashboard" &&
          renderDashboard()}

        {activePage === "markets" &&
          renderMarkets()}

        {activePage === "stock" &&
          renderStockDetails()}

        {activePage === "portfolio" &&
  renderPortfolio()}

       {activePage === "watchlist" &&
  renderWatchlist()}

        {activePage === "orders" &&
  renderOrders()}

      </main>

    </div>
  );
}

export default UserDashboard;