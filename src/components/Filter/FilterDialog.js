import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import classnames from 'classnames';
import Button from 'Components/Button';
import Dialog from 'Components/Dialog';
import { getClientType } from 'Helpers/cookie';

export default class FilterDialog extends Component {
  state = {}

  @autobind handleOpenDialog() {
    this.setState({data: this.props.data, errorMessages: {},});
  }

  @autobind handleApplyFilter() {
    const isfilterValid = this.validator
      ? this.validator(this.state.data)
      : true;
    if (!!isfilterValid) {
      this.props.onChange(this.state.data);
      if(!this.props.notCloseOnApply){
        this.props.onClose();
      }
    }
  }

  get dialogHeader() {
    const {header, title,} = this.props;
    if (!!header) {
      return header;
    }

    return (<div>
      Filter by&nbsp;
      <span className="filter-dialog__title">{title}</span>
    </div>);
  }

  render() {
    const {
      isOpen,
      onClose,
      className,
      bodyStyle,
    } = this.props;

    return (<Dialog isOpen={isOpen} onClose={onClose} className={classnames('filter-dialog', className)} onOpen={this.handleOpenDialog}>
      <Dialog.Header onClose={onClose}>
        {this.dialogHeader}
      </Dialog.Header>
      <Dialog.Body style={bodyStyle}>
        {this.dialogBody}
      </Dialog.Body>
      <Dialog.Footer>
        <Button status="white" onClick={() => onClose()}>Close</Button>
        <Button className={`${['fc'].includes(getClientType()) ? 'disabled_element' : ''}`} onClick={this.handleApplyFilter}>Apply</Button>
      </Dialog.Footer>
    </Dialog>);
  }
}
