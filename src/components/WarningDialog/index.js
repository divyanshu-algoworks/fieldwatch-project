import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '../Dialog';
import Button from '../Button';
import Input from '../Input';

/**
 * WarningDialog is component for dialog, which display in ItemsPage when user
 * try to remove item
 */
export default class WarningDialog extends Component {
  state = { isOpen: false, pending: false, checkbox: false };
  static propType = {
    /** Is dialog open */
    isOpen: PropTypes.bool,
    /** Confirm remove item handler */
    onConfirm: PropTypes.func,
    /** Dialog close handler */
    onClose: PropTypes.func,
    text: PropTypes.string,
  }

  static defaultProps = {
    text: 'Are you sure?',
  }

  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });
  onSuccess = async() => {
    const { onConfirm, btnTextYes } = this.props;
      btnTextYes ? this.setState({ pending: false}) : this.setState({ pending: true });
      await onConfirm();
      this.setState({ pending: false })
  }

  handleChangeCheckbox = ({ target }) => {
   this.setState({ checkbox: target.checked})
   localStorage.setItem('is_popup_allowed', target.checked);
  }

  handleCheckbox = ({ target }, url) => {
    const { all_incidents_data, setAllIncidentData } = this.props;
    let index = all_incidents_data.map(function (data) { return data.url; }).indexOf(url);
    all_incidents_data[index].isChecked = target.checked;
    setAllIncidentData(all_incidents_data); 
  }

  renderIncidentsLinkData = (incidents) => {
    return incidents.map(link => (
      <ul style={{listStyleType: 'none', paddingRight: '30px'}}>
      <li key={link.incident_number}>
          <a href={link.edit_url} target="_blank">{`incident ${link.incident_number}`}</a>
      </li>
      </ul>
   ))
  }

  render() {
    const { onConfirm, onClose, text, btnTextYes, btnTextNo, incidents, linksPopUp, closeDialog, can_send_warning_email, filterCheckbox, all_incidents_data } = this.props;
    const isOpen = this.props.isOpen || this.state.isOpen;
    return (
      <Dialog isOpen={isOpen} onClose={onClose || this.close} overlayStyle={{ zIndex: 1002 }}>
        <Dialog.Header onClose={btnTextYes ? closeDialog : (onClose || this.close)}>Warning!</Dialog.Header>
        <Dialog.Body>
          <div className="warning">
            {linksPopUp !== 'primary' && <div className="warning__circle">
              <i className="pe-7s-attention"></i>
            </div>}
            <div className="warning__text" style={{'paddingBottom': '10px'}}>{text}</div>
        {incidents && this.renderIncidentsLinkData(incidents)}
        {all_incidents_data && all_incidents_data.map(data => (
          <React.Fragment>
          <div className="d-f mr-auto">
            <input type="checkbox" checked={data.isChecked} onChange={(e) => this.handleCheckbox(e, data.url)} className="url-checkbox"/>
             <p>{data.url}</p>
          </div>
          <div>
            {data.incidents && this.renderIncidentsLinkData(data.incidents)}
          </div>
          </React.Fragment>
        ))}
        {filterCheckbox && (
           <Input
           type="checkbox"
           className='h-w-17p'
           checked={this.state.checkbox}
           label="Prevent this page from creating additional popups."
           onChange={this.handleChangeCheckbox}
         />
        )}
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          {can_send_warning_email ? 
           <Button status="orange" onClick={onClose || this.close}>Okay</Button>
           :
           <div>
           <Button status="white" onClick={onClose || this.close}>{btnTextNo ? btnTextNo : 'Cancel'}</Button>
           <Button status="orange" onClick={this.onSuccess} disabled={this.state.pending}>{btnTextYes ? btnTextYes : 'Proceed'}</Button>
           </div>
          }
        </Dialog.Footer>
      </Dialog>
    );
  }
}
