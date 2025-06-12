import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import Button from "elements/Button";
import BrandIcon from "parts/IconText";
import AuthContext from "context/AuthContext";
import api from "../Config/axiosconfig";

export default function Header(props) {
  const { auth, setAuth } = useContext(AuthContext);
  console.log("Auth state:", auth); // Check auth state
  console.log("Is logged in:", auth.isLoggedIn); // Verify isLoggedIn flag
  const history = useHistory();

  const getNavLinkClass = (path) => {
    return props.location.pathname === path ? "active" : "";
  };

  const handleLogout = async () => {
    try {
      console.log("Logout clicked");

      await api.post("/user/logout");

      // Clear authentication state
      setAuth({
        isLoggedIn: false,
        user: null,
      });

      // Remove token from localStorage if you're storing it there
      localStorage.removeItem("token");

      // Redirect to homepage
      history.push("/");
    } catch (error) {
      console.error("Logout failed", error);
      // Still clear local state even if API call fails
      setAuth({
        isLoggedIn: false,
        user: null,
      });
      localStorage.removeItem("token");
      history.push("/");
    }
  };

  return (
    <header className="spacing-sm">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <BrandIcon />
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              <li className={`nav-item ${getNavLinkClass("/")}`}>
                <Button className="nav-link" type="link" href="/">
                  Home
                </Button>
              </li>
              <li className={`nav-item ${getNavLinkClass("/browse-by")}`}>
                <Button className="nav-link" type="link" href="/browse-by">
                  Browse By
                </Button>
              </li>
              <li className={`nav-item ${getNavLinkClass("/properties")}`}>
                <Button className="nav-link" type="link" href="/properties">
                  Vacation
                </Button>
              </li>

              {auth.isLoggedIn ? (
                <li className={`nav-item`}>
                  <Button
                    className="nav-link text-white"
                    hasShadow
                    isPrimary
                    type="link"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </li>
              ) : (
                <li className={`nav-item`}>
                  <Button
                    className="nav-link text-white"
                    hasShadow
                    isPrimary
                    type="link"
                    href="/login"
                  >
                    Login
                  </Button>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
