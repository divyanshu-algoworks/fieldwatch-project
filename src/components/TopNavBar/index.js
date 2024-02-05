import { Link } from "react-router-dom";
import fieldWatchLogo from "../../assets/images/fieldwatch_logo_small.png";
import API from "../../helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Component } from "react";
import { inject, observer } from "mobx-react";

export default function TopNavBar(props) {
  const navigate = useNavigate();
  const showClientMenu = props.isClientSelected;
  const handleSignout = async () => {
    await API.delete("/case_management/users/sign_out");
    localStorage.clear();
    toast.success("Logged out successfully");
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
                <div className="nav-icon-item">
                  <i className="fa fa-diamond c-white" />
                  <Link to="/dashboard"> <a className="dropdown-item">Admin</a></Link>
                </div>
              </li>
              {showClientMenu && (
                <div>
                  <i className="fa fa-chevron-right client_name_icon" />
                  <span className="client_name"> Testing Client </span>
                </div>
              )}
              <li class="nav_divider">&nbsp;</li>
              {showClientMenu && (
                <>
                  <li>
                    <div className="nav-icon-item">
                      <i className="fa fa-list-alt c-white" />
                      <a className="dropdown-item">Results</a>
                    </div>
                  </li>
                  <li class="nav_divider">&nbsp;</li>
                  <li>
                    <div className="nav-icon-item">
                      <i className="fa fa-reorder c-white" />
                      <a className="dropdown-item">Queries</a>
                    </div>
                  </li>
                  <li class="nav_divider">&nbsp;</li>
                  <li>
                    <div className="nav-icon-item">
                      <i className="fa fa-warning c-white" />
                      <a className="dropdown-item">Incidents</a>
                    </div>
                  </li>
                  <li class="nav_divider">&nbsp;</li>
                  <li>
                    <div className="nav-icon-item">
                      <i className="fa fa-pie-chart c-white" />
                      <a className="dropdown-item">Analytics</a>
                    </div>
                  </li>
                  <li class="nav_divider">&nbsp;</li>
                </>
              )}
              <li>
                <div className="nav-icon-item">
                  <i className="fa fa-twitch c-white" />
                  <a className="dropdown-item">Forum</a>
                </div>
              </li>
              <li class="nav_divider">&nbsp;</li>
              <li>
                <div className="nav-icon-item">
                  <i className="fa fa-question-circle-o c-white" />
                  <a className="dropdown-item">Help & Support</a>
                </div>
              </li>
            </ul>
          </div>
          <div className="m-auto">
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
