import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class TableCell extends Component {
  static propTypes = {
    item: PropTypes.object,
    className: PropTypes.string,
    accessor: PropTypes.string,
  }

  static defaultProps = {
    column: {}
  }

  render() {
    const { column, item, className, children, config, ...props } = this.props;
    const { component, componentFn, accessor, style } = column;
    let content;
    if (!!children) {
      content = children;
    } else if (!!componentFn) {
      content = componentFn(this.props);
    } else {
      content = !!component ? cloneElement(component, this.props) : item[accessor];
    }
    return (
      <td className={classnames('fw-table__cell fw-table__cell--body', className)}
        ref={td => this.td = td}
        style={style} {...props}>
        {content}
      </td>
    );
  }
};
