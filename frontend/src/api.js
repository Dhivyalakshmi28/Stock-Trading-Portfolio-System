const API_URL = import.meta.env.VITE_API_URL;

export async function getStocks() {
  const response = await fetch(`${API_URL}/api/stocks`);

  if (!response.ok) {
    throw new Error("Failed to fetch stocks");
  }

  return response.json();
}

export async function getStockPrices(stockId) {
  const response = await fetch(
    `${API_URL}/api/stock-prices/stock/${stockId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stock prices");
  }

  return response.json();
}

export async function getAccountByUserId(userId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/accounts/user/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch account");
  }

  return response.json();
}

export async function executeTrade(
  accountId,
  stockId,
  orderType,
  quantity
) {
  const token = localStorage.getItem("token");

  const params = new URLSearchParams({
    accountId: String(accountId),
    stockId: String(stockId),
    orderType: String(orderType),
    quantity: String(quantity),
  });

  const response = await fetch(
    `${API_URL}/api/trading/execute?${params.toString()}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Trade execution failed");
  }

  return response.json();
}

export async function getHoldingsByAccount(accountId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/holdings/account/${accountId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch holdings");
  }

  return response.json();
}


// =========================
// WATCHLIST
// =========================

export async function getWatchlistsByUser(userId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/watchlists/user/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch watchlists");
  }

  return response.json();
}

export async function createWatchlist(watchlist) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/watchlists`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(watchlist),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create watchlist");
  }

  return response.json();
}

export async function deleteWatchlist(watchlistId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/watchlists/${watchlistId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete watchlist");
  }
}

export async function getWatchlistItems(watchlistId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/watchlist-items/watchlist/${watchlistId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch watchlist items");
  }

  return response.json();
}

export async function addToWatchlist(watchlistId, stockId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/watchlist-items`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        watchlist: {
          watchlistId: watchlistId,
        },
        stock: {
          stockId: stockId,
        },
        addedAt: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to add stock to watchlist");
  }

  return response.json();
}

export async function removeFromWatchlist(itemId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/watchlist-items/${itemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove stock from watchlist");
  }
}
export async function getOrdersByAccount(accountId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/orders/account/${accountId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }


  return response.json();

}
export async function getTradeByOrderId(orderId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/trades/order/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch trade");
  }

  return response.json();
}
export async function getTransactionsByAccount(accountId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/transactions/account/${accountId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
}