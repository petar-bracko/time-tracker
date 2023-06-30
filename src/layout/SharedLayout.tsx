import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useUserStore } from "../zustand/store";

export const SharedLayout = () => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);

  function handleLogout() {
    clearUser();
    navigate("/login", { replace: true });
  }

  return (
    <section className="layout-wrapper">
      <header className="app-header">
        <div className="app-title">Tracking tool</div>
        {user.isAuthenitacted && (
          <div className="nav-actions">
            <nav className="nav-list">
              <NavLink
                to="/"
                className="nav-link"
                style={({ isActive }) => ({
                  borderColor: isActive ? "#ff5722" : "",
                })}
              >
                Trackers
              </NavLink>
              <NavLink
                to="/history"
                className="nav-link"
                style={({ isActive }) => ({
                  borderColor: isActive ? "#ff5722" : "",
                })}
              >
                History
              </NavLink>
              <span onClick={handleLogout}>Logout</span>
            </nav>
          </div>
        )}
      </header>
      <div className="content-wrapper">
        <div className="outlet-wrapper">
          <Outlet />
        </div>
      </div>
    </section>
  );
};
