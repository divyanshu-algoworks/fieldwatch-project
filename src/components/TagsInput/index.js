import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import OptionsList from 'Components/Select/OptionsList';
import Tag from './Tag';
import NewTagInput from './NewTagInput';

@observer
export default class TagsInput extends Component {
  state = {
    inputValue: '',
    isOptionsListVisible: false,
    activeItemIndex: 0
  };

  @autobind handleContainerClick() {
    this.input.focus();
  }

  @autobind handleInputKeydown(e) {
    const { value, onRemoveTag, options } = this.props;
    const { inputValue, activeItemIndex } = this.state;

    if (!!value.length && !inputValue.length && e.key === 'Backspace') {
      e.preventDefault();
      const id = value[value.length - 1];
      const inputValue = options.find(option => option.id === id).name;
      this.setState({ inputValue });
      onRemoveTag({ id: value[value.length - 1] });
    } else if (e.key === 'ArrowUp') {
      this.setActiveOptionIndex(Math.max(activeItemIndex - 1, 0));
    } else if (e.key === 'ArrowDown') {
      this.setActiveOptionIndex(Math.min(activeItemIndex + 1, this.optionsToList.length - 1));
    } else if (e.key === 'Enter') {
      this.handleAddTag(this.optionsToList[activeItemIndex]);
      this.setState({
        inputValue: '',
        activeItemIndex: 0
      });
    }
  }

  @autobind handleAddTag(tag) {
    const { onAddTag } = this.props;
    const isTagSelected = this.selectedOptions.some(({ id }) => id === tag.id);
    if (!isTagSelected) {
      onAddTag(tag);
    }
  }

  @autobind handleInputFocus(e) {
    this.setState({
      isOptionsListVisible: true,
      activeItemIndex: 0
    });
  }

  @autobind handleInputBlur(e) {
    window.setTimeout(() => {
      this.setState({
        inputValue: '',
        isOptionsListVisible: false,
        activeItemIndex: 0
      });
    }, 0);
  }

  @autobind handleInputChange({ target }) {
    this.setState({ inputValue: target.value });
  }

  @autobind setActiveOptionIndex(activeItemIndex) {
    this.setState({ activeItemIndex });
  }

  get selectedOptions() {
    const { value, options } = this.props;
    return value.map(id => options.find(option => option.id === id));
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

  get optionsToList() {
    const { options } = this.props;
    const { inputValue } = this.state;
    const search = inputValue.toLowerCase();
    const existOptions = options.filter(({ name }) => name.toLowerCase().indexOf(search) > -1);
    if (existOptions.length === 1 && existOptions[0].name === inputValue) {
      return existOptions;
    }
    return !!inputValue ? [{ name: inputValue }, ...existOptions] : existOptions;
  }

  render() {
    const { onRemoveTag, disabled } = this.props;
    const { inputValue, isOptionsListVisible, activeItemIndex } = this.state;

    return [
      (<div className={classnames('tags-input', { 'tags-input--disabled': disabled })}
        key="tags-input" onClick={this.handleContainerClick}
        ref={div => this.container = div}>
        {this.selectedOptions.map(tag =>
          <Tag key={tag.id || tag.name} tag={tag} onRemove={onRemoveTag} disabled={disabled} />
        )}
        <NewTagInput value={inputValue} onFocus={this.handleInputFocus}
          onKeyDown={this.handleInputKeydown} disabled={disabled}
          onBlur={this.handleInputBlur} onChange={this.handleInputChange}
          ref={(c) => { if (!!c) { this.input = c.input } }} />
      </div>),
      !!isOptionsListVisible && (
        <OptionsList position={this.containerPosition}
          disableFocus
          ref={(list) => this.optionsOptionsList = list}
          key="autocomplete-dropdown" activeOptionIndex={activeItemIndex}
          onFocusedOptionIndexChange={this.setActiveOptionIndex}
          options={this.optionsToList}
          onOptionSelect={this.handleAddTag} />
      )
    ];
  }
}
