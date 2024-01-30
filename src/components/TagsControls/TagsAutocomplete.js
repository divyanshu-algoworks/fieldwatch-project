import React from 'react';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import API from 'Helpers/api';
import TagsCommon from './TagsCommon';
import Tag from './Tag';

export default class TagsAutocomplete extends TagsCommon {
  static propTypes = {
    /** Input value */
    value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.object]),
    /** url for autocomplete options */
    autocompleteUrl: PropTypes.string,
    /** Change value callback */
    onChange: PropTypes.func,
    /** Is input disabled */
    disabled: PropTypes.bool,
    /** Is input value invalid */
    invalid: PropTypes.bool,
    requestTimeout: PropTypes.number,
  }

  static defaultProps = {
    value: [],
    autocompleteUrl: '',
    style: {
      minHeight: '100px',
    },
    requestTimeout: 500,
  }

  state = {
    inputValue: '',
    isOptionsListVisible: false,
    activeItemIndex: 0,
    autocompleteOptions: [],
  };

  optionRenderer = ({
    option, isOptionSelected, isOptionFocused, getOptionLabel, getOptionValue, optionClassName,
    ...otherArgs
  }) => {

    return (
      <div {...otherArgs} key={option.id} className={classnames('fw-select__option', {
        optionClassName,
        'fw-select__option--selected': isOptionSelected,
        'focused fw-select__option--focused': isOptionFocused,
      })}>
        {option.first_name} {option.last_name} {option.email} {option.rep_id}
      </div>
    );
  }

  @autobind handleClear() {
    const { onChange } = this.props;
    onChange([], 'clear');
  }

  @autobind handleInputChange(e) {
    const { autocompleteUrl, requestTimeout, } = this.props;

    this.setState({ inputValue: e.target.value });
    if (!!this.autocompleteRequest) {
      this.autocompleteRequest.abort();
    }

    if (!!this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    e.persist();

    this.typingTimeout = setTimeout(() => {
      if (!e.target.value) {
        return;
      }
      this.autocompleteRequest = API.post(autocompleteUrl, {
        body: {
          representative: {
            values: e.target.value
          },
        },
      });
      this.autocompleteRequest.then((autocompleteOptions) => {
        this.autocompleteRequest = null;
        this.setState({ autocompleteOptions });
      });
    }, requestTimeout);
  }

  @autobind handleSelectTag(tag) {
    if (!tag || tag.id === undefined) {
      return
    }
    const { value } = this.props;
    const isTagSelected = value.indexOf(tag.id) > -1;
    if (isTagSelected) {
      return;
    }
    this.handleAddTag(tag);
  }

  @autobind handleAddTag(tag) {
    const { value, onChange } = this.props;
    const index = value.findIndex(({ id }) => id === tag.id);
    if (!!tag.id && index === -1) {
      onChange([...value, tag], 'add', tag);
    }
    return '';
  }

  @autobind handleRemoveTag({ id }) {
    const { value, onChange } = this.props;
    const index = value.findIndex(item => item.id === id);
    const res = [].concat(
      value.slice(0, index),
      value.slice(index + 1)
    );
    onChange(res);
    return '';
  }

  get optionsToList() {
    return this.state.autocompleteOptions;
  }

  get selectedOptionsList() {
    const { disabled, value, } = this.props;
    return value.map(tag =>
      <Tag key={tag.id} tag={tag}
        labelFn={({ first_name, last_name, rep_id }) => `${first_name} ${last_name} (${rep_id})`}
        onRemove={this.handleRemoveTag} disabled={disabled} />
    );
  }
}
