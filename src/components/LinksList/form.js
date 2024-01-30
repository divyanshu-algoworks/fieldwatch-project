import React, { Component, createRef } from 'react';
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
    linkAsObject: PropTypes.bool,
    placeholder: PropTypes.string,
    mode: PropTypes.oneOf(['new', 'edit']),
    disabled: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.formInput = createRef();
  }

  get controlButtons() {
    const { mode, onCancel, disabled, addButtonText, } = this.props;

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
        className="links-form__button">+ {addButtonText || 'Add'}</Button>
    );
  }

  handleChangeValue = ({target}) => {
    this.props.onChange(target.value);
  };

  render() {
    const { onSubmit, placeholder, value, disabled, linkUrlError } = this.props;
    return (
      <form onSubmit={onSubmit} noValidate>
        <div className="links-form">
          <Input type="url" onChange={this.handleChangeValue} placeholder={placeholder}
            ref={this.formInput}
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
