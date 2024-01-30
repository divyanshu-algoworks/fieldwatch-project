import React, { Fragment } from 'react';
import FormGroup from '../../components/FormGroup';
import CommonForm from '../../components/CommonForm';
import Button from '../../components/Button';
import Preloader from '../../components/Preloader';
import Dialog from '../../components/Dialog';
import Input from '../../components/Input';
import Checkbox from '../../components/Input/Checkbox';
import { checkRequired } from '../../helpers/validators';
import INCIDENTS_TABLE_DEFAULT_COLUMNS from '../../constants/IncidentsTableDefaultColumns';

export function getVisibleColumnsList() {
  let list;
  try {
    // TODO: change config localStorage data format
    list = JSON.parse(localStorage.incidentsColumnVisibility);
  } catch (err) {
    list = INCIDENTS_TABLE_DEFAULT_COLUMNS;
  }

  return list;
}

export class FilterViewDialog extends CommonForm {
  modelName = 'filter_setting';
  state = {
    ...this.state,
    isOpen: false,
    item: { ...this.defaultItem },
  };

  defaultItem = {
    name: '',
    settings: this.props.filters,
    entity_type: 'incident',
  };

  validators = {
    name: checkRequired('name'),
  }

  open = (item = this.defaultItem) => {
    if(isNaN(item.id)) {
      delete item.id;
      item.name = ''
    }
   this.setState({
    isOpen: true,
     item: {
      ...this.defaultItem,
      ...item,
      settings: this.props.filters,
    },
  })}

  close = () => this.setState({ isOpen: false, });
  handleChangeIsPublic = ({ target }) => {
    this.changeValue('user_id', target.checked ? null : this.props.user_id);
  };
  handleChangeName = ({ target }) => this.changeValue('name', target.value);
  onSuccessSubmit = (_, { view }) => {
    this.props.IncidentState.setIsUpdatedView(false);
    this.props.IncidentState.setIsFilterDropDownChanged(false);
    this.props.onUpdateView({ ...view, settings: JSON.parse(view.settings), });
    this.close();
  }

  get serializedItem() {
    const { item } = this.state;
    const { date_range, ...settings } = item.settings;
    const { field, ...otherRange } = date_range;

    return {
      ...item,
      settings: {
        ...settings,
        columns:getVisibleColumnsList(),
        [`${field}_range`]: otherRange,
      },
    };
  }

  render() {
    const { isOpen, pending, item, } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <Dialog isOpen={isOpen} onClose={this.close}>
          <Dialog.Header onClose={this.close}>
            Save Custom Filter Settings
          </Dialog.Header>
          <Dialog.Body>
            {!!pending && (<Preloader />)}
            {!pending && (
              <Fragment>
                <FormGroup label="Name" className="mb-10" validationMessages={this.validationMessages.name}
                  vertical labelAlign="baseline">
                  <Input value={item.name} className="w-100p"
                    invalid={!!this.validationMessages.name}
                    onChange={this.handleChangeName} />
                </FormGroup>
                <Checkbox checked={!item.user_id} onChange={this.handleChangeIsPublic}
                  label="Public" />
              </Fragment>
            )}
          </Dialog.Body>
          <Dialog.Footer>
            <Button status="white" onClick={this.close}>Cancel</Button>
            <Button type="submit">Apply</Button>
          </Dialog.Footer>
        </Dialog>
      </form>
    );
  }
}
