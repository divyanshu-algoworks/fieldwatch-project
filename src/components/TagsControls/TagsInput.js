import React from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'Helpers/array';
import TagsCommon from './TagsCommon';
import Tag from './Tag';

export default class TagsInput extends TagsCommon {
  static propTypes = {
    /** Input value */
    value: PropTypes.string,
    /** special symbol, which will separate tags in value string */
    separator: PropTypes.string,
    /** Change value callback */
    onChange: PropTypes.func,
    /** Is input disabled */
    disabled: PropTypes.bool,
    /** Is input value invalid */
    invalid: PropTypes.bool,
    /** Limit on the number of entered words */
    limit: PropTypes.number
  }

  static defaultProps = {
    value: '',
    separator: ',',
    style: {
      minHeight: '100px',
    },
  }

  enableDropDown = false

  handleClear = () => {
    const { onChange } = this.props;
    onChange('', 'clear');
  }

  handleSelectTag = (tag) => {
    if (!tag) {
      return;
    }
    this.handleAddTag(tag);
  }

  handleAddTag = (tagsStr) => {
    const { onChange, separator, limit } = this.props;
    let uniqTags = uniq([...this.valuesArray, ...tagsStr.split(separator)]);

    if (limit && limit > 0) {
      uniqTags.splice(limit, uniqTags.length);
    }

    const res = uniqTags.join(separator);
    onChange(res, 'add', tagsStr);
    return res;
  }

  handleDBClick = () => {
    this.handleCopyText(this.props.value);
  }

  handleCopyGroup = () => {
    const { separator } = this.props;
    const [start, end] = this.selectionIndexes;
    if (start === undefined && end === undefined) {
      return;
    }
    const values = this.valuesArray.slice(start, end + 1).join(separator);
    this.handleCopyText(values);
  }

  handleCopyText = (str) => {
    const isCopyingSuccess = FW.copyToClipboard(str);
    if (isCopyingSuccess === true) {
      FW.flash({ type: 'info', text: 'Keywords copied to clipboard' });
    } else {
      FW.flash({ type: 'error', text: 'Copying to clipboard failed' });
    }
  }

  handleRemoveTag = (tag) => {
    const { onChange, separator } = this.props;
    const { firstSelectedTag, lastSelectedTag } = this.state;
    let startIndex, endIndex;
    if (firstSelectedTag !== null && lastSelectedTag !== null) {
      [startIndex, endIndex] = this.selectionIndexes;
    } else {
      startIndex = this.valuesArray.indexOf(tag);
      endIndex = this.valuesArray.indexOf(tag);
    }

    const res = [].concat(
      this.valuesArray.slice(0, startIndex),
      this.valuesArray.slice(endIndex + 1),
    )
      .map(item => item.trim())
      .join(separator);
    this.handleClearSelection();
    onChange(res, 'remove', tag);
    return tag;
  }

  isTagSelected = (tag) => {
    const [min, max] = this.selectionIndexes;
    const tagIndex = this.valuesArray.indexOf(tag);
    return tagIndex >= min && tagIndex <= max;
  }

  get valueTags() {
    const { value, separator } = this.props;
    return uniq(value.split(separator));
  }

  get valuesArray() {
    const { value } = this.props;
    if (!value) {
      return [];
    }

    return this.valueTags
      .map(item => item.trim());
  }

  get optionsToList() {
    const { inputValue } = this.state;
    if (!!inputValue) {
      const filteredOptions = this.valuesArray.filter(item => item.indexOf(inputValue) > -1);
      return filteredOptions.indexOf(inputValue) > -1 ? filteredOptions : [inputValue, ...filteredOptions];
    }
    return this.valuesArray;
  }

  get selectedOptionsList() {
    const { disabled } = this.props;
    const { firstSelectedTag } = this.state;

    return this.valuesArray.map(tag =>
      <Tag
        key={tag}
        tag={tag}
        onMouseDown={this.handleStartSelection}
        selected={this.isTagSelected(tag)}
        onMouseEnter={!!firstSelectedTag && this.handleAddToSelection}
        onRemove={this.handleRemoveTag}
        disabled={disabled}
      />
    );
  }

  get selectionIndexes() {
    const { firstSelectedTag, lastSelectedTag } = this.state;
    if (!firstSelectedTag && !lastSelectedTag) {
      return [undefined, undefined];
    }
    const firstIndex = this.valuesArray.indexOf(firstSelectedTag);
    const lastIndex = this.valuesArray.indexOf(lastSelectedTag);
    return [
      Math.min(firstIndex, lastIndex),
      Math.max(firstIndex, lastIndex),
    ];
  }
}
