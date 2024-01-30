import React, { Component, Fragment, createRef} from 'react';
import { autobind } from 'core-decorators';
import InputWithTimeout from './InputWithTimeout';
import OptionsList from '../Select/OptionsList' //'Components/Select/OptionsList';
import Preloader from  '../Preloader' //'Components/Preloader';

export default class AutocompleteInput extends Component {
  state = {
    isAutocompleteDropdownWisible: false,
    activeElementIndex: 0,
    focus:false
  }

  @autobind handleFocus(e) {
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus(e);
    }
    this.setState({ focus:true,isAutocompleteDropdownWisible: true, activeElementIndex: 0, });
  }

  @autobind handleBlur(e) {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(e);
    }
   this.setState({ focus: false });
  }

 hideAutoComplete=()=>{
  this.setState({ isAutocompleteDropdownWisible: false,focus:false });
 }

 setFocus =()=>{
   this.setState({focus:true})
 }
  @autobind handleFocusedOptionIndexChange(activeElementIndex) {
    this.setState({ activeElementIndex });
  }

  /**
 * We get pressed key, and if it is arrow, we change focused option; if it is
 * enter, then we select focused option; on escape we just close options list
 * @param {object} param0 event handler
 */
  @autobind handleKeyDown(e) {
    const { activeElementIndex, isAutocompleteDropdownWisible, } = this.state;
    const { onAutocompleteSelect, autocompleteOptions, } = this.props;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.setState({
        activeElementIndex: Math.max(0, activeElementIndex - 1)
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      autocompleteOptions && this.setState({
        activeElementIndex: Math.min(autocompleteOptions.length - 1, activeElementIndex + 1)
      });
    } else if (e.key === 'Enter') {
      if (!isAutocompleteDropdownWisible || !autocompleteOptions || !autocompleteOptions.length) {
        return false;
      }
      onAutocompleteSelect(autocompleteOptions[activeElementIndex]);
      this.setState({ isAutocompleteDropdownWisible: false });
    } else if (e.key === 'Escape') {
      this.setState({ isAutocompleteDropdownWisible: false });
    }
    else if (e.key === 'Tab') {
      this.setState({ focus: false });
    }
    if (!!this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  componentWillReceiveProps({ options }) {
    if (!options || options.length !== this.props.options.length) {
      this.setState({ activeElementIndex: 0 });
    }
  }

  get autocompletePosition() {
    if (!!this.input) {
      const rect = this.input.getBoundingClientRect();

      return {
        top: rect.top + rect.height + window.scrollY,
        left: rect.left,
        minWidth: rect.width
      }
    }
    return null;
  }

  render() {
    const {
      autocompleteOptions,
      optionRenderer,
      onAutocompleteSelect,
      onAutocompleteLoadingStart,
      onAutocomleteLoadingEnd,
      pending,
      ...inputProps
    } = this.props;
    const { isAutocompleteDropdownWisible, activeElementIndex,focus } = this.state;
    const isListVisible = autocompleteOptions && isAutocompleteDropdownWisible;
    return (
      <Fragment>
        <div className="p-r">
          <InputWithTimeout {...inputProps} ref={comp => {
            if (!!comp) this.input = comp.input
          }} type="text" key="input" autoComplete="new-some"
            onFocus={this.handleFocus} onBlur={this.handleBlur}
            onTimeoutStart={onAutocompleteLoadingStart}
            onTimeoutEnd={onAutocomleteLoadingEnd}
            onKeyDown={isAutocompleteDropdownWisible ? this.handleKeyDown : null} />
          {!!pending && (
            <Preloader small style={{ position: 'absolute', top: '5px', right: '5px' }} />
          )}
        </div>
        {!!isListVisible && focus &&(
          <OptionsList 
            hideAutoComplete={this.hideAutoComplete}
            setFocus={this.setFocus}
            autocompleteDynamic={true}
            position={this.autocompletePosition} showNoResults={true}
            disableFocus ref={(list) => this.optionsOptionsList = list}
            activeOptionIndex={activeElementIndex}
            onFocusedOptionIndexChange={this.handleFocusedOptionIndexChange}
            options={autocompleteOptions} optionRenderer={optionRenderer}
            onOptionSelect={onAutocompleteSelect} />)}
      </Fragment>
    );
  }
}
