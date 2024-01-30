import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Input from 'Components/Input';
import Button from 'Components/Button';
import Preloader from 'Components/Preloader';

/**
 * EmailsList component uses in complience email and training email dialogs.
 * List has not case sensetive search by email title.
 */
export default class EmailsList extends Component {

  static propTypes = {
    /** Handler for New Email button click */
    onCreate: PropTypes.func,
    /** Handler for Edit Email button click */
    onEdit: PropTypes.func,
    /** Handler for Training Preview button click (Training Dialog only) */
    onPreview: PropTypes.func,
    /** Handler for Send Email button click */
    onSend: PropTypes.func,
    /** Emais list */
    emails: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.any,
      title: PropTypes.string,
    })),
  }

  state = {
    search: ''
  }

  @autobind handleSearchChange(search) {
    this.setState({ search });
  }

  /**
   * When we switch to create email form, we clear emails list search
   */
  @autobind handleSwitchToCreate() {
    const { onCreate } = this.props;
    this.setState({ search: '' });
    onCreate();
  }

  /**
   * When we switch to create email form, we clear emails list search
   * @param {object} email email to edit
   */
  @autobind handleSwitchToEdit(email) {
    const { onEdit } = this.props;
    this.setState({ search: '' });
    onEdit(email);
  }

  /**
   * When we switch to preview email's training form, we clear emails list search
   * @param {*} email
   */
  @autobind handleSwitchToPreview(email) {
    const { onPreview } = this.props;
    this.setState({ search: '' });
    onPreview(email);
  }

  /**
   * getter, which returns only emails, which are satesfy search request
   */
  get emailsToDisplay() {
    const { search } = this.state;
    const { emails } = this.props;
    if (!emails) {
      return [];
    }
    const regExp = new RegExp(search.toLowerCase());
    return emails.filter(({ title }) => regExp.test(title.toLowerCase()));
  }

  render() {
    const { onPreview, onEdit, onSend, onCreate, emails } = this.props;
    const { search } = this.state;

    if (!emails) {
      return (<Preloader />);
    }

    return [
      (
        <div className="ta-r mb-10" key="search-block">
          <Input type="search" onChange={({ target }) => this.handleSearchChange(target.value)} value={search} />
          {!!onCreate && (
            <Button status="black"
              onClick={this.handleSwitchToCreate}>
              New
            </Button>
          )}
        </div>
      ),
      (
        <ul className="compliance-emails-list" key="emails-list">
          {this.emailsToDisplay.map(email => (
            <li className="compliance-emails-list__item" key={email.id}>
              <div>{email.title}</div>
              <div className="d-f">
                {!!onPreview && (
                  <Button size="small" onClick={() => this.handleSwitchToPreview(email)}>preview</Button>
                )}
                {!!onEdit && (
                  <Button size="small" status="black"
                    onClick={() => this.handleSwitchToEdit(email)}>
                    edit
                  </Button>
                )}
                {!!onSend && (
                  <Button size="small" onClick={() => onSend(email)}>
                    send
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )
    ];
  }
}
