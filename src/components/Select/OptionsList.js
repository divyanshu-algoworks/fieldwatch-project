import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Input from '../Input' //'Components/Input';

/**
 * OptionsList is component for Select options list rendering
 */
export default class OptionsList extends Component {
  static propTypes = {
    /** getter for option value */
    getOptionValue: PropTypes.func,
    /** getter for option value */
    getOptionLabel: PropTypes.func,
    /** getter for option value */
    onOptionSelect: PropTypes.func,
    position: PropTypes.object,
    selectedOption: PropTypes.object,
    optionRenderer: PropTypes.func,
    hasSearch: PropTypes.bool,
    /** if true, then we disable focus un dropdown list */
    disableFocus: PropTypes.bool,
    /** Active element index. We need it if we want to control active element
     * from outside */
    activeOptionIndex: PropTypes.number,
    optionCLassName: PropTypes.string,
    searchFn: PropTypes.func,
  }

  static defaultProps = {
    optionRenderer: ({
      option, isOptionSelected, isOptionFocused, getOptionLabel, getOptionValue,
      optionClassName, ...otherArgs
    }) => {
     if(option.noDisplay || option.name === 'Default') return false;
      return (
        <div {...otherArgs} className={classnames('fw-select__option', {
          'fw-select__option--selected': isOptionSelected,
          [`${optionClassName}--selected`]: !!optionClassName && isOptionSelected,
          'focused fw-select__option--focused': isOptionFocused,
          [`${optionClassName}--focused`]: !!optionClassName && isOptionFocused,
        }, optionClassName)}>
          {getOptionLabel(option)}
        </div>
      );
    },
    searchFn: (option, search, { getOptionLabel }) => {
      const optionName = getOptionLabel ? getOptionLabel(option) : option;
      return optionName.toLowerCase().startsWith(search.toLowerCase());
    }
  }

  state = {
    search: '',
    focusedIndex: 0,
  }

  constructor(props) {
    super(props);
    const { selectedOption } = props;
    if (!!selectedOption) {
      const focusedIndex = this.optionsToDisplay.findIndex((option) => {
        return this.getOptionLabel(option) === this.getOptionLabel(props.selectedOption);
      })
      this.state = { search: '', focusedIndex };
    }
  }

  /**
   * set search value and change focused option index
   * @param {object} param0 event handler
   */
  @autobind handleSearchChange({ target }) {
    this.setState({ search: target.value, focusedIndex: 0 });
  }

  @autobind getOptionValue(option) {
    if (!option) {
      return null;
    }
    const { getOptionValue } = this.props;
    if (typeof getOptionValue === 'function') {
      return getOptionValue(option);
    }
    return option.id || option;
  }

  @autobind getOptionLabel(option) {
    if (!option) {
      return null;
    }
    const { getOptionLabel } = this.props;
    if (typeof getOptionLabel === 'function') {
      return getOptionLabel(option);
    }
    return option.name || option;
  }

  /**
   * Filter options by label with search value in downcase
   */
  get optionsToDisplay() {
    const { search } = this.state;
    const { options, hasSearch, searchFn, userInput, newSelect } = this.props;

    if(newSelect){
      return options.filter(option => searchFn(option, userInput, this.props));
    }else{
      if (!hasSearch || search === '') {
        return options
      }
      return options.filter(option => searchFn(option, search, this.props));
    }
  }

  /**
   * set focused index option to state
   * @param {number} focusedIndex
   */
  @autobind setFocusedOption(focusedIndex) {
    const { onFocusedOptionIndexChange } = this.props;
    if (onFocusedOptionIndexChange) {
      onFocusedOptionIndexChange(focusedIndex);
    } else {
      this.setState({ focusedIndex });
    }
  }

  /**
   * when list displayed, we should addfocus to turn on keyboard functionality
   * (if there is search input, then focus there, because we need to use search,
   * else we need just to sweetch between options by keyboard)
   */
  componentDidMount() {
    const { disableFocus, newSelect } = this.props;
    this.autoscrollToFocusedElement();
    if (disableFocus) {
      return;
    }

    if (!!this.input) {
      this.input.focus();
    } else {
      if(newSelect){
        this.optionsContainer.focus();
      }else{
        this.list.focus();
      }
    }
    document.addEventListener('mousedown', this.handleClick);
  }

