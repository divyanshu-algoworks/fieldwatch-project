import React, { Fragment } from 'react';
import EmailDialog from './EmailDialog';
import FormGroup from 'Components/FormGroup';
import Input from 'Components/Input';
import ComponentWithMergeFields from 'Components/ComponentWithMergeFields';
import TextEditorWithMergeFields from 'Components/ComponentWithMergeFields/TextEditorWithMergeFields';
import Checkbox from 'Components/Input/Checkbox';
import TextEditor from 'Components/TextEditor';
import { toggleItemPresence } from 'Helpers/array';
import { CheckableScreenshot } from 'Components/CheckableScreenshot';
import API from 'Helpers/api';
import { checkRequired, validateEmail } from 'Helpers/validators';
import GAEvents from 'Constants/GAEvents';
import FilesList from 'Components/FilesList';
import Button from 'Components/Button';
import Preloader from 'Components/Preloader';
import SendTemplatesList from './SendTemplatesList';
import ComplianceDraftsList from './ComplianceDraftsList';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

/**
 * ComplianceEmailForm is component for sending Compliance emails dialog
 * Here is two subviews: list of emails (Components/EmailsList) and
 * EmailForm(Components/EmailForm)& By default will be displayed emails list.
 * When dialog will opened, there will be ajax request to get emails list. If
 * dialog opened by Reply button, then every emails subject vill replaced
 * by subject from replyAttrs prop.
 */
export default class SendComplianceEmailDialog extends EmailDialog {
  validators = {
    cc: validateEmail('cc'),
    bcc: validateEmail('bcc'),
    subject: checkRequired('subject')
  };

  handleChangeCc = ({ target }) => this.changeValue('cc', target.value);
  handleChangeBcc = ({ target }) => this.changeValue('bcc', target.value);
  handleChangeIncludeImages = ({ target }) =>
    this.changeValue('include_attachments', target.checked);
  handleChangeIncludeFiles = (e) => {
    const files_ids =
      e.target.checked && Array.isArray(this.props.files)
        ? this.props.files.map(({ id }) => id)
        : [];
    this.changeValue('files_ids', files_ids);
  };
  handleChangeIncludeTemplateFiles = (e) => {
    const attachment_ids =
      e.target.checked && Array.isArray(this.state.item.attachments)
        ? this.state.item.attachments.map(({ id }) => id)
        : [];
    this.changeValue('attachment_ids', attachment_ids);
  };
  handleChangeSubject = (subject) => this.changeValue('subject', subject);
  handleChangeBody = (body) => this.changeValue('body', body);
  setFormView = (item = { body: '', screenshot_ids: [], files_ids: [], isNew: false }, isDraftEdit = false) => {
    this.setState({
      item: {
        ...item,
        screenshot_ids: item.screenshot_ids || [],
        files_ids: item.files_ids || [],
        isNew: item.isNew
      },
      view: 'form',
      submitted: false,
      isDraftEdit
    });
  };

  handleChangeFiles = (data) => {
    this.changeValue(
      'files_ids',
      toggleItemPresence(this.state.item.files_ids, data)
    );
  };
  handleChangeTemplateFiles = (fileId) => {
    this.changeValue(
      'attachment_ids',
      toggleItemPresence(this.state.item.attachment_ids, fileId)
    );
  };
  get allFilesChecked() {
    if (!this.props.files || this.props.files.length == 0) {
      return false;
    }
    return this.props.files.length === this.state.item.files_ids.length;
  }
  handleChangeScreenshots = ({ id }) => {
    this.changeValue(
      'screenshot_ids',
      toggleItemPresence(this.state.item.screenshot_ids, id)
    );
  };

  get isAllTemplateFilesChecked(){
    if(!this.state.item.attachments || this.state.item.attachments.length === 0){
      return false;
    }
    
    return this.state.item.attachments.length === this.state.item.attachment_ids.length;
  }

  handleChangeAllScreenshotsChecked = ({ target }) => {
    const screenshot_ids = target.checked
      ? this.props.screenshots.map(({ id }) => id)
      : [];
    this.changeValue('screenshot_ids', screenshot_ids);
  };
  handleCreate = () => {
    const { replyAttrs } = this.state;
    this.setFormView({
      body: '',
      subject: replyAttrs ? replyAttrs.subject : '',
      isNew: true
    });
  };
  
  handleDraftCreate = () => {
    this.setFormView({
      body: '',
      subject: ''
    });
  }

  handleSend = (compliance_action = this.state.item) => {
    const {
      sendUrl,
      additionEmailProps,
      onSuccessSend,
      analytics_key,
      current_user_role,
    } = this.props;
    const { replyAttrs } = this.state;
    this.setState({ pending: true });
    let body = {
      compliance_action,
      ...additionEmailProps,
    };
    if (!!replyAttrs) {
      body.in_reply_to = replyAttrs.message_id;
    }
    API.post(sendUrl, {
      body,
    }).then(() => {
      this.setState({ pending: false });
      this.close();
      if (!!onSuccessSend) {
        onSuccessSend(compliance_action);
      }
    });
    GAEvents.actions(
      'Incidents',
      analytics_key,
      current_user_role.id,
      'Compliance Action Email'
    );
  };

