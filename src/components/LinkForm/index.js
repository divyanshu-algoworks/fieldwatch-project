import React, { Component } from 'react';
import Button from 'Components/Button';
import Input from 'Components/Input';
import PropTypes from 'prop-types'
export default class LinkForm extends Component {
  static defaultProps = {
    placeholder: 'example.com',
  }

  static propTypes = {
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    mode: PropTypes.oneOf(['new', 'edit']),
    disabled: PropTypes.bool,
  }

  get controlButtons() {
    const { mode, onCancel, disabled } = this.props;

    if (mode === 'edit') {
      return [
        (<Button key="cancel-button" status="black"
          onClick={onCancel} disabled={disabled}
          className="links-form__button">Cancel</Button>),
        (<Button key="update-button" type="submit" disabled={disabled}
          className="links-form__button">Update</Button>),
      ];
    }

    return (
      <Button status="black" type="submit" disabled={disabled}
        className="links-form__button">+ Add</Button>
    );

  }

  render() {
    const { onSubmit, onChange, placeholder, value, disabled, LinkVerifyUrl} = this.props;
    return (
      <form onSubmit={onSubmit} noValidate>
        <div className="links-form">
          <Input type="url" onChange={onChange} placeholder={placeholder}
            ref={(inputComponent) => this.formInput = inputComponent}
            disabled={disabled}
            value={value} className="links-form__input" />
          <div className="links-form__buttons">
            {this.controlButtons}
          </div>
        </div>
      </form>
    );
  }
}
