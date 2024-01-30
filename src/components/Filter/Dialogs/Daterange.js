import React from 'react';
import FormGroup from '../../FormGroup';
import DatePicker from '../../DatePicker';
import Select from '../../Select';
import Common from './Common';
import moment from 'moment';

export class Daterange extends Common {
  defaultBodyStyle = {
    maxHeight: 'unset',
    overflow: 'unset',
  };

  handleTypeChange = (type) => {
    this.setState({
      data: {
        ...this.state.data,
        type,
      }
    });
  }

  changeValue = (key, value) => {
    this.setState({
      data: {
        ...this.state.data,
        [key]: value,
      }
    });
  }

  handleChangeField = (value) => this.changeValue('field', value);
  handleChangeType = (value) => this.changeValue('type', value);
  handleChangeFrom = (from) => this.changeValue('from', from);
  handleChangeTill = (till) => this.changeValue('till', till);

  validator = ({ type, from, till, }) => {
    let { errorMessages } = this.state;
    if (type !== 'custom') {
      return true;
    }
    if (!from) {
      errorMessages.from = 'Can\'t be blank';
    } else {
      delete errorMessages.from;
    }

    if (!till) {
      errorMessages.till = 'Can\'t be blank';
    } else {
      delete errorMessages.till;
    }
    if (!!from && !!till && moment(from).isAfter(till)) {
      errorMessages.dates = 'From date cant be after till date';
    } else {
      delete errorMessages.dates;
    }
    this.setState({ errorMessages });
    return !Object.keys(errorMessages).length;
  }

  get fieldTypes() {
    const { types } = this.props;
    if (!types) {
      return null;
    }
    return Object.keys(types).map(key => {
      return { id: key, name: types[key], }
    })
  }

  get rangeTypeOptions() {
    const { dateRanges } = this.props;
    return Object.keys(dateRanges).map(key => {
      return { id: key, name: dateRanges[key], };
    });
  }


  get dialogBody() {
    const { data, errorMessages, } = this.state;
    if (!data) {
      return null;
    }
    return (<div className="grid">
      {
        !!this.fieldTypes && (<div className="grid__row">
          <div className="grid__col grid__col--12">
            <FormGroup label="Name" vertical="vertical" labelAlign="baseline">
              <Select options={this.fieldTypes} value={data.field} onChange={this.handleChangeField} newSelect />
            </FormGroup>
          </div>
        </div>)
      }
      <div className="grid__row">
        <div className="grid__col grid__col--12">
          <FormGroup label="Range" vertical="vertical" labelAlign="baseline">
            <Select options={this.rangeTypeOptions} value={data.type}
              onChange={this.handleChangeType} newSelect />
          </FormGroup>
        </div>
      </div>
      {
        data.type === 'custom' && (
          <div>
            <div className="grid__row">
              <div className="grid__col grid__col--12">
                <FormGroup label="From" vertical="vertical" labelAlign="baseline">
                  <DatePicker onChange={this.handleChangeFrom} value={data.from}
                    clearable />
                </FormGroup>
              </div>
            </div>
            <div className="grid__row">
              <div className="grid__col grid__col--12">
                <FormGroup label="Till" vertical="vertical" labelAlign="baseline">
                  <DatePicker onChange={this.handleChangeTill} value={data.till}
                    clearable />
                </FormGroup>
              </div>
            </div>
          </div>
        )
      }
    </div>);
  }
}