  handleSaveDraft = () => {
    this.setSubmitted();
    if (!this.isFormValid) {
      return;
    }

    const { draftsUrl, additionEmailProps } = this.props;
    const { replyAttrs, item, isDraftEdit } = this.state;
    this.setState({ pending: true });
    let body = {
      draft: {
        ...item,
        ...additionEmailProps,
      },
    };
    if (!!replyAttrs) {
      body.in_reply_to = replyAttrs.message_id;
    }

    const httpMethod = isDraftEdit ? 'put' : 'post';
    const url = isDraftEdit ? `${draftsUrl}/${item.id}` : draftsUrl;
    
    API[httpMethod](url, {
    body,
    }).then(() => {
      this.setState({ pending: false, pendingDrafts:true, view: 'list', preview: null, item: {} });
      API.get(this.props.draftsUrl).then(this.onFetchDrafts);
    });
    
  };

  onDeleteDraft = (draftID) => {
    this.setState({ pending: true });
    API.delete(`${this.props.draftsUrl}/${draftID}`).then(() => {
      this.setState({pendingDrafts: true, pending: false});
      API.get(this.props.draftsUrl).then(this.onFetchDrafts);
    })
  }

  onFetchItems = (data) => {
    let items;
    const { replyAttrs } = this.state;
    if (!!replyAttrs) {
      items = data.compliance_actions.map((action) => {
        return {
          ...action,
          subject: replyAttrs.subject,
        };
      });
    } else {
      items = data.compliance_actions;
    }

    this.setState({
      items,
      pendingTemplates: false,
      pending: false,
      bodyMergeFields: data.body_merge_fields,
      subjectMergeFields: data.subject_merge_fields,
    });
  };

  onFetchDrafts = (data) => {
    let drafts;
    const { replyAttrs } = this.state;
    if (!!replyAttrs) {
      drafts = data.data.map((draft) => {
        return {
          ...draft,
          draft_id: draft.id,
          subject: replyAttrs.subject,
        };
      });
    } else {
      drafts = data.data.map((draft) => {
        return {
          ...draft,
          draft_id: draft.id,
        };
      });
    }

    this.setState({
      drafts,
      pendingDrafts: false,
      pending: false,
      bodyMergeFields: data.body_merge_fields,
      subjectMergeFields: data.subject_merge_fields,
    });
  }

  getEmailPreview = () => {
    const { item } = this.state;
    const url = this.props.previewUrl;
    API.post(url, {
      body: {
        subject: item.subject,
        body: item.body,
      },
    }).then((data) => {
      this.setState({ preview: data });
    });
  };

