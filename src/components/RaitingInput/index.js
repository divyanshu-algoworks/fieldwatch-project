import React, { Component } from 'react';
import Star from './Star';
import PropTypes from 'prop-types';

export default class RaitingInput extends Component {
  static defaultProps = {
    maxValue: 5,
  }

  state = {
    hoveredIndex: 0
  }

  handleHoverStar = (hoveredIndex) => this.setState({hoveredIndex})

  render() {
    const { value, maxValue, onChange} = this.props;
    const { hoveredIndex } = this.state;
    let stars = [];
    for(let i = 1; i <= maxValue; i++) {
      stars.push(
        <Star key={i} value={i} onChange={onChange}
          checked={value >= i} hovered={hoveredIndex >= i}
          onMouseEnter={this.handleHoverStar}
          onMouseLeave={() => this.handleHoverStar(0)} />
      );
    }
    return (
      <div className="raiting-input">{stars}</div>
    );
  }
}
