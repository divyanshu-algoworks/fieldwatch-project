import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Tooltip from 'Components/Tooltip';

export default class KeywordLabel extends Component {
  static propTypes = {
    classNames: PropTypes.shape({
      container: PropTypes.string,
      removeBtn: PropTypes.string,
      keyword: PropTypes.string,
    }),
    keyword: PropTypes.string.isRequired,
    onDelete: PropTypes.func
  };

  static defaultProps = {
    classNames: {
      container: 'keyword-label',
      removeBtn: 'keyword-label__remove',
      keyword: 'keyword-label__keyword'
    }
  };

  handleDelete = () => this.props.onDelete(this.props.keyword);
  render() {
    let keywordContainerAttrs = {};
    const { classNames, keyword, } = this.props;

    return (
      <Tooltip className="d-ib" body={keyword}>
        <div className={classNames.container}>
          <button type="button" className={classNames.removeBtn}
            onClick={this.handleDelete}>&times;</button>
          <div className={classNames.keyword} {...keywordContainerAttrs}>
            {keyword}
          </div>
        </div>
      </Tooltip>
    );
  }
}

