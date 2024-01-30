import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'Components/Dialog';
import Button from 'Components/Button';
import FormGroup from 'Components/FormGroup';
import Input from 'Components/Input';
import Checkbox from 'Components/Input/Checkbox';
import { toggleItemPresence } from 'Helpers/array';
import API from 'Helpers/api';
import { CheckableScreenshot } from 'Components/CheckableScreenshot';
/**
 * Component for dialog, which will display detailed info about Compliance Action
 * Using in Incident form
 */
export default class ActionBodyDialog extends Component {
  state = {
    isOpen: false,
    action: null,
    screenshot_ids: [],
    file_ids: [],
  }
  static propTypes = {
    /** Callback for Reply button click */
    onReply: PropTypes.func,
  }

  /**
   * @param action object
   *   action struct:
   *   data: {
   *    direction: oneOf(['in', 'out']),
   *    title: string,
   *    body: PropTypes.string
   *   }
   *   compliance_email_history: {
   *    title: string,
   *    subject: string,
   *    body: string,
   *   }
   *   created_at: string,
   *   user_full_name: string,
   */

  open = (action) => this.setState({ isOpen: true, action });
  close = () => this.setState({ isOpen: false });
  handleReply = (action) => {
    const { onReply } = this.props;
    this.close();
    if (!!onReply) {
      onReply(action.data, action);
    }
  }

  changeValue = (key, value) => {
    if(key == 'screenshot_ids') {
      this.state.screenshot_ids = value;
    }
    if(key == 'file_ids') {
      this.state.file_ids = value;
    }
  }

  get allFilesChecked() {
    if (!this.state.action.attachments.files || this.state.action.attachments.files.length === 0) {
      return false;
    }
    return this.state.action.attachments.files.length === this.state.file_ids.length;
  }

  sendSelectedScreenshots() {
    let attachedScreenshots = this.state.screenshot_ids;
    let screenshots_url = this.state.action.add_screenshots_to_incident_url;
    this.setState({ loading: true });
    API.post(`${screenshots_url}`, {body: {screenshot_ids: attachedScreenshots}}).then((res) => {
      if(res.status == 'ok') {
        const selectedScreenshots = this.state.action.attachments.screenshots.filter(s => this.state.screenshot_ids.includes(s.id))
        this.props.updateScreenshotsList(selectedScreenshots);
        this.state.screenshot_ids = [];
        FW.flash({ type: 'info', text: 'Screenshot attached successfully!' });
      }
      this.setState({ loading: false });
    })
  }

  openFile = (file) => {
    window.open(file.url);
  }

  sendSelectedFiles() {
    let attachedFiles = this.state.file_ids;
    let files_url = this.state.action.add_files_to_incident_url;
    this.setState({ loading: true });
    API.post(`${files_url}`, {body: {file_ids:attachedFiles}}).then((res) => {
      if(res.status == 'ok') {
        const selectedFiles = this.state.action.attachments.files.filter(f => this.state.file_ids.includes(f.id))
        this.props.updateFilesList(selectedFiles);
        this.state.file_ids = [];
        FW.flash({ type: 'info', text: 'Files attached successfully!' });
      } 
      this.setState({ loading: false });
    })
  }

  handleChangeAllScreenshotsChecked = ({ target }) => {
    const screenshot_ids = target.checked
      ? this.state.action.attachments.screenshots.map(({ id }) => id)
      : [];
    this.changeValue('screenshot_ids', screenshot_ids);
    this.setState(prevState=>{
      return {...prevState}
      })
  };

 

  handleChangeScreenshot = ({ id }) => {
    this.changeValue(
      'screenshot_ids',
      toggleItemPresence(this.state.screenshot_ids, id)
    );
    this.setState(prevState=>{
      return {...prevState}
      })
  }

  handleChangeAllFilesChecked = (e) => {
    const file_ids =
      e.target.checked && Array.isArray(this.state.action.attachments.files)
        ? this.state.action.attachments.files.map(({ id }) => id)
        : [];
    this.changeValue('file_ids', file_ids);
    this.setState(prevState=>{
      return {...prevState}
      })
  }

  handleChangeFile = (data) => {
    this.changeValue(
      'file_ids',
      toggleItemPresence(this.state.file_ids, data)
    );
    this.setState(prevState=>{
      return {...prevState}
      })
  }

  get allScreenshotsChecked() {
    return (
      this.state.action.attachments.screenshots.length == this.state.screenshot_ids.length
    );
  }

