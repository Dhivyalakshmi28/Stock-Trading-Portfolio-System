import { useEffect, useState } from "react";
import { getStocks, getStockPrices } from "./api";
import "./App.css";
import Auth from "./Auth";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceLoading, setPriceLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStocks() {
      try {
        const data = await getStocks();
        setStocks(data);
      } catch (err) {
        console.error(err);
        setError("Unable to connect to the backend.");
      } finally {
        setLoading(false);
      }
    }

    loadStocks();
  }, []);

  async function handleStockClick(stock) {
    setSelectedStock(stock);
    setPrices([]);
    setPriceLoading(true);

    try {
      const data = await getStockPrices(stock.stockId);
      setPrices(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load historical prices.");
    } finally {
      setPriceLoading(false);
    }
  }

  function handleLogin(loggedInUser) {
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  if (user.role === "ADMIN") {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }
  if (user.role === "USER") {
  return (
    <UserDashboard
      user={user}
      onLogout={handleLogout}
    />
  );
}

  return (
    <div className="app-shell">

      <nav className="navbar">

        <div className="navbar-brand">
          <span className="brand-mark" aria-hidden="true"></span>
          <span className="brand-name">Stock Trading</span>
        </div>

        <div className="navbar-links">
          <span className="nav-link nav-link--active">
            Markets
          </span>

          <span
            className="nav-link nav-link--disabled"
            title="Coming soon"
          >
            Portfolio
          </span>

          <span
            className="nav-link nav-link--disabled"
            title="Coming soon"
          >
            Watchlist
          </span>

          <span
            className="nav-link nav-link--disabled"
            title="Coming soon"
          >
            Orders
          </span>
        </div>

        <div className="navbar-profile">
          <span className="profile-avatar" aria-hidden="true">
            {user.fullName?.charAt(0).toUpperCase()}
          </span>

          <span className="profile-name">
            {user.fullName}
          </span>
        </div>

      </nav>

      <section className="hero">

        <div className="hero-content">
          <h1>
            Stock Trading &amp; Portfolio Management
          </h1>

          <p>
            Historical Market Data Platform
          </p>
        </div>

        <div className="hero-stat">
          <span className="hero-stat-value">
            {stocks.length}
          </span>

          <span className="hero-stat-label">
            Instruments available
          </span>
        </div>

      </section>

      <main>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">!</span>
            <p>{error}</p>
          </div>
        )}

        <section className="market-section">

          <h2>Available Stocks</h2>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading market data...</p>
            </div>
          ) : stocks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">—</div>
              <p>No stocks available.</p>
            </div>
          ) : (
            <div className="stock-grid">

              {stocks.map((stock) => (
                <article
                  key={stock.stockId}
                  className={
                    selectedStock?.stockId === stock.stockId
                      ? "stock-card stock-card--active"
                      : "stock-card"
                  }
                  onClick={() => handleStockClick(stock)}
                >

                  <div className="stock-card-top">

                    <h3>{stock.symbol}</h3>

                    <span className="exchange-pill">
                      {stock.exchange?.exchangeName}
                    </span>

                  </div>

                  <p className="stock-name">
                    {stock.stockName}
                  </p>

                </article>
              ))}

            </div>
          )}

        </section>

        {selectedStock && (
          <section className="price-section">

            <div className="price-section-header">

              <div>
                <h2>
                  {selectedStock.symbol}
                </h2>

                <p className="price-section-sub">
                  {selectedStock.stockName}
                </p>
              </div>

              <div className="trading-actions">

                <button
                  className="btn btn-buy"
                  disabled
                >
                  Buy
                </button>

                <button
                  className="btn btn-sell"
                  disabled
                >
                  Sell
                </button>

              </div>

            </div>

            {priceLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading historical prices...</p>
              </div>
            ) : (
              <>
                <p className="record-count">
                  {prices.length} historical records
                </p>

                <div className="chart-placeholder">

                  <div className="chart-placeholder-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <h3>Historical Price Chart</h3>

                  <p>
                    Chart visualization will be added here.
                  </p>

                </div>

                <div className="table-scroll">

                  <table>

                    <thead>
                      <tr>
                        <th>Date</th>
                        <th className="num">Open</th>
                        <th className="num">High</th>
                        <th className="num">Low</th>
                        <th className="num">Close</th>
                        <th className="num">Volume</th>
                      </tr>
                    </thead>

                    <tbody>

                      {prices
                        .slice(-20)
                        .reverse()
                        .map((price) => (
                          <tr key={price.priceId}>

                            <td>
                              {new Date(
                                price.timestamp
                              ).toLocaleDateString()}
                            </td>

                            <td className="num">
                              {price.openPrice}
                            </td>

                            <td className="num">
                              {price.highPrice}
                            </td>

                            <td className="num">
                              {price.lowPrice}
                            </td>

                            <td className="num">
                              {price.closePrice}
                            </td>

                            <td className="num">
                              {price.volume?.toLocaleString()}
                            </td>

                          </tr>
                        ))}

                    </tbody>

                  </table>

                </div>

              </>
            )}

          </section>
        )}

      </main>

    </div>
  );
}

export default App;