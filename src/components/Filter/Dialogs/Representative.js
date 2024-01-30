import React from 'react';
import classnames from 'classnames';
import FormGroup from '../../FormGroup';
import Input from '../../Input';
import { isEmpty } from '../../../helpers/object';
import Common from './Common';
import Button from '../../Input';
import API from '../../../helpers/api';

const optionRenderer = ({ option, isOptionSelected, isOptionFocused, getOptionLabel, getOptionValue, optionClassName, ...otherOptions }) => {
  return (
    <div
      className={classnames('fw-select__option', {
        'fw-select__option--selected': isOptionSelected,
        'focused fw-select__option--focused': isOptionFocused,
        optionClassName,
      })}
      {...otherOptions}>{option.first_name} {option.last_name}</div>
  )
};

export class Representative extends Common {
  open = (data) => {
    let placeholder;
    if (!!data && !isEmpty(data) && !!data.id) {
      placeholder = `${data.id} ${data.name}`;
    } else {
      placeholder = 'Enter first name, last name or ID'
    }
    this.setState({ data, isOpen: true, placeholder, search: '', options: null, });
  }

  /**
   * Handler for change input with autocomplete if there will be
   * repAutocompletePath in component props. This function will change
   * representative prop and make ajax request for autocomplete options. When
   * request done, autocomplete options will be write to RepresentativeStore.
   * @param {string} key input value key
   * @param {string} value new input value
   */
  autocompletableInputChange = ({ target }) => {
    this.setState({ search: target.value, pending: target.value.length > 2, ...(target.value.length > 2) && { options: null } });
    if (target.value.length > 2) {
      this.autocompleteRequest = API.post(this.props.autocompleteUrl, {
        body: {
          representative: {
            values: target.value,
          }
        }
      });

      this.autocompleteRequest.then(options => {
        this.setState({ options, pending: false, });
      });
    }
  }

  /**
   * If there is autocomplete request pending, then we should abort it.
   * @param {object} e event handler
   */
  handleAutocompleteKeydown = () => {
    if (this.autocompleteRequest) {
      this.autocompleteRequest.abort();
      this.setState({ pending: false });
      this.autocompleteRequest = null;
    }
  }

  /**
   * When representative will be selected from autocomplete, then
   * @param {object} item representative data
   */
  handleAutocompleteSelect = (item) => {
    this.setState({
      data: {
        id: item.id,
        name: `${item.first_name} ${item.last_name}`,
        client_id: item.client_id,
        levels: [-1, 1],
        rep_id: item.rep_id,
        path: item.path,
      },
      placeholder: `${item.rep_id} ${item.first_name} ${item.last_name} ${item.email}`,
      search: '',
    });
  }

  handleChangeCheckbox = (key, checked) => {
    const { levels } = this.state.data;
    if (!!checked) {
      this.setState({
        data: { ...this.state.data, levels: [...levels, key] }
      });
    } else {
      const index = levels.indexOf(key);
      this.setState({
        data: {
          ...this.state.data, levels: [].concat(
            levels.slice(0, index),
            levels.slice(index + 1)
          )
        }
      });
    }
  }

  handleClear = () => {
    this.setState({
      data: {},
      placeholder: 'Enter first name, last name or ID',
      search: ''
    })
  };

  get dialogBody() {
    const { search, options, placeholder, data, pending, } = this.state;
    let firstName, lastName;
    if (!!data && !isEmpty(data)) {
      [firstName, lastName] = data.name.split(' ');
    }
    return [
      !!data && !!data.id && (
        <div key="rep_search_block">
          <div className="grid__row" key="clear">
            <Button size="small" onClick={this.handleClear}>Clear</Button>
          </div>
          <div className="grid__row" key="name">
            <div className="grid__col grid__col--4">
              <b>First Name:&nbsp;</b>
              <span>{firstName}</span>
            </div>
            <div className="grid__col grid__col--4">
              <b>Last Name:&nbsp;</b>
              <span>{lastName}</span>
            </div>
            <div className="grid__col grid__col--4">
              <b>Rep ID:&nbsp;</b>
              <span>{data.rep_id}</span>
            </div>
          </div>
        </div>
      ),
      !!data && !!data.id && !!this.props.uplineDownline && (
        <div key="levels" className="grid__row">
          <div className="grid__col grid__col--4">
            <Input type="checkbox" label="Downline"
              checked={data.levels.indexOf(-1) > -1}
              onChange={({ target }) => this.handleChangeCheckbox(-1, target.checked)} />
          </div>
          <div className="grid__col grid__col--4">
            <Input type="checkbox" label="Upline"
              checked={data.levels.indexOf(1) > -1}
              onChange={({ target }) => this.handleChangeCheckbox(1, target.checked)} />
          </div>
        </div>
      ),
      (
        <div className="grid__row" key="autocomplete">
          <div className="grid__col grid__col--12">
            <FormGroup type="text" value={search}
              pending={pending}
              onChange={this.autocompletableInputChange}
              autocompleteOptions={options}
              placeholder={placeholder}
              optionRenderer={optionRenderer}
              onKeyDown={this.handleAutocompleteKeydown}
              onAutocompleteSelect={this.handleAutocompleteSelect}
              autocomplete />
          </div>
        </div>
      ),
    ];
  }
}
