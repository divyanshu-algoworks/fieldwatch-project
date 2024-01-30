import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import Button from 'Components/Button';

export default class Tag extends Component {
  handleRemoveClick = (e) => {
    const { tag, onRemove } = this.props;
    if(!!onRemove) {
      e.stopPropagation();
      onRemove(tag);
    }
  }

  handleMouseDown = (e) => {
    const { onMouseDown, tag } = this.props;
    if(!!onMouseDown) {
      onMouseDown(e, tag);
    }
  }

  handleBtnMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  handleMouseEnter = (e) => {
    const { onMouseEnter, tag } = this.props;
    if(!!onMouseEnter) {
      onMouseEnter(e, tag);
    }
  }

  render() {
    const { tag, disabled, labelFn, selected, } = this.props;

    return (
      <div className={classnames('tags-input__tag', {
        'tags-input__tag--disabled': disabled,
        'tags-input__tag--selected': selected
      })} onMouseEnter={this.handleMouseEnter} onMouseDown={this.handleMouseDown}>
        <Button status="link" className={classnames('tags-input__tag-remove', {
          'tags-input__tag-remove--selected': selected,
        })} disabled={disabled}
          onMouseDown={this.handleBtnMouseDown}
          onClick={this.handleRemoveClick}>&times;</Button>
        <div className="tags-input__tag-name">{labelFn ? labelFn(tag) : tag}</div>
      </div>
    );
  }
}
