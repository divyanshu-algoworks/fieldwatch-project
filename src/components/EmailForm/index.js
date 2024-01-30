import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { inject, observer } from 'mobx-react';
import FormGroup from 'Components/FormGroup';
import Input from 'Components/Input';
import Button from 'Components/Button';
import TextEditor from 'Components/TextEditor';
import DropdownButton from 'Components/DropdownButton';
import Preloader from 'Components/Preloader';

/**
 * EmailForm component uses in complience email and training email dialogs.
 * When use this component in SendTrainingDialog, props
 * showAttachScreenshotsCheckbox and showAttachFilesCheckbox should be false.
 * Has two states: edit and preview. Uses EmailForm state.
 * If email prveiw is active and there is no HTML for prview, then will be
 * displayed Preloader, so, global preloader shoult be disabled(third param of
 * FieldWatch.ajax_<request_type> should be empty array).
 */
@inject('store')
@observer
export default class EmailForm extends Component {

  static propTypes = {
    /** Display Send Email and Back to list buttons */
    showSendNavButtons: PropTypes.bool,
    /** Display "Attach Screenshots" checkbox flag */
    showAttachScreenshotsCheckbox: PropTypes.bool,
    /** Display "Attach Files" checkbox flag */
    showAttachFilesCheckbox: PropTypes.bool,
    /** Display "Bcc" input flag */
    showBcc: PropTypes.bool,
    /** Data for subject merge fields DropdownButton */
    subjectMergeFields: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.any,
      name: PropTypes.string
    })),
    /** Data for trainings merge fields DropdownButton& If will be empty, then
     * merge training button will be not displayed */
    trainingMergeFields: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.any,
      name: PropTypes.string
    })),
    /** Data for body merge fields DropdownButton */
    bodyMergeFields: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.any,
      name: PropTypes.string
    })),
  }

  static defaultProps = {
    showSendNavButtons: true,
    showAttachScreenshotsCheckbox: false,
    showAttachFilesCheckbox: false,
    showBcc: true,
    showCc: true,
  }

  constructor(props) {
    super(props);
    this.inputs = {};
  }

  /**
   * Change subject by DropdownButton handler
   * Takes last cursor position in input and insert there merge field
   * @param {string} addonValue merge field walue
   */
  @autobind handleSubjectSelect(addonValue) {
    const { item, changeValue } = this.props.store.EmailFormState;
    const input = this.inputs.subject;
    input.focus();
    const cursorPosition = input.selectionStart;
    input.blur();
    const newVal = `${item.subject.substr(0, cursorPosition)} {{${addonValue}}} ${item.subject.substr(cursorPosition)}`;
    changeValue('subject', newVal);
  }

  /**
   * Change body by DropdownButton handler
   * Takes last cursor position in input and insert there merge field
   * @param {string} addonValue merge field walue
   */
  @autobind handleBodySelect(addonValue) {
    const { item, changeValue } = this.props.store.EmailFormState;
    const input = this.inputs.editor;
    input.focus();
    const cursorPosition = input.getSelection().index;
    input.insertText(cursorPosition, ` {{${addonValue}}} `);
  }

  /**
   * handler to switch between edit and preview subviews.
   * @param {number} tabIndex index of clicked tab
   */
  @autobind handleTabChange(tabIndex) {
    const { item, setPreview } = this.props.store.EmailFormState;
    if (tabIndex === 0) {
      setPreview(null);
    } else {
      this.props.getPreview();
    }
  }

  /**
   * Separate getter for Email form
   */
  get dialogForm() {
    const {
      item, changeValue, clientValidationMessagesToShow,
    } = this.props.store.EmailFormState;
    const { subjectMergeFields, trainingMergeFields, bodyMergeFields,
      showAttachScreenshotsCheckbox, showAttachFilesCheckbox, showBcc, showCc,
      xssProtectionUrl,signature
    } = this.props;
    let showSubject;
    if(this.props.showSubject==undefined || this.props.showSubject==null){
     showSubject=true;
    }
    else{
      showSubject=this.props.showSubject;
    }
    return (
      <div>
        {!!showCc && (
          <FormGroup vertical label="Cc" labelAlign="baseline" value={item.cc}
            onChange={({ target }) => changeValue('cc', target.value)} />
        )}
        {showBcc && (
          <FormGroup vertical label="Bcc" labelAlign="baseline" value={item.bcc}
            onChange={({ target }) => changeValue('bcc', target.value)} />
        )}
        {showAttachScreenshotsCheckbox && (<FormGroup>
          <Input type="checkbox" label="Attach Screenshots"
            onChange={({ target }) => changeValue('include_attachments', target.checked)}
            checked={item.include_attachments} />
        </FormGroup>)}
        {showAttachFilesCheckbox && (<FormGroup>
          <Input type="checkbox" label="Attach Files" checked={item.include_files}
            onChange={({ target }) => changeValue('include_files', target.checked)} />
        </FormGroup>)}
        {!!showSubject && ( <div className="clearfix mt-10 mb-m5">
          <div className="f-r">
            {subjectMergeFields && (<DropdownButton size="small" status="black" options={subjectMergeFields}
              onOptionSelect={(val) => this.handleSubjectSelect(val)}>
              Subject
                </DropdownButton>)}
          </div>
        </div>)}
        {!!showSubject && (
        <FormGroup vertical label="Subject" labelAlign="baseline" value={item.subject}
          ref={group => { if (!!group) { this.inputs.subject = group.input } }}
          validationMessages={clientValidationMessagesToShow.subject}
          onChange={({ target }) => changeValue('subject', target.value)} />
        )}
        <div className="clearfix mt-10 mb-m5">
          <div className="f-r">
            {trainingMergeFields && (<DropdownButton size="small" status="black" options={trainingMergeFields}
              onOptionSelect={(val) => this.handleBodySelect(val)}>
              Training Modules
              </DropdownButton>)}
            {bodyMergeFields && (<DropdownButton size="small" status="black" options={bodyMergeFields}
              onOptionSelect={(val) => this.handleBodySelect(val)}>
              Body
              </DropdownButton>)}
          </div>
        </div>
        <FormGroup vertical label="Body" labelAlign="baseline" value={item.subject}
          validationMessages={clientValidationMessagesToShow.body}
          onChange={({ target }) => changeValue('body', target.value)}>
          <TextEditor value={item.body} onChange={(val) => changeValue('body', val)}
            signature={signature}
            invalid={!!clientValidationMessagesToShow.body}
            xssProtectionUrl={xssProtectionUrl}
            ref={editor => { if (!!editor) this.inputs.editor = editor.editor.editor }} />
        </FormGroup>
      </div>
    );
  }

  get dialogBody() {
    const { getPreview } = this.props;
    const { preview } = this.props.store.EmailFormState;

    if (!!getPreview) {
      return (
        <Tabs onSelect={this.handleTabChange}>
          <TabList>
            <Tab>Edit Email</Tab>
            <Tab>Preview</Tab>
          </TabList>
          <TabPanel>
            {this.dialogForm}
          </TabPanel>
          <TabPanel>
            {!!preview ? (
              <div>
                <div>
                  <strong>Subject:&nbsp;</strong>{preview.subject}
                </div>
                <div>
                  <strong>Body:</strong>
                  <div dangerouslySetInnerHTML={{ __html: preview.body }}></div>
                </div>
              </div>
            ) : (
                <Preloader />
              )}
          </TabPanel>
        </Tabs>
      );
    }

    return (
      this.dialogForm
    );
  }

  render() {
    const { item } = this.props.store.EmailFormState;
    const { onBack, onSend, showSendNavButtons } = this.props;
    return (
      <div>
        {showSendNavButtons && (
          <div className="f-r">
            <Button size="small" status="black" onClick={onBack}>
              back to list
            </Button>
            <Button size="small" onClick={() => onSend(item)}>
              send email
          </Button>
          </div>
        )}
        {this.dialogBody}
      </div>
    );
  }
}
