import React, { Component } from 'react';
import classnames from 'classnames';
import Button from 'Components/Button';
import NewTagInput from './NewTagInput';
import OptionsList from 'Components/Select/OptionsList';

const DELETE_GROUP_KEYS = ['Delete', 'Backspace'];
export default class TagsCommon extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
  }

  enableDropDown = true;

  state = {
    inputValue: '',
    isOptionsListVisible: false,
    isSelectStart: false,
    firstSelectedTag: null,
    lastSelectedTag: null,
    activeItemIndex: 0
  };


  handleContainerClick = () => {
    this.input.focus();
  }

  handleInputKeydown = (e) => {
    const { value, } = this.props;
    const { inputValue, activeItemIndex, firstSelectedTag, lastSelectedTag} = this.state;

    if (!!value && !!value.length && !inputValue.length && e.key === 'Backspace' && (!firstSelectedTag || !lastSelectedTag)) {
      e.preventDefault();
      const lastTag = this.valuesArray[this.valuesArray.length - 1];
      const inputValue = this.handleRemoveTag(lastTag);
      this.setState({ inputValue });
    } else if (e.key === 'ArrowUp') {
      this.setActiveOptionIndex(Math.max(activeItemIndex - 1, 0));
    } else if (e.key === 'ArrowDown') {
      this.setActiveOptionIndex(Math.min(activeItemIndex + 1, this.optionsToList.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if(this.enableDropDown) {
        this.handleSelectTag(this.optionsToList[activeItemIndex]);
      } else {
        this.handleSelectTag(inputValue);
      }
      this.setState({
        inputValue: '',
        activeItemIndex: 0
      });
    }
  }

  handleInputFocus = (e) => {
    this.setState({
      isOptionsListVisible: true,
      activeItemIndex: 0
    });
  }

  handleInputBlur = (e) => {
    window.setTimeout(() => {
      this.setState({
        inputValue: '',
        isOptionsListVisible: false,
        activeItemIndex: 0
      });
    }, 0);
  }

  handleInputChange({ target }) {
    this.setState({ inputValue: target.value });
  }

  setActiveOptionIndex = (activeItemIndex) => {
    this.setState({ activeItemIndex });
  }

  handleStartSelection = (e, firstSelectedTag) => {
    this.setState({ firstSelectedTag, lastSelectedTag: firstSelectedTag, isSelectStart: true, });
    document.addEventListener('mouseup', this.handleEndSelection);
  }

  handleAddToSelection = (e, lastSelectedTag) => {
    if(!!this.state.isSelectStart) {
      this.setState({ lastSelectedTag, });
    }
  }

  handleEndSelection = () => {
    this.setState({ isSelectStart: false, });
    document.removeEventListener('mouseup', this.handleEndSelection);
    document.addEventListener('mousedown', this.handleClearSelection);
    document.addEventListener('keydown', this.handleRemoveSelectionByKeyboard);
  }

  handleRemoveSelectionByKeyboard = (e) => {
    if(DELETE_GROUP_KEYS.indexOf(e.key) > -1) {
      this.handleRemoveTag();
      this.handleClearSelection();
    } else if (!!this.handleCopyGroup && (e.key === 'c') && (e.ctrlKey || e.metaKey)) {
      this.handleCopyGroup();
    }
  }

  handleClearSelection = (e) => {
    if(!!e && !!e.target && (
      e.target.classList.contains('tags-input__tag-remove--selected') ||
      e.target.classList.contains('tags-input__tag') ||
      e.target.classList.contains('tags-input__tag-name'))) {
      return;
    }
    this.setState({firstSelectedTag: null, lastSelectedTag: null, isSelectStart: false,});
    document.removeEventListener('mousedown', this.handleClearSelection);
    document.removeEventListener('keydown', this.handleClearSelection);
    document.removeEventListener('keydown', this.handleRemoveSelectionByKeyboard);
  }

  handleAddTag(tag) {
    const { value, onChange } = this.props;
    if(!!tag.id) {
      onChange([...value, tag.id], 'add', tag);
    } else {
      onChange(value, 'create', tag);
    }
    return tag.name;
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

  get valuesArray() {
    return this.props.value;
  }

  render() {
    const { disabled, invalid, style, clearable, value } = this.props;
    const { inputValue, isOptionsListVisible, activeItemIndex, } = this.state;

    return [
      (<div className={classnames('tags-input', { 'tags-input--disabled': disabled, 'tags-input--invalid': !!invalid, 'tags-input--clearable': !!clearable,})}
        key="tags-input" onClick={this.handleContainerClick} style={style}
        ref={div => this.container = div} onDoubleClick={this.handleDBClick}>
        <div className="tags-input__right-controls">
          {!!clearable && !!value && !!value.length && (
            <Button status="link" onClick={this.handleClear} disabled={disabled}>
              &times;
            </Button>
          )}
        </div>
        {this.selectedOptionsList}
        <NewTagInput value={inputValue} onFocus={this.handleInputFocus}
          onKeyDown={this.handleInputKeydown} disabled={disabled}
          onBlur={this.handleInputBlur} onChange={this.handleInputChange}
          ref={(c) => { if (!!c) { this.input = c.input } }} />
      </div>),
      !!this.enableDropDown && !!isOptionsListVisible && (
        <OptionsList position={this.containerPosition}
          disableFocus
          ref={(list) => this.optionsOptionsList = list}
          key="autocomplete-dropdown" activeOptionIndex={activeItemIndex}
          onFocusedOptionIndexChange={this.setActiveOptionIndex}
          options={this.optionsToList}
          optionRenderer={this.optionRenderer}
          onOptionSelect={this.handleSelectTag} />
      )
    ];
  }
}
