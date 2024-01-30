import React, { Component, useEffect } from "react";
import Input from '../../components/Input';
import { inject, observer } from "mobx-react";
import { Navigate } from "react-router-dom";
// import fieldwatch_logo_small from '../../assets/images/fie'
import CommonForm from "../../components/CommonForm";
@inject("store")
@observer
export default class Login extends CommonForm {
  //modelName = 'user'
  url = '/api/v1/case_management/users/sign_in'
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      loggedIn: false
    }
  }
  handleChangeEmail= ({ target }) => this.changeValue('email', target.value);
  handleChangePassword = ({ target }) => this.changeValue('password', target.value);
  onSuccessSubmit = (_, data) => {
   const { UserInfoState } = this.props.store;
   UserInfoState.setUserData(data.user);
  //  <Navigate replace to="/dashboard" />
  this.setState({ loggedIn: true })
  }
  render() {
    console.log(this.state.item)
    return (
      <React.Fragment>
      {this.state.loggedIn && <Navigate to="/dashboard" />}
      <form onSubmit={this.handleSubmit}>
      <div id="login_main_container">
        <div className="am-wrapper am-login mt-10">
          <div className="am-content">
            <div className="main-content">
              <div className="login-container">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <div className="logo_image">
                      {/* <img src ={fieldwatch_logo_small}/> */}
                    </div>
                    <span>Please enter your user information.</span>
                  </div>
                  <div className="panel-body">
                    <div className="login-form">
                      <div className="form-group">
                        <div className="input-group">
                          <span className="input-group-addon">
                            <i className="icon s7-user"></i>
                            <Input placeholder="Email" value={this.state.item.email} className="w-100p" onChange={this.handleChangeEmail} />
                          </span>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="input-group">
                          <span className="input-group-addon">
                            <i className="icon s7-lock"></i>
                            <Input placeholder="Password" value={this.state.item.password} className="w-100p" onChange={this.handleChangePassword} />
                          </span>
                        </div>
                      </div>
  
                      <div className="buttons_links_block row">
                        <div className="col-xs-6 link_container"></div>
                        <div className="col-xs-6 text-right">
                          <button type="submit" className="btn btn-primary">
                            Log me in
                          </button>
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
      </form>
      </React.Fragment>
      )
  }
   
}