  componentDidUpdate() {
    this.autoscrollToFocusedElement();
  }

  /**
   * This function calls on component mount and after every update. We need it
   * to not lose focused option
   */
  @autobind autoscrollToFocusedElement() {
    const focusedElement = this.list.getElementsByClassName('focused')[0];
    if (!focusedElement) {
      return;
    }
    const focusedTop = focusedElement.offsetTop - this.list.scrollTop;
    const focusedBottom = focusedTop + focusedElement.offsetHeight;
    if (this.list.offsetHeight < focusedBottom) {
      this.list.scrollTop = focusedElement.offsetTop - this.list.offsetHeight + focusedElement.offsetHeight;
    } else if (focusedTop < 0) {
      this.list.scrollTop = focusedElement.offsetTop;
    }
  }

  /**
   * We get pressed key, and if it is arrow, we change focused option; if it is
   * enter, then we select focused option; on escape we just close options list
   * @param {object} param0 event handler
   */
  @autobind handleKeyDown(e) {
    const { focusedIndex } = this.state;
    const { onOptionSelect, onClose, userInput, handleUserInput, newSelect } = this.props;
    if (e.key === 'ArrowUp') {
      e.stopPropagation();
      e.preventDefault();
      this.setState({ focusedIndex: Math.max(0, focusedIndex - 1) });
    } else if (e.key === 'ArrowDown') {
      e.stopPropagation();
      e.preventDefault();
      this.setState({
        focusedIndex: Math.min(this.optionsToDisplay.length - 1, focusedIndex + 1)
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      onOptionSelect(this.optionsToDisplay[focusedIndex]);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    } else if (newSelect && /^[a-zA-Z0-9-_ ]$/.test(e.key)) {
      e.persist();
      handleUserInput(userInput + e.key);
      this.setState({focusedIndex: 0});
    } else if (newSelect && e.key === 'Backspace' && userInput.length > 0){
      handleUserInput(userInput.slice(0, userInput.length - 1));
      this.setState({focusedIndex: 0})
    }
  }

  get focusedIndex() {
    const { activeOptionIndex } = this.props;
    const { focusedIndex } = this.state;
    return activeOptionIndex === undefined ? focusedIndex : activeOptionIndex;
  }

  componentWillUnmount(){
    document.removeEventListener('mousedown', this.handleClick);
  }

@autobind handleClick(e) {
if(this.optionsContainer && !this.optionsContainer.contains(e.target) && this.props.hideAutoComplete){
  this.props.hideAutoComplete();
}
else{
  if(this.props.setFocus){
    this.props.setFocus();
  }
}
}
  render() {
    const { onOptionSelect, position, showNoResults,autocompleteDynamic,
      selectedOption, hasSearch, optionRenderer, optionClassName } = this.props;
    const { search } = this.state;
        return createPortal((
      <div className={'fw-select__options-container'} style={position} tabIndex="0"
        onKeyDown={this.handleKeyDown}
        ref={(div) => this.optionsContainer = div}>
        {hasSearch && (
          <Input value={search} onChange={this.handleSearchChange}
            ref={(comp) => { if (!!comp) this.input = comp.input }}
            className="fw-select__search-input" />
        )}
        <div className={!!autocompleteDynamic?"fw-select__optionsHideOverflow":"fw-select__options"} ref={(div) => this.list = div}>
          {!this.optionsToDisplay.length && (<div style={{ padding: '6px 12px' }}>No Results</div>)}
          {Array.isArray(this.optionsToDisplay) && this.optionsToDisplay.map((option, index) => {
            return optionRenderer({
              option,
              isOptionSelected: this.getOptionValue(option) === this.getOptionValue(selectedOption),
              isOptionFocused: index === this.focusedIndex,
              getOptionLabel: this.getOptionLabel,
              getOptionValue: this.getOptionValue,
              key: this.getOptionValue(option),
              onMouseDown: () => onOptionSelect(option),
              onMouseEnter: () => this.setFocusedOption(index),
              optionClassName,
            })
          })}
        </div>
      </div>
    ), document.getElementById('portal-container'));
  }
}