  get dialogHeader() {
    const { representative } = this.props;
    const { action } = this.state;
    let id, client_id, incident_id = ''

    if(action) {
      id = action.id
      client_id = action.client_id
      incident_id = action.incident_id
    }

    if (!action || !action.data) {
      return null;
    }
    const { direction } = action.data;
    if (action.action_type === 'send_representative_sms') {
      return 'Representative SMS';
    }
    if (action.action_type === 'receive_representative_sms') {

      return 'Receive SMS from Representative';
    }
    if (!!representative && representative.email && (direction === 'in')) {
      return (
          <div className='grid'>
        <div className='grid__row paddingTop'>
          <div className='grid__col grid__col--11 minWidth'>
          <Button size="small" onClick={() => this.handleReply(action)}>Reply</Button>
          </div>
          <div className='grid__col grid__col--1'>
        {action.action_type == 'receive_compliance_email' ? <Button><a className='export_btn' href={`/case_management/clients/${client_id}/incidents/${incident_id}/user_activities/${id}.pdf`} target="blank">Export</a></Button> : '' }
        </div>
        </div>
        </div>
      );
    }
    if (action.action_type === 'send_training_email') {
      return 'Training Email';
    }
    if (action.action_type === 'finished_quiz') {
      return 'Quiz Results';
    }
    
    return(
      <div className='grid'>
        <div className='grid__row paddingTop'>
          <div className='grid__col grid__col--11 minWidth'>{!!action.compliance_email_history ? action.compliance_email_history.title : ''}</div>
          <div className='grid__col grid__col--1'>
            {action.action_type == 'send_compliance_email' ? <Button><a className='export_btn' href={`/case_management/clients/${client_id}/incidents/${incident_id}/user_activities/${id}.pdf`} target="blank">Export</a></Button> : '' }
          </div>
        </div>
      </div>
    );
  }

