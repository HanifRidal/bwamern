import React from "react";

import Button from "elements/Button";
import BrandIcon from "parts/IconText";

export default function Header(props) {
  const getNavLinkClass = (path) => {
    return props.location.pathname === path ? "active" : "";
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
              <li className={`nav-item ${getNavLinkClass("/vacation")}`}>
                <Button className="nav-link" type="link" href="/vacation">
                  Vacation
                </Button>
              </li>
              <li className={`nav-item ${getNavLinkClass("/login")}`}>
                <Button
                  className="nav-link text-white"
                  style={{ buttonRadius: 20 }}
                  hasShadow
                  isPrimary
                  type="link"
                  href="/login"
                >
                  Login
                </Button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
