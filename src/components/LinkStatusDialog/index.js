import React, { Component } from 'react';
import Dialog from 'Components/Dialog';
import Button from 'Components/Button';
import Input from 'Components/Input';

export default class LinkStatusDialog extends Component {

  state = {
    selectedOption: ''
  }  

   options = [
    { id: 1, name: 'New', value: 'draft'},
    { id: 2, name: 'In Progress', value: 'in_progress'},
    { id: 3, name: 'Resolved-Material Removed', value: 'resolved'},
    { id: 4, name: 'Resolved-Material Updated', value: 'updated'}
  ]
  

  handleChangeOption = ({ target }) => {
   const { value, checked } = target;
   this.setState({ selectedOption: checked ? value : null})
  }

  handleConfirmation = () => {
    const { onConfirm } = this.props;
    const { selectedOption } = this.state;
    const option = this.options.filter(({ value }) => value === selectedOption)[0]
    this.setState({ selectedOption: ''})
    onConfirm(option);
  }

  render() {
    const { isOpen, title, onClose, url } = this.props;
    const { selectedOption } = this.state;
    const markedOption = selectedOption || url.status;
    return (
      <Dialog isOpen={isOpen} onClose={onClose}>
        <Dialog.Header onClose={onClose}>
          {title}
        </Dialog.Header>
        <Dialog.Body>
        <div className="grid">
            <div className="grid__row">
              {this.options.map(({ name, id, value }) => (
                <div className="grid__col grid__col--6 mb-10" key={id}>
                    <Input type="radio" value={value} label={name} id={id}
                      labelClassName="ellipsis"
                      onChange={this.handleChangeOption}
                      checked={markedOption === value}
                       />
                </div>
              ))}
            </div>
          </div>
        </Dialog.Body>

        <Dialog.Footer>
          <Button status="black" onClick={onClose}>Close</Button>
          <Button onClick={() => this.handleConfirmation()}>Apply</Button>
        </Dialog.Footer>
      </Dialog>
    );
  }
}
