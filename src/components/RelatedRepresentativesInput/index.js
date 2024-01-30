import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import OptionsList from 'Components/Select/OptionsList';
import API from 'Helpers/api';
import NewRepInput from './NewRepInput';
import SelectedRepresentative from './SelectedRepresentative';

const optionRenderer = ({
  option, isOptionSelected, isOptionFocused, getOptionLabel, getOptionValue,
  ...otherArgs
}) => {

  return (
    <div {...otherArgs} key={option.id} className={classnames('fw-select__option', {
      'fw-select__option--selected': isOptionSelected,
      'focused fw-select__option--focused': isOptionFocused,
    })}>
      {option.first_name} {option.last_name} {option.email} {option.rep_id}
    </div>
  );
}

@observer
export default class RelatedRepresentativesInput extends Component {
  state = {
    inputValue: '',
    relatedRepresentatives: [],
    autocompleteOptions: [],
    activeItemIndex: 0
  };

  @autobind handleContainerClick() {
    this.input.focus();
  }

  @autobind handleInputKeydown(e) {
    const { value, onRemoveTag, options } = this.props;
    const { inputValue, activeItemIndex, autocompleteOptions } = this.state;

    if (e.key === 'ArrowUp') {
      this.setActiveOptionIndex(Math.max(activeItemIndex - 1, 0));
    } else if (e.key === 'ArrowDown') {
      this.setActiveOptionIndex(Math.min(activeItemIndex + 1, autocompleteOptions.length - 1));
    } else if (e.key === 'Enter') {
      if (!!autocompleteOptions && !!autocompleteOptions.length) {
        this.handleAddRep(autocompleteOptions[activeItemIndex]);
      }
      this.setState({
        inputValue: '',
        activeItemIndex: 0
      });
    } else if (this.autocompleteRequest) {
      this.autocompleteRequest.abort();
      this.autocompleteRequest = null;
    }
  }

  @autobind handleAddRep(rep) {
    const { onAddRepresentative, selectedRepresentatives } = this.props;
    const isRepSelected = selectedRepresentatives.some(({ id }) => id === rep.id);
    if (!isRepSelected) {
      onAddRepresentative(rep);
    }
    this.setState({ autocompleteOptions: [], inputValue: '' });
  }

  @autobind handleInputFocus() {
    this.setState({
      activeItemIndex: 0
    });
  }

  @autobind handleInputBlur() {
    window.setTimeout(() => {
      this.setState({
        inputValue: '',
        activeItemIndex: 0
      });
    }, 0);
  }

  @autobind handleInputChange({ target }) {
    const { autocompleteUrl } = this.props;

    this.setState({ inputValue: target.value });
    this.AutocompleteRequest = API.post(autocompleteUrl, {
      body: {
        representative: {
          values: target.value
        },
      },
    }).then((autocompleteOptions) => {
      this.setState({ autocompleteOptions });
    });
  }

  @autobind setActiveOptionIndex(activeItemIndex) {
    this.setState({ activeItemIndex });
  }

  get isOptionsListVisible() {
    return document.activeElement === this.input;
  }

  get containerPosition() {
    if (!this.container) {
      return;
    }

    const rect = this.container.getBoundingClientRect();
    const { left, width, height } = rect;
    const top = document.body.scrollTop + rect.top + height;
    return { left, top: top + window.scrollY, width };
  }

  render() {
    const { disabled, selectedRepresentatives, onRemoveRepresentative } = this.props;
    const { inputValue, activeItemIndex, autocompleteOptions } = this.state;
    return [
      (<div className={classnames('tags-input', { 'tags-input--disabled': disabled })}
        key="tags-input" onClick={this.handleContainerClick}
        ref={div => this.container = div}>
        {selectedRepresentatives.map(rep =>
          <SelectedRepresentative key={rep.id} rep={rep}
            onRemove={onRemoveRepresentative} disabled={disabled} />
        )}
        <NewRepInput value={inputValue} onFocus={this.handleInputFocus}
          onKeyDown={this.handleInputKeydown} disabled={disabled}
          onBlur={this.handleInputBlur} onChange={this.handleInputChange}
          ref={(c) => { if (!!c) { this.input = c.input } }} />
        {}
      </div>),
      !!this.isOptionsListVisible && (
        <OptionsList position={this.containerPosition}
          disableFocus
          ref={(list) => this.optionsOptionsList = list}
          key="autocomplete-dropdown" activeOptionIndex={activeItemIndex}
          onFocusedOptionIndexChange={this.setActiveOptionIndex}
          options={autocompleteOptions}
          optionRenderer={optionRenderer}
          onOptionSelect={this.handleAddRep} />
      )
    ];
  }
}
