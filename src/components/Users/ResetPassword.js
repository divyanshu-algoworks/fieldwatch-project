import React, {Component} from 'react';
import Dialog from 'Components/Dialog';
import Button from 'Components/Button';
import FormGroup from 'Components/FormGroup';
import Input from 'Components/Input';
import API from 'Helpers/api';

export default class ResetPassword extends Component{
  state = {
    isOpen: false,
    password: '',
    confirmPassword: '',
    error: '',
    disableResetBtn: false,
  }

  open = () => this.setState({isOpen: true});
  close = () => this.setState({isOpen: false})
  resetPassword = () => {
    const {password, confirmPassword} = this.state;
    const {password_reset_url, userId} = this.props;

    if(!password || !confirmPassword){
      return;
    }
    if(password !== confirmPassword){
      this.setState({
        ...this.state,
        error: 'Passwords do not match'
      });
      return;
    }

    this.setState({
      disableResetBtn: true
    })

    API.patch(password_reset_url, {
      body: {
        id: userId,
        password,
        confirm_password: confirmPassword
      }
    }).then(() => {
      this.setState({
        password: '',
        confirmPassword: '',
        error: '',
        isOpen: false,
        disableResetBtn: false
      })
    })
  }

  changePassword = ({target}) => {
    this.setState({...this.state, password: target.value, error: ''});
  }

  changeConfirmPassword = ({target}) => {
    this.setState({...this.state, confirmPassword: target.value, error: ''}) 
  }

  render(){
    const {isOpen, password, confirmPassword, error, disableResetBtn} = this.state;
    return (
    <Dialog isOpen={isOpen} onClose={this.close}>
      <Dialog.Header onClose={this.close}>
        <span className="reset-password__header">Reset Password</span>
      </Dialog.Header>
      <Dialog.Body>
        <FormGroup label="Password" labelStyle={{
          width: '150px'
        }}>
          <Input
            className="w-100p"
            type="password"
            value={password}
            onChange={this.changePassword}
          />
        </FormGroup>
        <FormGroup label="Confirm Password" labelStyle={{
          width: '150px'
        }}>
          <Input
            className="w-100p"
            type="password"
            value={confirmPassword}
            onChange={this.changeConfirmPassword}
          />
        </FormGroup>
        {
          error && <div className="reset-password__error">
            {error}
          </div>
        }
      </Dialog.Body>
      <Dialog.Footer>
        <Button status="black" onClick={this.close}>Close</Button>
        <Button status="orange" onClick={this.resetPassword} disabled={disableResetBtn}>Reset Password</Button>
      </Dialog.Footer>
    </Dialog>
  )
  }
}