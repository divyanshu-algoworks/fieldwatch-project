import React from 'react';
import { autobind } from 'core-decorators';
import { observer } from 'mobx-react';
import Tag from './Tag';
import TagsCommon from './TagsCommon';
import PropTypes from 'prop-types';

@observer
export default class TagsSelect extends TagsCommon {
  static propTypes = {
    /** Input value */
    value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.object]),
    /** Change value callback */
    onChange: PropTypes.func,
    /** Is input disabled */
    disabled: PropTypes.bool,
    /** Is input value invalid */
    invalid: PropTypes.bool,
    options: PropTypes.any,
  }

  static defaultProps = {
    value: [],
    style: {
      minHeight: '100px',
    },
  }

  @autobind handleClear() {
    const { onChange } = this.props;
    onChange([], 'clear');
  }

  @autobind handleSelectTag(tag) {
    if (!tag) {
      return;
    }
    const { value } = this.props;
    const isTagSelected = value.indexOf(tag.id) > -1;
    const action = isTagSelected ? this.handleRemoveTag : this.handleAddTag;
    action(tag);
  }

  get valueTags() {
    const { value, options, } = this.props;
    return value.map(id => {
      return options.filter(option => option.id == id)[0];
    });
  }

  @autobind handleRemoveTag(tag) {
    if (!tag) {
      return;
    }
    const { value, onChange, options } = this.props;
    const index = value.indexOf(tag.id || tag);
    const tagFromOptions = tag.id ? tag : options.filter(({ id }) => id === tag)[0];
    const res = [].concat(
      value.slice(0, index),
      value.slice(index + 1),
    );
    onChange(res, 'remove', tagFromOptions);
    return tagFromOptions && tagFromOptions.name;
  }

  get optionsToList() {
    const { options, value, disable_create_tags = false, forPolicy = false } = this.props;
    let optionsToFilter = options.filter(({ id }) => value.indexOf(id) === -1);
    let filteredOptions;
    const { inputValue } = this.state;
    const search = inputValue.toLowerCase();
    if (!!inputValue) {
      filteredOptions = optionsToFilter.filter(({ name }) => name.toLowerCase().indexOf(search) > -1);
    } else {
      filteredOptions = optionsToFilter;
    }

    const filteredNames = filteredOptions.map(({ name }) => name);
    const enteredFullName = filteredNames.indexOf(inputValue) > -1;
    if(disable_create_tags){
      return filteredOptions;
    }
    if(forPolicy) {
      return (!!inputValue && !filteredNames) ? [] : filteredOptions;
    }

    return (!!inputValue && !enteredFullName) ? [{ name: inputValue, }, ...filteredOptions] : filteredOptions;
  }

  get selectedOptionsList() {
    const { disabled } = this.props;
    return this.valueTags.map(tag =>
      <Tag key={tag.id} tag={tag} labelFn={({ name }) => name}
        onRemove={this.handleRemoveTag} disabled={disabled} />
    );
  }
}
