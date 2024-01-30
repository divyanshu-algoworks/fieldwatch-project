import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

import Button from '../../components/Button';
import OptionsList from './OptionsList';

/**
 * Select is component for FieldWatch select. It named Select, but it hasn't
 * select input inside. It just styled div with dropdown. Select has "Clear"
 * button and has search feature. Also it has keyboard support (detailed in
 * OptionsList component documentation).
 */
export default class Select extends Component {
  static propTypes = {
    /** current value */
    value: PropTypes.any,
    /** is select disabled */
    disabled: PropTypes.bool,
    /** should select render clear button */
    clearable: PropTypes.bool,
    /** select options list */
    options: PropTypes.array,
    /** select text when select hasn't value */
    placeholder: PropTypes.string,
    /** option propery, which is like value for select */
    valueKey: PropTypes.string,
    /** option name in options list */
    labelKey: PropTypes.string,
    /** function for render every option in options list */
    triggerRenderer: PropTypes.func,
    optionRenderer: PropTypes.func,
    /** should be displayed options list search input flag */
    hasSearch: PropTypes.bool,
    defaultValue: PropTypes.any,
    triggerClassName: PropTypes.string,
    optionCLassName: PropTypes.string,
    searchFn: PropTypes.func,
  }

  static defaultProps = {
    options: [],
    valueKey: 'id',
    labelKey: 'name',
  }

  state = {
    search: '',
    isOpen: false,
    selectedOption: null,
    userInput: ''
  }

  /**
   * If select has valueKey prop, then return special property, else return
   * all option.
   * @param {*} option selected option
   */
  @autobind getOptionValue(option) {
    if (typeof option !== 'object') {
      return option;
    }
    const { valueKey } = this.props;
    return (valueKey && !!option) ? option[valueKey] : option;
  }

  /**
   * If select has labelKey prop, then return special property, else return
   * all option.
   * @param {*} option selected option
   */
  @autobind getOptionLabel(option) {
    if (typeof option !== 'object') {
      return option;
    }
    const { labelKey } = this.props;
    return labelKey ? option[labelKey] : option;
  }

  /**
   * Write selected option to Select state, and call onChange handler from props
   * with two arguments: option value and all option.
   * @param {*} selectedOption selected option
   */
  @autobind handleChange(selectedOption) {
    const { onChange } = this.props;
    this.setState({ selectedOption, userInput: '' });
    if (!!onChange) {
      onChange(this.getOptionValue(selectedOption), selectedOption);
    }
  }

  @autobind handleUserInput(value){
    this.setState({
      userInput: value
    })
  }

  /**
   * Write nul to Select state and call onChange handler from props with nulls
   * as arguments.
   * @param {*} e event handler
   */
  @autobind clear(e) {
    e.stopPropagation();
    const { onChange } = this.props;
    this.setState({ selectedOption: null });
    if (!!onChange) {
      onChange(null, null);
    }
  }

  /**
   * hide OptionsList and remove click listener from document.
   */
  @autobind close() {
    this.setState({ isOpen: false, userInput: '' });
    document.removeEventListener('click', this.handleDocumentClick);
  }

  /**
   * Check click target, and if it wasn't seach input, close Select.
   * @param {object} param0 event handler
   */
  @autobind handleDocumentClick({ target }) {
    if(!this.optionsList){
      this.close();
    }
    else if (target !== this.optionsList.input) {
      this.close();
    }
  }

  /**
   * If select wasnt disabled, then open OptionsList and add click listener for
   * document for close Select, when user click on any page area.
   */
  @autobind open() {
    if (this.props.disabled) {
      return;
    }
    this.setState({ isOpen: true });
    document.addEventListener('click', this.handleDocumentClick, true)
  }

  @autobind selectOptionByValue(value, options = this.props.options) {
    this.setState({
      selectedOption: (value !== null && value !== undefined) ? options.filter(
        option => this.getOptionValue(option) === this.getOptionValue(value)
      )[0] : null
    });
  }

  componentDidMount() {
    const { value, defaultValue, options } = this.props;
    if (!!value) {
      this.selectOptionByValue(value);
    } else if (defaultValue !== undefined) {
      const selectedOption = options.filter(
        option => this.getOptionValue(option) === this.getOptionValue(value)
      )[0];
      this.setState({ selectedOption });
    }
  }

  componentWillReceiveProps({ value, options, queryResultTab }) {
    if(value === null && queryResultTab){
      return;
    }
    this.selectOptionByValue(value, options);
  }

  get selectedValue() {
    const { options, value } = this.props;
    return value ? options.filter(option => this.getOptionValue(option) === value)[0] : null
  }

  get triggerPosition() {
    if (!this.trigger) {
      return;
    }
    const rect = this.trigger.getBoundingClientRect();
    const { left, width, height } = rect;
    const top = rect.top + height;
    return { left, top: top + window.scrollY, width };
  }

  render() {
    const { options, className, placeholder, clearable, optionRenderer, triggerRenderer,
      invalid, disabled, vertical, hasSearch, triggerClassName, optionClassName, searchFn, newSelect
    } = this.props;
    const { selectedOption, isOpen, userInput } = this.state
    return (
      <div className={classnames('fw-select', className)}>
        <div ref={div => this.trigger = div} onClick={this.open}
          className={classnames('fw-select__trigger', {
            'fw-select__trigger--invalid': invalid,
            'fw-select__trigger--disabled': disabled,
            'fw-select__trigger--vertical': vertical
          }, triggerClassName)}>
          {!!selectedOption && !userInput ?
            (<div className="fw-select__selected-name">{triggerRenderer ? triggerRenderer(selectedOption) : this.getOptionLabel(selectedOption)}</div>) : !!userInput && newSelect ? <div className="fw-select__selected-name">{userInput}</div> :
            (<div className="fw-select__placeholder">{placeholder}</div>)
          }
          <div className="fw-select__right-controls">
            {!!clearable && !!selectedOption && (
              <Button status="link" onClick={this.clear} disabled={disabled}>
                &times;
              </Button>
            )}
            <i className="fw-select__icon-down fa fa-caret-down"></i>
          </div>
        </div>
        {isOpen && (<OptionsList options={options} getOptionValue={this.getOptionValue}
          searchFn={searchFn}
          optionClassName={optionClassName}
          optionRenderer={optionRenderer}
          position={this.triggerPosition} hasSearch={hasSearch}
          selectedOption={selectedOption} onClose={this.close}
          ref={(optionsList) => this.optionsList = optionsList}
          getOptionLabel={this.getOptionLabel}
          onOptionSelect={this.handleChange} 
          userInput={userInput}
          handleUserInput={this.handleUserInput}
          newSelect={newSelect}
          />)}
      </div>
    );
  };
}
