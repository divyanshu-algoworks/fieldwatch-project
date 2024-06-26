import React from "react";
import Input from "../../components/Input";
import { inject, observer } from "mobx-react";
import { Navigate } from "react-router-dom";
import fieldWatchLogo from "../../assets/images/fieldwatch_logo_small.png";
import CommonForm from "../../components/CommonForm";
import { checkRequired } from "../../helpers/validators";
import { toast } from "react-toastify";
import mfLogo from "../../assets/images/mf_logo.png";
import "./style.css";
@inject("store")
@observer
export default class Login extends CommonForm {
  validators = {
    email: checkRequired("email"),
    password: checkRequired("password"),
  };
  url = "/case_management/users/sign_in";
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      loggedIn: false,
    };
  }
  componentDidMount() {
    document.body.style.backgroundColor = "rgb(202 234 240)"; //"#1d6d7e";
  }
  componentWillUnmount() {
    document.body.style.backgroundColor = "#f0f0f0";
  }
  handleChangeEmail = ({ target }) => this.changeValue("email", target.value);
  handleChangePassword = ({ target }) =>
    this.changeValue("password", target.value);
  onSuccessSubmit = (_, data) => {
    toast.success("Login Successful");
    const { UserInfoState } = this.props.store;
    UserInfoState.setUserData(data.user);
    this.setState({ loggedIn: true });
  };
  render() {
    return (
      <React.Fragment>
        {this.state.loggedIn && <Navigate to="/dashboard" />}
        {/* <form onSubmit={this.handleSubmit}>
          <div id="login_main_container">
            <div className="am-wrapper am-login mt-10">
              <div className="am-content">
                <div className="main-content">
                  <div className="login-container">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <div className="logo_image">
                          <img src={fieldWatchLogo} />
                        </div>
                        <span>Please enter your user information.</span>
                      </div>
                      <div className="panel-body">
                        <div className="login-form">
                          <div className="form-group">
                            <div className="input-group">
                              <span className="input-group-addon">
                                <i className="icon s7-user"></i>
                                <Input
                                  placeholder="Email"
                                  value={this.state.item.email}
                                  className="w-100p"
                                  onChange={this.handleChangeEmail}
                                />
                              </span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="input-group">
                              <span className="input-group-addon">
                                <i className="icon s7-lock"></i>
                                <Input
                                  placeholder="Password"
                                  type="password"
                                  value={this.state.item.password}
                                  className="w-100p"
                                  onChange={this.handleChangePassword}
                                />
                              </span>
                            </div>
                          </div>

                          <div className="buttons_links_block row">
                            <div className="col-xs-6 link_container"></div>
                            <div className="col-xs-6 text-right">
                              <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ backgroundColor: "#3ea1d2" }}
                              >
                                Log me in
                              </button>
                            </div>
                          </div>
                          <div className="footer_logo">
                            <div>Powered By:</div>
                            <div>
                              <img src={mfLogo}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form> */}
        <div class="login-body">
          <div class="background"></div>
          <div class="login-container" id="loginContainer">
            <div class="login-header">
              <div className="logo_image">
                <img src={fieldWatchLogo} />
              </div>
              <p>Please enter your user information.</p>
            </div>
            <div class="login-form">
              <form onSubmit={this.handleSubmit}>
                {/* <div class="input-group">
                  <i class="fa fa-user"></i>
                  <input
                    type="text"
                    value={this.state.item.email}
                    name="username"
                    onChange={this.handleChangeEmail}
                    placeholder="Username"
                    required
                  />
                </div> */}
                <div class="user-input-wrp mb-10">
                  <br />
                  <input type="text" 
                  class="inputText" 
                  required 
                  value={this.state.item.email}
                    name="username"
                    onChange={this.handleChangeEmail}
                  />
                  <span class="floating-label">Email</span>
                </div>
                {/* <div class="input-group">
                  <i class="fa fa-lock"></i>
                  <input
                    type="password"
                    name="password"
                    value={this.state.item.password}
                    onChange={this.handleChangePassword}
                    placeholder="Password"
                    required
                  />
                </div> */}
                <div class="user-input-wrp">
                  <br />
                  <input type="password" 
                  class="inputText" 
                  name="password"
                    value={this.state.item.password}
                    onChange={this.handleChangePassword}
                  required />
                  <span class="floating-label">Password</span>
                </div>
                <button className="login-btn mt-20" type="submit">
                  Login
                </button>
              </form>
            </div>
            <div className="footer_logo mt-20">
              <div>Powered By:</div>
              <div>
                <img src={mfLogo} />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
