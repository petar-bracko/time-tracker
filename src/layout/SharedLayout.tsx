import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useUserStore } from "../zustand/store";
import { BsStopwatch } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";
import { AiOutlinePoweroff } from "react-icons/ai";

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
                <div className="nav-link-center">
                  <BsStopwatch />
                  <span>Trackers</span>
                </div>
              </NavLink>
              <NavLink
                to="/history"
                className="nav-link"
                style={({ isActive }) => ({
                  borderColor: isActive ? "#ff5722" : "",
                })}
              >
                <div className="nav-link-center">
                  <FaHistory />
                  <span>History</span>
                </div>
              </NavLink>
              <span onClick={handleLogout}>
                <div className="nav-link-center">
                  <AiOutlinePoweroff />
                  <span>Logout</span>
                </div>
              </span>
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
