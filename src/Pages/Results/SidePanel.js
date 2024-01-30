import React, { Component, createRef } from 'react';
import Button from '../../components/Button';
import classnames from 'classnames';
import Tooltip from '../../components/Tooltip';
const actionLetters = 'asdfghjklqertyuiopzxcvbnm';

export default class SidePanel extends Component {
  constructor(props) {
    super(props);
    this.container = createRef();
    this.panel = createRef();
  }
  componentDidMount() {
    const { width, height } = this.container.current.getBoundingClientRect();
    document.addEventListener('scroll', this.handleScrollChange.bind(this));
    document.addEventListener('keydown', this.handleKeyPress);
    this.panel.current.style.width = `${width}px`;
    this.container.current.style.minHeight = `${height}px`;
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScrollChange);
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = (e) => {
    const { selectedCount, hitStates } = this.props;

    const isInputActive = document.activeElement.tagName.toLowerCase() === 'input';
    const actionKeyIndex = actionLetters.indexOf(e.key);
    if (!selectedCount || isInputActive || (actionKeyIndex === -1 && e.key !== 'w')) {
      return;
    }
    if (actionKeyIndex > -1 && !!hitStates[actionKeyIndex]) {
      this.props.onChangeState(hitStates[actionKeyIndex].id);
    } else if (e.key === 'w' && selectedCount > 0) {
      this.props.onMoveToCompliance();
    }
  }

  handleScrollChange = () => {
    if (!this.container.current || !this.panel.current) {
      return;
    }
    const containerRect = this.container.current.getBoundingClientRect();
    const panelRect = this.panel.current.getBoundingClientRect();
    const isPanelTop = containerRect.top >= 15;
    const isPanelBottom = containerRect.bottom <= panelRect.height + 15;
    if (isPanelTop) {
      this.panel.current.classList.remove('results-side-actions__panel--fixed');
      this.panel.current.classList.remove('results-side-actions__panel--bottom');
    } else if (isPanelBottom) {
      this.panel.current.classList.remove('results-side-actions__panel--fixed');
      this.panel.current.classList.add('results-side-actions__panel--bottom');
    } else {
      this.panel.current.classList.add('results-side-actions__panel--fixed');
      this.panel.current.classList.remove('results-side-actions__panel--bottom');
    }
  }

  render() {
    const { selectedCount, hitStates, onClearSelection, onChangeState } = this.props;
    return (
      <div className="results-side-actions" ref={this.container}>
        <div className="results-side-actions__panel" ref={this.panel}>
          <div className="results-side-actions__panel-header">
            Selected ({selectedCount})
          </div>
          <ul className="results-side-actions__actions-list">
            {hitStates.map((hitState, index) => (
              <li className="results-side-actions__actions-list-item" key={hitState.id}>
                <Button status="link" onClick={() => onChangeState(hitState.id)}
                  className={classnames(
                    'results-side-actions__actions-list-item-button',
                    { 'results-side-actions__actions-list-item-button--disabled': !selectedCount }
                  )}
                  disabled={!selectedCount}>
                  <div className="results-side-actions__action-letter">
                    {actionLetters[index]}
                  </div>
                  <div className="ellipsis">
                    {/* <Tooltip body={hitState.name}> */}
                      {hitState.name}
                    {/* </Tooltip> */}
                  </div>
                </Button>
              </li>
            ))}
            <li className="results-side-actions__actions-list-item">
              <Button status="link" disabled={!selectedCount}
                onClick={this.props.onMoveToCompliance}
                className={classnames(
                  'results-side-actions__actions-list-item-button', {
                  'results-side-actions__actions-list-item-button--orange': !!selectedCount,
                  'results-side-actions__actions-list-item-button--disabled': !selectedCount,
                }
                )}>
                <div className="results-side-actions__action-letter">
                  w
                </div>
                To Compliance!
              </Button>
            </li>
          </ul>
          <div className="results-side-actions__panel-footer">
            <Button status="link" onClick={onClearSelection} disabled={!selectedCount}>
              Clean Selected
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
