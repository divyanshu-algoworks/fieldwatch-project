import React, { Component, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import Button from 'Components/Button';
import Tooltip from 'Components/Tooltip';
import CreateWidgetDialog from 'Components/CreateWidgetDialog';
import { getClientType } from 'Helpers/cookie';

export default class DiagramCollapse extends Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.any,
    createWidgetUrl: PropTypes.string,
    pinWidgetUrl: PropTypes.string,
  }
  state = {
    expanded: true,
    isWidgetDialogVisible: false,
  }

  dialog = createRef();

  toggleCollapse = () => this.setState({ expanded: !this.state.expanded });
  showWidgetDialog = () => this.dialog.current.open(this.props.widgetType);

  render() {
    const { title, children, createWidgetUrl, pinWidgetUrl, widgetType, userId,
      filters, showDetails, onShowDetails, warningMessage} = this.props;
    const { expanded, isWidgetDialogVisible } = this.state;
    const isNonFWClient = ['fc'].includes(getClientType());
    return (
      <Fragment>
        <div className="graph-collapse" key="collapse">
          <div className="graph-collapse__header">
            <div className="graph-collapse__title">{title}</div>
            <Tooltip className="ml-10" body={`${!!expanded ? 'Collapse' : 'Expand'} Chart`}>
              <button type="button" className="graph-collapse__expander"
                onClick={this.toggleCollapse}>
                <i className={`pe-7s-angle-${expanded ? 'down' : 'up'}-circle`}></i>
              </button>
            </Tooltip>
            {!!createWidgetUrl && (
              <Tooltip body="Pin to Dashboard" className="ml-10">
                <Button status="link" onClick={this.showWidgetDialog} disabled={['fc'].includes(getClientType())}>
                  <i className="pe-7s-pin icon icon--bold icon--button"></i>
                </Button>
              </Tooltip>
            )}
          </div>
          {!isNonFWClient && warningMessage && showDetails && (
            <p className="c-orange empty-graph">Please select week wise date range filter and single user for this graph</p>
            )}
         {!warningMessage && showDetails &&
          <div onClick={onShowDetails}>
            <a className='f-r cursor-pointer'>View More details</a>
          </div>
          }
          {!!expanded && (
            <div className="graph-collapse__body">
              {children}
            </div>
          )}
        </div>
        <CreateWidgetDialog isOpen={isWidgetDialogVisible} ref={this.dialog}
          url={createWidgetUrl} pinUrl={pinWidgetUrl}
          widgetType={widgetType} userId={userId}
          filters={filters} />
      </Fragment>
    );
  }
}
