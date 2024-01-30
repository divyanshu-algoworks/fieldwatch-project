import React, { Component } from 'react';

import Hit from './Hit';

export default class HitsList extends Component {

  render() {
    return (
      <ul className="results__hits">
        {!!this.props.items && this.props.items.map(item => (
          <li key={item.id} className="results__hit">
            <Hit
              item={item}
              userRole={this.props.userRole}
              onCheck={this.props.onCheckRow}
              onTranscriptTextShow={this.props.onTranscriptTextShow}
              onImgClick={this.props.onImgClick}
              onPageTextShow={this.props.onPageTextShow}
              dragPreviewImage={this.props.dragPreviewImage}
              checked={this.props.checkedItems.some(({ id }) => item.id === id)}
            />
          </li>
        ))}
      </ul>
    )
  }
}
