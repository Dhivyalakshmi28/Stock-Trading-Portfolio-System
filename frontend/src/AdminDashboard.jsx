import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to load registered users.");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const activeUsers = users.filter(
    (item) => item.status === "ACTIVE"
  ).length;

  const adminUsers = users.filter(
    (item) => item.role === "ADMIN"
  ).length;

  return (
    <div className="owner-shell">

      {/* NAVBAR */}
      <nav className="owner-navbar">

        <div className="owner-brand">
          <span className="owner-brand-mark">ST</span>

          <div>
            <strong>Stock Trading</strong>
            <span>Portfolio Management System</span>
          </div>
        </div>

        <div className="owner-nav-label">
          Owner Console
        </div>

        <div className="owner-profile-container">

          <button
            className="owner-profile-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="owner-avatar">
              {user?.fullName?.charAt(0).toUpperCase()}
            </span>

            <span className="owner-profile-info">
              <strong>{user?.fullName}</strong>
              <small>Owner</small>
            </span>

            <span className="owner-chevron">
              {menuOpen ? "▲" : "▼"}
            </span>
          </button>

          {menuOpen && (
            <div className="owner-profile-menu">

              <div className="owner-menu-user">
                <strong>{user?.fullName}</strong>
                <span>{user?.email}</span>
              </div>

              <div className="owner-menu-divider"></div>

              <button
                className="owner-menu-item"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </button>

              <button
                className="owner-menu-item owner-menu-logout"
                onClick={onLogout}
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </nav>

      {/* MAIN */}
      <main className="owner-main">

        {/* HEADER */}
        <section className="owner-welcome">

          <div>
            <span className="owner-eyebrow">
              OWNER CONSOLE
            </span>

            <h1>
              Welcome back, {user?.fullName?.split(" ")[0]}
            </h1>

            <p>
              Monitor users and manage the Stock Trading platform.
            </p>
          </div>

          <div className="owner-date">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

        </section>

        {/* STAT CARDS */}
        <section className="owner-stats">

          <div className="owner-stat-card">
            <div className="owner-stat-icon">U</div>

            <div>
              <span>Total Users</span>
              <strong>{users.length}</strong>
            </div>
          </div>

          <div className="owner-stat-card">
            <div className="owner-stat-icon owner-stat-green">
              ✓
            </div>

            <div>
              <span>Active Users</span>
              <strong>{activeUsers}</strong>
            </div>
          </div>

          <div className="owner-stat-card">
            <div className="owner-stat-icon owner-stat-purple">
              A
            </div>

            <div>
              <span>Owner Accounts</span>
              <strong>{adminUsers}</strong>
            </div>
          </div>

          <div className="owner-stat-card">
            <div className="owner-stat-icon owner-stat-cyan">
              38
            </div>

            <div>
              <span>Instruments</span>
              <strong>38</strong>
            </div>
          </div>

        </section>

        {/* USERS */}
        <section className="owner-panel">

          <div className="owner-panel-header">

            <div>
              <span className="owner-eyebrow">
                ACCOUNT MANAGEMENT
              </span>

              <h2>Registered Users</h2>

              <p>
                User accounts currently stored in PostgreSQL.
              </p>
            </div>

            <span className="owner-count">
              {users.length} accounts
            </span>

          </div>

          {loading && (
            <div className="owner-loading">
              <div className="owner-spinner"></div>
              Loading registered users...
            </div>
          )}

          {error && (
            <div className="owner-error">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="owner-table-wrap">

              <table className="owner-table">

                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered</th>
                  </tr>
                </thead>

                <tbody>

                  {users.map((item) => (
                    <tr key={item.userId}>

                      <td>
                        <div className="owner-user-cell">

                          <span className="owner-user-avatar">
                            {item.fullName
                              ?.charAt(0)
                              .toUpperCase()}
                          </span>

                          <div>
                            <strong>{item.fullName}</strong>
                            <small>
                              ID #{item.userId}
                            </small>
                          </div>

                        </div>
                      </td>

                      <td className="owner-email">
                        {item.email}
                      </td>

                      <td>
                        {item.phone || "—"}
                      </td>

                      <td>
                        <span
                          className={
                            item.role === "ADMIN"
                              ? "owner-badge owner-badge-owner"
                              : "owner-badge owner-badge-user"
                          }
                        >
                          {item.role === "ADMIN"
                            ? "OWNER"
                            : "USER"}
                        </span>
                      </td>

                      <td>
                        <span className="owner-status">
                          <span className="owner-status-dot"></span>
                          {item.status}
                        </span>
                      </td>

                      <td>
                        {item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;