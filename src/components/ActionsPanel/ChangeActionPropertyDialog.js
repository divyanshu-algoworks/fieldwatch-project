import React, { Component } from 'react';
import pluralize from 'pluralize';
import Dialog from 'Components/Dialog';
import Input from 'Components/Input';
import Button from 'Components/Button';
import Preloader from 'Components/Preloader';
import Tooltip from 'Components/Tooltip';
import API from 'Helpers/api';

export default class ChangeActionsPropertyDialog extends Component {
  state = {
    open: false,
    loading: false,
    options: [],
    selectedOption: [],
    propName: '',
    multiSelect: false
  }

  open = ({ method, propName }) => {
    const { incidentPropsUrl, additionEmailProps } = this.props;
    this.setState({ loading: true, isOpen: true, propName, method, });
    const body = {
      method,
    }
    if(method === 'incidents_tags') body.incident_ids = additionEmailProps.incident_ids
    API.get(incidentPropsUrl, { body }).then((data) => {
      this.setState({
        options: method === 'edge_cases' ? this.getEdgeCaseOption() :  data.entities,
        selectedOption: !!data.entities[0] ? [data.entities[0].id] : [],
        loading: false,
        multiSelect: ['tags', 'policies', 'incidents_tags'].includes(method)
      });
    });
  };

  close = () => this.setState({ isOpen: false });
  getEdgeCaseOption = () => {
    return  [
      {
        id: 1,
        name: "true",
      },
      {
        id: 2,
        name: "false",
      },
    ];
  }

  handleChangeOption = ({ target }) => {
    const { multiSelect, selectedOption } = this.state;
    const { id, value, checked } = target;
    let selectedEntity = [...selectedOption];
    if(!multiSelect) selectedEntity = [+value];
    else {
       if(checked) selectedEntity.push(+id)
       else
        selectedEntity = selectedEntity.filter(x => x !== +id)
    }   
    this.setState({ selectedOption: selectedEntity });
  }

  handleApply = () => {
    const { selectedOption, method, multiSelect } = this.state;
    const { additionEmailProps } = this.props;

    this.setState({ loading: true });
    const body = {
      method,
      [`${method}_id`]: multiSelect ? selectedOption : selectedOption[0],
      ...additionEmailProps,
    };
    API.put(this.props.updateIncidentsPropUrl, { body, }).then((res) => {
      this.close();
      this.props.onSuccessApply(res);
    });
  }

  render() {
    const { count} = this.props;
    const { isOpen, loading, options, selectedOption, propName, multiSelect, method } = this.state;
    return (
      <Dialog isOpen={isOpen} onClose={this.close}>
        <Dialog.Header onClose={this.close}>
          {method === 'incidents_tags' ?'Remove' : 'Change'} {propName} for <span className="c-orange">
            {pluralize('Incident', count, true)}
          </span>
        </Dialog.Header>
        <Dialog.Body>
          <div className="grid">
            <div className="grid__row">
              {!!loading && (<div className="grid__col grid__col--12">
                <Preloader />
              </div>
              )}
              {!loading && !options.length && (
                <b>No {pluralize(propName)}</b>
              )}
              {!loading && options.map(({ name, id }) => (
                <div className="grid__col grid__col--4 mb-10" key={id}>
                  <Tooltip body={name}>
                    <Input type={multiSelect ? "checkbox" : "radio"} value={id} label={name} id={id}
                      labelClassName="ellipsis"
                      onChange={this.handleChangeOption}
                      checked={selectedOption.includes(id)}
                       />
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Button status="black" onClick={this.close}>Close</Button>
          {!!options.length && (<Button onClick={this.handleApply}>Apply</Button>)}
        </Dialog.Footer>
      </Dialog>
    );
  }
}
