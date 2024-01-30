import React, { Component } from 'react';
import Dialog from 'Components/Dialog';
import Button from 'Components/Button';
import FormGroup from 'Components/FormGroup';
import TagsSelect from 'Components/TagsControls/TagsSelect';

export default class RepGroupsDialog extends Component {
  state = {
    selectedGroups: [],
    isOpen: false,
  }

  open = () => this.setState({ isOpen: true, selectedGroups: [] });
  close = () => this.setState({ isOpen: false });

  handleSelectGroup = (group) => {
    this.setState({selectedGroups: [...this.state.selectedGroups, group.id]});
  }

  setSelectedGroups = (selectedGroups) => {
    this.setState({ selectedGroups });
  }

  handleChangeGroups = (groups, action, group) => {
    if(['add', 'remove'].indexOf(action) > -1) {
      this.setSelectedGroups(groups);
    } else if(action === 'create') {
      this.props.onCreateGroup(group).then(res => this.setSelectedGroups(
        [...groups, res.id]
      ));
    }
  }

  handleBindGroupsToRepresentatives = () => {
    this.props.onAssignGroups(this.state.selectedGroups);
    this.close();
  }

  render() {
    const { representativeGroups } = this.props;
    const {isOpen, selectedGroups} = this.state;

    return (
      <Dialog isOpen={isOpen} onClose={this.close}>
        <Dialog.Header onClose={this.close}>
          Assign Groups
        </Dialog.Header>
        <Dialog.Body>
          <FormGroup label="Groups" vertical labelAlign="baseline">
            <TagsSelect
              value={selectedGroups}
              options={representativeGroups}
              onChange={this.handleChangeGroups} />
          </FormGroup>
        </Dialog.Body>

        <Dialog.Footer>
          <Button status="black" onClick={this.close}>Close</Button>
          <Button onClick={this.handleBindGroupsToRepresentatives}>Save</Button>
        </Dialog.Footer>
      </Dialog>
    );
  }
}