  get allScreenshotsChecked() {
    return (
      this.props.screenshots.length === this.state.item.screenshot_ids.length
    );
  }

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
        const removeN = data.replaceAll('\n', '');
        const removeBr = removeN.replaceAll(<br/>,'');
        data = removeBr;
        this.changeValue('body', data, this.handleSubmit);
      } else {
        this.setState({ pending: false });
      }
    });
  };

  get navButtons() {
    return (
      <Fragment>
        {
          this.props.showDraftsTab && <Button size="small" status="red" onClick={this.handleSaveDraft}>
          save as a draft
        </Button>
        }
        <Button size="small" status="black" onClick={(e) => {this.setListView(e), this.handleTabChange(0)}}>
          back to list
        </Button>
        <Button size="small" onClick={this.handleSubmitXSS}>
          send email
        </Button>
      </Fragment>
    );
  }

  get body() {
    const { pendingTemplates, pendingDrafts, pending, view, items, listSelectedTabIndex,drafts } = this.state;
    if (pendingDrafts || pendingTemplates || pending) {
      return <Preloader />;
    }

    if (view === 'list') {
      if(this.props.showDraftsTab){
        return (
          <Tabs selectedIndex={listSelectedTabIndex} onSelect={this.handleListTabChange}>
            <TabList>
              <Tab>Templates</Tab>
              <Tab>Drafts</Tab>
            </TabList>
            <TabPanel>
              <SendTemplatesList
                items={items}
                onPreview={!!this.props.canPreview && this.getItemPreview}
                onCreate={this.handleCreate}
                onSend={this.handleSend}
                onEdit={!!this.props.canEdit && this.setFormView}
                analytics_key={this.props.analytics_key}
                current_user_role={this.props.current_user_role}
              />
            </TabPanel>
            <TabPanel>
              <ComplianceDraftsList
                drafts={drafts}
                onCreate={this.handleDraftCreate}
                onSend={this.handleSend}
                onEdit={this.setFormView}
                onDelete={this.onDeleteDraft}
              />
            </TabPanel>
          </Tabs>
        );
      }
    else{
      return (
        <SendTemplatesList
          items={items}
          onPreview={!!this.props.canPreview && this.getItemPreview}
          onCreate={this.handleCreate}
          onSend={this.handleSend}
          onEdit={!!this.props.canEdit && this.setFormView}
          analytics_key={this.props.analytics_key}
          current_user_role={this.props.current_user_role}
        />
      )
    }
    }
    if (view === 'form') {
      return this.form;
    }

    if (view === 'itemPreview') {
      return this.itemPreview;
    }
  }

  get formBody() {
    const { item, emailData } = this.state;
    const { screenshots, files } = this.props;
    const {
      action_type,
      data,
      compliance_email_history,
      created_at
    } = emailData;
    return (
      <form onSubmit={this.handleSubmitXSS}>
        {!!this.props.noPreview && (
          <div className="ta-r">{this.navButtons}</div>
        )}
        <div className="clearfix"></div>
        <FormGroup
          label="Cc"
          vertical
          labelAlign="baseline"
          validationMessages={this.validationMessages.cc}
        >
          <Input
            value={item.cc || ''}
            className="w-100p"
            onChange={this.handleChangeCc}
            invalid={!!this.validationMessages.cc}
          />
        </FormGroup>
        <FormGroup
          label="Bcc"
          vertical
          labelAlign="baseline"
          validationMessages={this.validationMessages.bcc}
        >
          <Input
            value={item.bcc || ''}
            className="w-100p"
            onChange={this.handleChangeBcc}
            invalid={!!this.validationMessages.bcc}
          />
        </FormGroup>
        {(!!screenshots && !!screenshots.length) ? (
          <div className="grid mt-10">
            <div className="grid__row">
              <div className="grid__col grid__12">
                <Checkbox
                  label="Attach All Screenshots"
                  checked={this.allScreenshotsChecked}
                  onChange={this.handleChangeAllScreenshotsChecked}
                  className="compliance-emails-checkbox-label"
                />
              </div>
            </div>
            <div className="grid__row">
              <div className="checkeable-screenchots">
                {screenshots.map((screenshot) => (
                  <CheckableScreenshot
                    key={screenshot.id}
                    className="grid__col grid__col--4"
                    item={screenshot}
                    checked={item.screenshot_ids.indexOf(screenshot.id) > -1}
                    onChange={this.handleChangeScreenshots}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
        {/* {!screenshots && (
          <FormGroup>
            <Checkbox
              label="Attach Screenshots"
              onChange={this.handleChangeIncludeImages}
              checked={item.include_attachments || false}
            />
          </FormGroup>
        )} */}
        {
          (files && files.length) ? (
            <div className="mt-45">
              <FormGroup>
              <Input
                type="checkbox"
                label="Attach All Incident Files"
                checked={this.allFilesChecked || false}
                onChange={(e) => {
                  this.handleChangeIncludeFiles(e);
                }}
                className="compliance-emails-checkbox-label"
              />
            </FormGroup>
            <div className="mt-10 ml-28">
                <p>Files</p>
                {files.map((file) => (
                  <FormGroup key={file.id}>
                    <Checkbox
                      label={file.name}
                      style={{ display: 'block' }}
                      checked={item.files_ids.indexOf(file.id) > -1}
                      onChange={(e) => {
                        this.handleChangeFiles(file.id);
                      }}
                    />
                  </FormGroup>
                ))}
              </div>
            </div>
          ) : null
        }
        {
          (item.attachments && item.attachments.length) ? (
            <div className="mt-45">
              <FormGroup>
                <Input
                  type="checkbox"
                  label="Attach All Template Files"
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
            { title: 'Subject', fields: this.state.subjectMergeFields },
          ]}
        />
        <TextEditorWithMergeFields
          label="Body"
          onChange={this.handleChangeBody}
          validationMessages={this.validationMessages.body}
          inputComponent={TextEditor}
          value={item.body}
          mergeFields={[{ title: 'Body', fields: this.state.bodyMergeFields }]}
        />
        {data && compliance_email_history && 
         <div>
          <hr/>
          <div className='mt-20'>
            <p><b>From:</b> {data.from_email}</p>
            { data.recipient_email && <p><b>To:</b> {data.recipient_email}</p>}
            { data.cc && <p><b>cc:</b> {data.cc}</p>}
            { data.bcc && <p><b>bcc:</b> {data.bcc}</p>}
            <p><b>Date:</b> {created_at}</p>
            {compliance_email_history && compliance_email_history.subject && <p><b>Subject:</b> {compliance_email_history.subject}</p>}
            {compliance_email_history && compliance_email_history.body && <p><b>Body:</b> <span className="li_underline" dangerouslySetInnerHTML={{ __html: compliance_email_history ? compliance_email_history.body: '' }} /></p>}
         </div>
         </div>
        }
      </form>
    );
  }
}