  showAttachments = (attachments) => {
    let { screenshots, files, compliance_action_attachments } = attachments ? attachments : {};
    
    if (!attachments) {
      return (
        <React.Fragment>
        </React.Fragment>
      )
    }
    else {
      return (
        <React.Fragment>
          {(!!screenshots && !!screenshots.length) ? (
            <div className="grid mt-10">
              <div className="grid__row">
                <div className="grid__col grid__col--6">
                  <Checkbox
                    label="Attach All Screenshots"
                    checked={this.allScreenshotsChecked}
                    onChange={this.handleChangeAllScreenshotsChecked}
                    className="compliance-emails-checkbox-label"
                  />
                </div>
                <div className="grid__col grid__col--6">
                <Button type="label" size="small" status="black" type="submit"
                disabled = {this.state.screenshot_ids.length === 0} onClick={() => this.sendSelectedScreenshots()}>
                Attach Screenshots to incident
              </Button>
                </div>
              </div>
              <div className="grid__row">
                <div className="checkeable-screenchots">
                  {screenshots.map((screenshot) => {
                    return (
                      <CheckableScreenshot
                        key={screenshot.id}
                        className="grid__col grid__col--4"
                        item={screenshot}
                        checked={this.state.screenshot_ids && this.state.screenshot_ids.indexOf(screenshot.id) > -1}
                        onChange={this.handleChangeScreenshot}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          ) : null}
          {
            (Array.isArray(files) && files.length) ? (
              <div className="grid mt-45">
                <div className="grid__row">
                  <div className="grid__col grid__col--6">
                    <FormGroup>
                      <Input
                        type="checkbox"
                        label="Attach All Files"
                        checked={this.allFilesChecked || false}
                        onChange={
                          (e)=> this.handleChangeAllFilesChecked(e)}
                        className="compliance-emails-checkbox-label"
                      />
                    </FormGroup>
                  </div>
                  <div className="grid__col grid__col--6">
                  <Button type="label" size="small" status="black" type="submit"
                disabled = {this.state.file_ids.length === 0} onClick={() => this.sendSelectedFiles()}>
                Attach Files to incident
              </Button>
                  </div>
                </div>
                
                <div className="mt-10 ml-28">
                  <div className="grid__row">
                  <p>Files</p>
                  {files.map((file) => (
                    
                    <FormGroup key={file.id}>
                       <div className="grid__col grid__col--6">
                      <Checkbox
                        label={file.name}
                        item = {file}
                        style={{ display: 'block' }}
                        checked={this.state.file_ids && this.state.file_ids.indexOf(file.id) > -1}
                        onChange={(e)=> this.handleChangeFile(file.id)}
                      />
                      </div>
                    <div className="grid__col grid__col--6">
                       <Button size="small" onClick={() => this.openFile(file)}>Download</Button>
                       </div>
                    </FormGroup>
                  ))}
                </div>
                
                </div>
              </div>
            ) : null
          }
          {
            Array.isArray(compliance_action_attachments) && compliance_action_attachments.length > 0 &&
            <div className="grid__row">
              <div className="grid__col grid__col--12">
                <section className="paper">
                  <div className="paper__header">
                    <h2 className="paper__title paper__title--small">Template Attachments</h2>
                  </div>
                  <div className="paper__body">
                    <ol className="files-list">
                      {compliance_action_attachments.map((file, index) => (
                        <li key={index}>
                          <div className="files-list__file">
                            <a
                              href={file.url}
                              target="blank"
                              className="files-list__file-name files-list__file-name-compliance"
                            >
                              {file.name}
                            </a>

                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </section>
              </div>
            </div>
          }
        </React.Fragment>
      )
    }

  }

  get questionsList() {
    const { training_data = [] } = this.state.action.data.quiz_data;
    return training_data.map(({ question, answer, correct }, index) => {
      const iconClass = correct ? 'fa fa-check c-green' : 'fa fa-times c-red';
      return (
        <div key={index} className="mb-20">
          <p style={{ marginBottom: '0px' }}>{index + 1}. {question}</p>
          <i className={iconClass} aria-hidden="true"></i>
          &nbsp;
          {answer}
        </div>
      );
    })
  }


  getLocalTime = (timestamp) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"	
    }
    const date = new Date(timestamp)
    return (date.toLocaleString('en-US', options));
  }

  get emailBody() {
    const {
      data,
      training_url
    } = this.state.action;

    const regex = /<a.*\/public\/clients\/[0-9]+\/trainings.*<\/a>/g;
    let emailBody = data.email_body.replaceAll(regex, '');
    emailBody = emailBody.replace('Please use the link below to complete the training:', `Below training was sent to the field member:<br><br><a href="${training_url}">${training_url}</a>`);

    return emailBody;
  }

  get dialogBody() {
    if (!this.state.action) {
      return null;
    }
    let { action } = this.state;
    const {
      action_type,
      data,
      compliance_email_history,
      user_full_name,
      created_at
    } = this.state.action;

    if (['send_compliance_email', 'receive_compliance_email'].indexOf(action_type) > -1) {
      return (
        <div>
          {
            action_type === 'receive_compliance_email' && (
              <p>
                <b>From:</b> {data.from_email}
              </p>
            )
          }
          { data.recipient_email && <p><b>To:</b> {data.recipient_email}</p>}
          { data.cc && <p><b>cc:</b> {data.cc}</p>}
          { data.bcc && <p><b>bcc:</b> {data.bcc}</p>}
          <p><b>Date:</b> {this.getLocalTime(created_at)}</p>
          {compliance_email_history && compliance_email_history.subject && <p><b>Subject:</b> {compliance_email_history.subject}</p>}
          {compliance_email_history && compliance_email_history.body && <p><b>Body:</b> <span className="li_underline" dangerouslySetInnerHTML={{ __html: compliance_email_history ? compliance_email_history.body: '' }} /></p>}
          {!!action_type && action_type == 'send_compliance_email' && this.showAttachments(action.sendAttachments)}
          {!!action_type && action_type != 'send_compliance_email' && this.showAttachments(action.attachments)}
        </div>
      );
    }

    if (action_type === 'send_training_email') {
      return (
        <div>
          <p><b>Date:</b> {this.getLocalTime(created_at)}</p>
          {data.cc && <p><b>CC: </b>{data.cc}</p>}
          {data.email_subject &&<p><b>Subject:</b> {data.email_subject}</p>}
          {data.email_body &&<p><b>Body:</b> <span className="li_underline" dangerouslySetInnerHTML={{ __html: this.emailBody }} /></p>}
          {this.showAttachments({
            screenshots: action.sendAttachments.training_screenshots,
            files: action.sendAttachments.training_files,
          })}
        </div>
      );
    }

    if (action_type === 'finished_quiz') {
      const { training_data = [] } = data.quiz_data;
      const correctAnswers = training_data.filter(({ correct }) => !!correct);
      const correctAnswerPercentage = Math.round(correctAnswers.length / training_data.length * 100);

      return (
        <div>
          <p>Total % of right answers: {correctAnswerPercentage}%</p>
          <p style={{ fontWeight: 'bold' }}>All Questions:</p>
          {
            this.questionsList
          }
        </div>
      );
    }

    if (['send_representative_sms', 'receive_representative_sms'].indexOf(action_type) > -1) {
      return (
        <div>
          <p><b>Date:</b> {created_at}</p>
          {!!data.from && (<p><b>From:</b> {data.from}</p>)}
          <p><b>To:</b> {data.to}</p>
          <p><b>Text:</b> {data.body}</p>
          {this.showAttachments(action.attachments)}
        </div>
      );
    }

    if (action_type === 'add_compliance_action') {
      return (
        <div>
          <p><b>Action Title:</b> {data.title}</p>
          <section className="mb-10"><b>Action Body:</b> <br /> <div className="ml-25 compliance_action_em" dangerouslySetInnerHTML={{
            __html: data.body
          }}></div></section>
          <p><b>Participant:</b> {user_full_name}</p>
          {this.showAttachments(action.attachments)}
        </div>
      );
    }

    return null;
  }

  render() {
    const { isOpen } = this.state;
    return (
      <Dialog isOpen={isOpen} onClose={this.close}>
        <Dialog.Header onClose={this.close}>{this.dialogHeader}</Dialog.Header>
        <Dialog.Body>
          {this.dialogBody}
        </Dialog.Body>
      </Dialog>
    );
  }
}
