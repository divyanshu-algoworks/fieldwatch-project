import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from 'Components/Button';
export default class Collapse extends Component {
  static propTypes = {
    collapsed: PropTypes.bool,
    collapsedHeight: PropTypes.number,
    onExpand: PropTypes.func,
    // collapseText: PropTypes.string,
    // expandText: PropTypes.string,
    triggerAllign: PropTypes.oneOf(['left', 'right']),
  }

  static defaultProps = {
    collapsed: true,
    triggerAllign: 'left',
    collapsedHeight: 0,
    labelAlign: 'left',
  }

  state = {
    collapsed: true
  }

  constructor(props) {
    super(props);

  }

  handleToggleCollapse = () => {
    const { onExpand, collapsed } = this.props;
    this.container.style.height = `${this.container.getBoundingClientRect().height}px`;
    if (!!onExpand) {
      onExpand(!collapsed);
    } else {
      this.setState({ collapsed: !this.state.collapsed });
    }
  }

  getContainerHeight = () => {
    if (!this.childrenContainer) {
      return 0;
    }
    const { collapsedHeight, onExpand } = this.props;
    const collapsed = onExpand ? this.props.collapsed : this.state.collapsed;
    const contentHeight = this.childrenContainer.getBoundingClientRect().height;
    return collapsed ? collapsedHeight : contentHeight;

  }

  removeHeight = () => {
    if (!this.isCollapsed) {
      this.container.style.height = '';
    }
  }

  componentDidUpdate() {
    setTimeout(this.removeHeight, 300);
  }

  get isCollapsed() {
    const { onExpand } = this.props;
    return onExpand ? this.props.collapsed : this.state.collapsed;
  }

  render() {
    const { children, collapseText, expandText, triggerAllign, client_type } = this.props;
    return (
      <div className="fw-collapse">
        <div className={classnames({ 'ta-r': triggerAllign === 'right', 'ta-l': triggerAllign === 'left' })}>
          <Button disabled ={['fc'].includes(client_type)} onClick={this.handleToggleCollapse} status="link">{this.isCollapsed ? expandText : collapseText}</Button>
        </div>
        <div ref={div => this.container = div} className={
          classnames('fw-collapse__container', { 'fw-collapse__container--collapsed': this.isCollapsed, 'fw-collapse__container--expanded': !this.isCollapsed })
        } style={{ height: this.getContainerHeight() }}>
          <div className="fw-collapse__children-container" ref={div => this.childrenContainer = div}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
