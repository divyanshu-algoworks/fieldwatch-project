import React from 'react';
import EmailDialog from './EmailDialog';
import Button from 'Components/Button';
import ComponentWithMergeFields from 'Components/ComponentWithMergeFields';
import TextEditorWithMergeFields from 'Components/ComponentWithMergeFields/TextEditorWithMergeFields';
import TextEditor from 'Components/TextEditor';
import API from 'Helpers/api';
import FormGroup from 'Components/FormGroup';
import Input from 'Components/Input';
import Checkbox from 'Components/Input/Checkbox';
import { toggleItemPresence } from 'Helpers/array';
export default class SendComplianceEmailDialog extends EmailDialog {
  validators = {};

  open = () =>
    this.setState({ isOpen: true, view: 'list', items: this.props.templates });

  handleChangeSubject = (subject) => this.changeValue('subject', subject);
  handleChangeBody = (body) => this.changeValue('body', body);
  handleChangeIncludeTemplateFiles = (e) => {
    const attachment_ids =
      e.target.checked && Array.isArray(this.state.item.attachments)
        ? this.state.item.attachments.map(({ id }) => id)
        : [];
    this.changeValue('attachment_ids', attachment_ids);
  };
  handleChangeTemplateFiles = (fileId) => {
    this.changeValue(
      'attachment_ids',
      toggleItemPresence(this.state.item.attachment_ids, fileId)
    );
  };
  handleCreate = () => {
    const { replyAttrs } = this.state;
    this.setFormView({
      body: '',
      subject: replyAttrs ? replyAttrs.subject : '',
    });
  };

  handleSend = ({ id, subject, body, attachment_ids } = this.state.item) => {
    const { onSendEmail } = this.props;
    const args = { subject, body, attachment_ids };
    this.setState({ pending: true });
    if (!!id) {
      args[id] = id;
    }
    onSendEmail(args).then(this.close);
  };

  handleSubmitXSS = (e) => {
    if (!!e) {
      e.preventDefault();
    }
    this.setSubmitted();
    if (!this.isFormValid) {
      return;
    }

    const { xssProtectionUrl } = this.props;
    const { body } = this.state.item;
    this.setState({ pending: true });
    API.post(xssProtectionUrl, {
      body: {
        body,
      },
    }).then(({ data }) => {
      if (data) {
        this.changeValue('body', data, this.handleSubmit);
      } else {
        this.setState({ pending: false });
      }
    });
  };

  get isAllTemplateFilesChecked(){
    if(!this.state.item.attachments || this.state.item.attachments.length === 0){
      return false;
    }
    
    return this.state.item.attachments.length === this.state.item.attachment_ids.length;
  }

  get form() {
    const { item } = this.state;

    return (
      <form onSubmit={this.handleSubmitXSS}>
        <div className="ta-r mb-10">
          <Button size="small" status="black" onClick={this.setListView}>
            back to list
          </Button>
          <Button size="small" type="submit">
            send email
          </Button>
        </div>
        {
          (item.attachments && item.attachments.length) ? (
            <div className="mt-45">
              <FormGroup>
                <Input
                  type="checkbox"
                  label="Attach All Files"
                  checked={this.isAllTemplateFilesChecked || false}
                  onChange={(e) => {
                    this.handleChangeIncludeTemplateFiles(e);
                  }}
                  className="compliance-emails-checkbox-label"
                />
              </FormGroup>
              <div className="mt-10 ml-28">
                <p>Files</p>
                {item.attachments.map((file) => (
                  <FormGroup key={file.id}>
                    <Checkbox
                      label={file.name}
                      style={{ display: 'block' }}
                      checked={item.attachment_ids.indexOf(file.id) > -1}
                      onChange={() => {
                        this.handleChangeTemplateFiles(file.id);
                      }}
                    />
                  </FormGroup>
                ))}
              </div>
            </div>
          ) : null
        }
        <ComponentWithMergeFields
          label="Subject"
          onChange={this.handleChangeSubject}
          validationMessages={this.validationMessages.subject}
          value={item.subject || ''}
          mergeFields={[
            { title: 'Subject', fields: this.props.subjectMergeFields },
          ]}
        />
        <TextEditorWithMergeFields
          label="Body"
          onChange={this.handleChangeBody}
          validationMessages={this.validationMessages.body}
          inputComponent={TextEditor}
          value={item.body}
          mergeFields={[{ title: 'Body', fields: this.props.bodyMergeFields }]}
        />
      </form>
    );
  }
}
