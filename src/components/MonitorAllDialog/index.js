import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import Dialog from 'Components/Dialog';
import Button from 'Components/Button'
import Input from 'Components/Input';

// TODO: When user activity will be in develop, extend this dialog from FilterDialog or use onOpen property of Dialog
export default class MonitorAllDialog extends Component {

  state = {
    singleUrlQueries: []
  }

  componentWillReceiveProps({ isOpen, singleUrlQueries }) {
    if (!!isOpen && !this.props.isOpen) {
      this.setState({
        singleUrlQueries: singleUrlQueries.map(query => {
          return { ...query, checked: true };
        })
      })
    }
  }

  @autobind handleCheckAll(checked) {
    this.setState({
      singleUrlQueries: this.state.singleUrlQueries.map(query => {
        return { ...query, checked }
      })
    });
  }

  @autobind handleCheckQuery(query, checked) {
    const { singleUrlQueries } = this.state;
    const index = singleUrlQueries.findIndex(({ id }) => id === query.id);
    if (index === -1) {
      return;
    }
    this.setState({
      singleUrlQueries: [].concat(
        singleUrlQueries.slice(0, index),
        { ...query, checked },
        singleUrlQueries.slice(index + 1),
      )
    });
  }

  @autobind handleApplyMonitor() {
    const { onApply } = this.props;
    const queriesToMonitor = this.state.singleUrlQueries
      .filter(({ checked }) => !!checked)
      .map(({ id }) => id);

    onApply(!!queriesToMonitor.length ? queriesToMonitor : ['']);
    this.handleClose();
  }

  @autobind handleClose() {
    const { onClose } = this.props;
    onClose();
  }

  render() {
    const { isOpen } = this.props;
    const { singleUrlQueries } = this.state;
    return (
      <Dialog isOpen={isOpen} onClose={this.handleClose}>
        <Dialog.Header onClose={this.handleClose}>Add To Search</Dialog.Header>
        <Dialog.Body>
          <div className="grid">
            <div className="grid__row">
              <div className="grid__col grid__col--12">
                <Button size="small" onClick={() => this.handleCheckAll(true)}>Check All</Button>
                <Button size="small" onClick={() => this.handleCheckAll(false)}>Uncheck All</Button>
              </div>
            </div>
            <div className="grid__row">
              {singleUrlQueries.map(query => (
                <div className="grid__col grid__col--4 mb-10" key={query.id}>
                  <Input type="checkbox" checked={query.checked} label={query.name}
                    onChange={({ target }) => this.handleCheckQuery(query, target.checked)} />
                </div>
              ))}
            </div>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Button status="white" onClick={this.handleClose}>Close</Button>
          <Button onClick={this.handleApplyMonitor}>Apply</Button>
        </Dialog.Footer>
      </Dialog>
    );
  }
}
