import React, { Component } from 'react';
import classnames from 'classnames';
import Button from '../../../components/Button';

export default class FilterLabel extends Component {
  get filterChanged() {
    return false;
  }

  render() {
    const { label, onClick } = this.props;
    return (
      <div className="filter-label">
        <span className="filter-label__text">{label}:&nbsp;</span>
        <Button status="link"
          className={classnames('filter-label__value', 'ellipsis', { 'filter-label__value--changed': this.filterChanged })}
          onClick={onClick}>{this.valueText}</Button>
      </div>
    );
  }
}
