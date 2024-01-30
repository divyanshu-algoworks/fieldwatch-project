import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'Components/Input';
import KeywordLabel from './KeywordLabel';

export default class KeywordsInput extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    canAddKeyword: PropTypes.bool,
    placeholder: PropTypes.string,
    invalid: PropTypes.bool,
  };

  static defaultProps = {
    value: '',
    canAddKeywords: true,
    placeholder: 'Enter value here'
  };
  constructor(props) {
    super(props);
    this.state = {
      inputVal: '',
      isPreviewMode: true
    };
    this.input = createRef();
    this.textarea = createRef();
  }

  handleAddKeywords = (keywords = '') => {
    const value = this.props.value || '';
    const resultArray = keywords.reduce((res, keywordStr) => {
      const keyword = keywordStr.replace(/^\s+|\n*|\s+$/g, '');

      if (keyword === '' || res.indexOf(keywordStr) > -1) {
        return res;
      }
      return [...res, keyword];
    }, value.length ? value.split(', ') : []);
    this.props.onChange(resultArray.join(', '));
  }

  handleInputChange = ({ target }) => {
    if (target.value[target.value.length - 1] === ',') {
      this.handleAddKeywords([target.value.slice(0, target.value.length - 1)]);
      this.setState({ inputVal: '' });
    } else {
      this.setState({ inputVal: target.value });
    }
  }

  handleInputPaste = (e) => {
    e.preventDefault();
    const htmlItem = e.clipboardData.getData('text/html');
    const textItem = e.clipboardData.getData('text/plain');
    if (!!htmlItem) {
      const tag = document.createElement('div');
      tag.innerHTML = htmlItem;
      const table = [].filter.call(tag.children, ({ nodeName }) => nodeName === 'TABLE')[0];
      if (!!table) {
        // If we have try to paste table to input, we wel insert data from
        // it cells and split it by coma
        const keywords = [].map.call(
          table.querySelectorAll('td'),
          ({ innerText }) => innerText
        );
        this.handleAddKeywords(keywords);

      } else {
        this.handleAddKeywords([tag.innerText]);
      }
    } else {
      // If there was string pasted, we check, is there lot of keywords;
      // If it is, we will add it as keywords, else we will add it to input
      const keywords = textItem.split(', ');
      if (keywords.length > 1) {
        this.handleAddKeywords(keywords);
      } else {
        this.setState({ inputVal: textItem });
      }
    }
  }

  switchPreviewMode = (value) => {
    if (value === undefined) {
      this.setState({ isPreviewMode: !this.state.isPreviewMode });
    } else {
      this.setState({ isPreviewMode: value });
    }
  }

  handleInputFocus = () => {
    if (this.input.current) {
      this.input.current.input.focus();
    }
  }

  handleCopyToClipboard = () => {
    const { value } = this.props;
    const isCopyingSuccess = FW.copyToClipboard(value);
    if (isCopyingSuccess === true) {
      FW.flash({ type: 'info', text: 'Keywords copied to clipboard' });
    } else {
      this.switchPreviewMode(false);
    }
  }

  handleKeyPress = (e) => {
    if (e.key !== 'Enter') {
      return;
    }
    e.preventDefault();
    const { inputVal } = this.state;
    if (!!inputVal.length) {
      this.handleAddKeywords([inputVal]);
      this.setState({ inputVal: '' });
    }
  }

  handleRemoveKeyword = (keyword) => {
    const { value, onChange } = this.props;
    const newVal = value
      .replace(keyword, '')
      .replace(/^\s|\s$/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^,|,$/g, '')
      .replace(/,,|,\s,/g, ',');
    onChange(newVal);
  }

  componentDidUpdate() {
    if (this.textarea.current) {
      this.textarea.current.focus();
      this.textarea.current.select();
    }
  }

  get keywords() {
    const { value } = this.props;
    return value.replace(/^\s+/, '').split(', ')
      .filter((keyword) => keyword !== '');
  }

  render() {
    const { value, placeholder, invalid } = this.props;
    const { inputVal, isPreviewMode } = this.state;

    return (
      <div className="keywords-input">
        <Input className="keywords-input__input"
          invalid={invalid}
          onChange={this.handleInputChange}
          onKeyPress={this.handleKeyPress}
          onPaste={this.handleInputPaste}
          placeholder={placeholder}
          ref={this.input}
          value={inputVal}
        />
        {!!isPreviewMode && !!value && !!value.length && (
          <div className="keywords-input__keywords"
            onClick={this.handleInputFocus}
            onDoubleClick={this.handleCopyToClipboard}>
            {this.keywords.map(keyword => (
              <KeywordLabel keyword={keyword}
                onDelete={this.handleRemoveKeyword} key={keyword} />
            ))}
          </div>
        )}
        {!isPreviewMode && (
          <textarea className="form-control" value={value}
            onChange={() => { }}
            onBlur={() => this.switchPreviewMode(true)}
            ref={this.textarea} />
        )}
      </div>
    );
  }
}

