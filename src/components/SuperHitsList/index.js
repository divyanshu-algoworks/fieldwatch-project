import React, { Component } from 'react';

import SuperHit from './SuperHit';

export default class SuperHitsList extends Component {
  render() {
    return (
      <ul className="results__hits">
        {!!this.props.items && this.props.items.map((item) => (
          <li key={item.id} className="results__hit">
            <SuperHit item={item} />
          </li>
        ))}
      </ul>
    )
  }
}