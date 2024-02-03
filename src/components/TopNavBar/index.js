import { Link } from "react-router-dom";
import fieldWatchLogo from "../../assets/images/fieldwatch_logo_small.png";
import API from "../../helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Component } from "react";
import { inject, observer } from "mobx-react";

export default function TopNavBar(props) {
  const navigate = useNavigate();
  const showClientMenu = props.isClientSelected;
  const handleSignout = async () => {
    await API.delete("/api/v1/case_management/users/sign_out");
    localStorage.clear();
    navigate("/login");
  };
 
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-fixed-top navbar-dark bg-dark">
        <div className="container-fluid">
          <div className="logo_image">
            <Link to="/dashboard">
              <img src={fieldWatchLogo} />
            </Link>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDarkDropdown"
            aria-controls="navbarNavDarkDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDarkDropdown">
            <ul className="navbar-nav">
              <li>
                <a className="dropdown-item" href="#home">
                  Admin
                </a>
              </li>
              <li class="nav_divider">&nbsp;</li>
              {showClientMenu && (
                <>
                  <li>
                    <a className="dropdown-item" href="#news">
                      Results
                    </a>
                  </li>
                  <li class="nav_divider">&nbsp;</li>
                  <li>
                    <a className="dropdown-item" href="#news">
                      Queries
                    </a>
                  </li>
                  <li class="nav_divider">&nbsp;</li>
                  <li>
                    <a className="dropdown-item" href="#news">
                      Incidents
                    </a>
                  </li>
                  <li class="nav_divider">&nbsp;</li>
                  <li>
                    <a className="dropdown-item" href="#news">
                      Analytics
                    </a>
                  </li>
                  <li class="nav_divider">&nbsp;</li>
                </>
              )}
              <li>
                <a className="dropdown-item" href="#news">
                  Forum
                </a>
              </li>
              <li class="nav_divider">&nbsp;</li>
              <li>
                <a className="dropdown-item" href="#contact">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDarkDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="pe-7s-user dropbtn user-icon" />
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-dark"
                  aria-labelledby="navbarDarkDropdownMenuLink"
                >
                  <li>
                    <button
                      onClick={handleSignout}
                      className="dropdown-item"
                      href="#"
                    >
                      Sign Out
                    </button>
                  </li>
                  {/* <li>
                    <a className="dropdown-item" href="#">
                      Profile
                    </a>
                  </li> */}
                </ul>
              </li>
              </ul>
              </div>
        </div>
      </nav>
    </>
  );
}
