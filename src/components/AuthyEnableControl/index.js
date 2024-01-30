import React, { Component, Fragment, createRef, } from 'react';
import classnames from 'classnames';
import Button from 'Components/Button';
import Dialog from 'Components/Dialog';
import Select from 'Components/Select';
import Input from 'Components/Input';
import API from 'Helpers/api';
import { AUTHY_COUNTRIES_LIST, DEFAULT_COUNTRY } from 'Constants/Countries';

function countrySearchFn({ country }, search) {
  return country.toLowerCase().indexOf(search.toLowerCase()) > -1;
}

const countryTriggerRenderer = (option) => {
  const country = option.country.substring(0, 2).toLowerCase() + option.code;
  const optionFlag = `aflag flag-${country}`;
  return (
    <div>
      <span className={optionFlag}></span>{option.country}
    </div>
  );
}

const countryOptionRenderer = ({
  key, option, optionClassName, isOptionSelected, isOptionFocused,
  getOptionLabel, getOptionValue, ...opts }) => {
  const country = option.country.substring(0, 2).toLowerCase() + option.code;
  const optionFlag = `aflag flag-${country}`;

  return (
    <div key={key}
      className={classnames(optionClassName, 'fw-select__option', {
        'fw-select__option--selected': isOptionSelected,
        'focused fw-select__option--focused': isOptionFocused,
      })} {...opts}>
      <span className={optionFlag}></span>{option.country}
    </div>
  );
}
export default class AuthyEnableControl extends Component {
  state = {
    isDialogOpen: false,
    mode: 'enabling',
    country: {},
    cellphone: '',
    token: ''
  };

  constructor(props) {
    super(props);
    this.phoneInput = createRef();
  }

  handleOpenDialog = () => this.setState({
    isDialogOpen: true,
    mode: 'enabling',
    country: {},
    cellphone: '',
    token: '',
  });
  handleCloseDialog = () => this.setState({ isDialogOpen: false });
  handleChangeCountry = (_, country) => {
    this.setState({ country });
    this.phoneInput.current.input.focus();
  };
  handleChangeCellPhone = ({ target }) => this.setState({ cellphone: target.value });
  handleChangeToken = ({ target }) => this.setState({ token: target.value });
  handleBackToEnabling = () => this.setState({ mode: 'enabling' });
  handleSubmitEnableForm = (e) => {
    e.preventDefault();
    const { country, cellphone } = this.state;
    const body = {
      country_code: country.code,
      cellphone,
    }
    API.post(this.props.paths.enable_path, {
      body,
    }).then(({ success, errors }) => {
      if (!!success) {
        this.setState({ mode: 'verifying' });
      } else if (!!errors) {
        this.setState({ errors });
      }
    });
  }
  handleSubmitVerifyingForm = (e) => {
    e.preventDefault();
    const { token } = this.state;
    API.post(this.props.paths.verify_path, {
      body: { token },
    }).then(({ success }) => {
      if (!!success) {
        this.setState({ isDialogOpen: false });
        this.props.onChange(true);
      }
    });
  }

  handleRequestSMS = () => {
    API.post(this.props.paths.request_sms_path);
  }

  get title() {
    if (this.state.mode === 'enabling') {
      return 'Enable Two factor authentication';
    }
    return 'Verifying';
  }

  render() {
    const { enabled } = this.props;
    const { mode, cellphone, country, token, } = this.state;

    return (
      <Fragment>
        {!!enabled && (
          <Fragment>
            <div className="c-orange">Two factor authentication enabled</div>
            (<Button onClick={this.handleOpenDialog}
              status="link">
              Change authy phone
            </Button>)
          </Fragment>
        )}
        {!enabled && (
          <Button size="big" onClick={this.handleOpenDialog}
            status="black">
            Enable two factor authentication
          </Button>
        )}
        <Dialog isOpen={this.state.isDialogOpen} onClose={this.handleCloseDialog}>
          <Dialog.Header onClose={this.handleCloseDialog}>
            {mode === 'enabling' ? 'Enable Two factor authentication' : 'Verifying'}
          </Dialog.Header>
          <Dialog.Body>
            {(mode === 'enabling') && (
              <form onSubmit={this.handleSubmitEnableForm}>
                <div className="grid">
                  <div className="grid__row">
                    <div className="grid__col grid__col--12">
                      Two-Factor authentication uses your phone number to&nbsp;provide an extra layer
                      of&nbsp;protection to your account
                  </div>
                  </div>
                  <div className="grid__row">
                    <div className="grid__col grid__col--8">
                      <Select value={country} className="w-100p" valueKey="country" nameKey="country"
                        placeholder={DEFAULT_COUNTRY.country}
                        searchFn={countrySearchFn}
                        onChange={this.handleChangeCountry} hasSearch
                        triggerRenderer={countryTriggerRenderer}
                        optionRenderer={countryOptionRenderer}
                        options={AUTHY_COUNTRIES_LIST} />
                    </div>
                    <div className="grid__col grid__col--4">
                      <Input type="tel" value={cellphone} className="w-100p"
                        ref={this.phoneInput}
                        onChange={this.handleChangeCellPhone} placeholder="Cell Phone #" />
                    </div>
                  </div>
                </div>
              </form>
            )}
            {mode === 'verifying' && (
              <form onSubmit={this.handleSubmitVerifyingForm}>
                <div className="grid">
                  <div className="grid__row">
                    <div className="grid__col grid__col--12">
                      Your phone:&nbsp;<b>+{country.code} {cellphone}</b>
                    </div>
                  </div>
                  <div className="grid__row">
                    <div className="grid__col grid__col--12">
                      You can get this code from the Authy mobile app or&nbsp;
                  <Button status="link" onClick={this.handleRequestSMS}>request it via SMS</Button>
                      <Input className="w-100p" value={token} autoFocus onChange={this.handleChangeToken} />
                    </div>
                  </div>
                  <div className="grid__row">
                    <div className="grid__col grid__col--12">
                      Wrong phone number:&nbsp;
                  <Button status="link" onClick={this.handleBackToEnabling}>Go Back</Button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </Dialog.Body>
          <Dialog.Footer>
            <Button status="white" onClick={this.handleCloseDialog}>
              Close
            </Button>
            {mode === 'enabling' && (
              <Button onClick={this.handleSubmitEnableForm}>
                Enable 2FA
              </Button>
            )}
            {mode === 'verifying' && (
              <Button onClick={this.handleSubmitVerifyingForm}>
                Finish
              </Button>
            )}
          </Dialog.Footer>
        </Dialog>
      </Fragment>
    )
  }
}
