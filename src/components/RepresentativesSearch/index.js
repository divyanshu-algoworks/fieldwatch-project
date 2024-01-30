import React, { Fragment } from 'react';
import { inject } from 'mobx-react';
import Input from 'Components/Input';
import Paper from 'Components/Paper';
import Button from 'Components/Button';
import FormGroup from 'Components/FormGroup';
import CommonForm from 'Components/CommonForm';
import Collapse from 'Components/Collapse';

@inject('store')
export default class RepresentativesSearch extends CommonForm {

  defaultItem = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    additional_notes: '',
    rep_id: '',
  }
  handleChangeFirstName = ({ target }) => this.changeValue('first_name', target.value);
  handleChangeLastName = ({ target }) => this.changeValue('last_name', target.value);
  handleChangeEmail = ({ target }) => this.changeValue('email', target.value);
  handleChangePhone = ({ target }) => this.changeValue('phone', target.value);
  handleChangeCompanyName = ({ target }) => this.changeValue('company_name', target.value);
  handleChangeAdditionalNotes = ({ target }) => this.changeValue('additional_notes', target.value);
  handleChangeRepId = ({ target }) => this.changeValue('rep_id', target.value);

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit(this.state.item);
  }

  clear = () => this.setItem({ ...this.defaultItem }, () => this.props.onSubmit({}));

  render() {
    const { item } = this.state;

    return (
      <Collapse triggerAllign="right"
        collapseText={(<Fragment><i className="pe-7s-search"></i> Advanced Search</Fragment>)}
        expandText={(<Fragment><i className="pe-7s-search"></i> Advanced Search</Fragment>)}>
        <Paper key="main-content">
          <Paper.Header>
            <Paper.Title>
              <div style={{ maxWidth: '220px', fontSize: '15px' }}>Advanced Search</div>
            </Paper.Title>
          </Paper.Header>
          <Paper.Body>
            <form onSubmit={this.handleSubmit}>
              <div className="grid">
                <div className="grid__row">
                  <div className="grid__col grid__col--4">
                    <FormGroup
                      className="w-100p"
                      label="First Name"
                      vertical="vertical"
                      labelAlign="baseline"
                      onChange={this.handleChangeFirstName}
                      value={item.first_name}
                    />
                  </div>
                  <div className="grid__col grid__col--4">
                    <FormGroup
                      className="w-100p"
                      label="Last Name"
                      vertical="vertical"
                      labelAlign="baseline"
                      onChange={this.handleChangeLastName}
                      value={item.last_name}
                    />
                  </div>
                  <div className="grid__col grid__col--4">
                    <FormGroup
                      className="w-100p"
                      label="Email"
                      vertical="vertical"
                      labelAlign="baseline"
                      onChange={this.handleChangeEmail}
                      value={item.email}
                    />
                  </div>
                </div>
                <div className="grid__row">
                  <div className="grid__col grid__col--4">
                    <FormGroup
                      className="w-100p"
                      label="Phone"
                      vertical="vertical"
                      labelAlign="baseline"
                      onChange={this.handleChangePhone}
                      value={item.phone}
                    />
                  </div>
                  <div className="grid__col grid__col--4">
                    <FormGroup
                      className="w-100p"
                      label="Company Name"
                      vertical="vertical"
                      labelAlign="baseline"
                      onChange={this.handleChangeCompanyName}
                      value={item.company_name}
                    />
                  </div>
                  <div className="grid__col grid__col--4">
                    <FormGroup
                      className="w-100p"
                      label="Additional Notes"
                      vertical="vertical"
                      labelAlign="baseline"
                      onChange={this.handleChangeAdditionalNotes}
                      value={item.additional_notes}
                    />
                  </div>
                </div>
                <div className="grid__row">
                  <div className="grid__col grid__col--4">
                    <FormGroup
                      className="w-100p"
                      label="Rep ID"
                      vertical="vertical"
                      labelAlign="baseline"
                      onChange={this.handleChangeRepId}
                      value={item.rep_id}
                    />
                  </div>
                </div>
              </div>
              <div className="ta-r">
                <Button size="small" status="white" onClick={this.clear}>Clear</Button>
                <Button size="small" status="white" type="submit">Search</Button>
              </div>
            </form>
          </Paper.Body>
        </Paper>
      </Collapse>
    )
  }
}
