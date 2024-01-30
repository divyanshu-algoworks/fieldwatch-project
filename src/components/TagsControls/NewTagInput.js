import React, { Component } from 'react';
import Input from 'Components/Input';
export default class NewTagInput extends Component {
  get width() {
    const { value } = this.props;
    if (!value) {
      return 8;
    }
    return ((value.length || 0) + 1) * 8;
  }

  render() {
    return (
      <Input {...this.props} className="tags-input__new-tag-input"
        style={{ width: this.width }} ref={(c) => { if (!!c) { this.input = c.input } }} />
    );
  }
}
