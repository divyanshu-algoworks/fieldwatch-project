import React, { Component } from 'react';
import CommonForm from 'Components/CommonForm';
import Button from 'Components/Button';
import Dialog from 'Components/Dialog';
import FormGroup from 'Components/FormGroup';
import API from 'Helpers/api';

export default class CreateWidgetDialog extends CommonForm {
  modelName = 'widget';

  state = {
    ...this.state,
    isOpen: false,
  };

  defaultItem = {
    name: '',
  };

  open = (widget_type) => this.setState({
    isOpen: true, item: { ...this.defaultItgem, widget_type },
  });
  close = () => this.setState({ isOpen: false, });

  handleChangeName = ({ target }) => this.changeValue('name', target.value);

  get serializedItem() {
    return {
      ...this.state.item,
      filter_params: this.props.filters,
      user_id: this.props.userId,
    };
  }

  onSuccessSubmit = (_, { data }) => {
    if (!!data) {
      API.post(this.props.pinUrl, {
        body: {
          client_id: this.props.userId,
          dashboard_widget: {
            widget_id: data.id,
            client_id: this.props.userId,
          }
        },
      }).then(this.close);
    }
  }

  render() {
    const { item, isOpen } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <Dialog isOpen={isOpen} onClose={this.close}
          onOpen={this.onOpenDialog}>
          <Dialog.Header onClose={this.close}>
            New Widget
        </Dialog.Header>
          <Dialog.Body>
            <FormGroup label="Name" vertical labelAlign="baseline"
              validationMessages={this.validationMessages.name}
              value={item.name} onChange={this.handleChangeName} />
          </Dialog.Body>
          <Dialog.Footer>
            <Button status="white" onClick={this.close}>Close</Button>
            <Button type="submit">Apply</Button>
          </Dialog.Footer>
        </Dialog>
      </form>
    );
  }
}
