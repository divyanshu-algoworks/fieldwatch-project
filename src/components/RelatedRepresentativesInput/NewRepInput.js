import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import InputWithTimeout from 'Components/Input/InputWithTimeout';

export default class NewRepInput extends Component {
  state = {
    width: 8
  }

  @autobind handleKeyUp(e) {
    const { onKeyDown } = this.props;
    const { value } = e.target;

    this.setState({ width: (value.length + 1) * 8 });
    if (onKeyDown) {
      onKeyDown(e);
    }
  }

  render() {
    const { width } = this.state;

    return (
      <InputWithTimeout {...this.props} className={
        classnames('tags-input__new-tag-input', {
          'tags-input__new-tag-input--disabled': this.props.disabled,
        })
      }
        onKeyUp={this.handleKeyUp}
        style={{ width: width }} ref={(c) => { if (!!c) { this.input = c.input } }} />
    );
  }
}
