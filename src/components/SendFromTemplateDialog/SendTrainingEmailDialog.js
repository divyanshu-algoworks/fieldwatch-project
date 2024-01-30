import React from "react";
import EmailDialog from "./EmailDialog";
import FormGroup from "Components/FormGroup";
import Input from "Components/Input";
import ComponentWithMergeFields from "Components/ComponentWithMergeFields";
import TextEditorWithMergeFields from "Components/ComponentWithMergeFields/TextEditorWithMergeFields";
import TextEditor from "Components/TextEditor";
import API from "Helpers/api";
import {
  TrainingSubjectMergeFields,
  TrainingBodyMergeFields,
} from "Constants/MergeFields";
import TrainingPreview from "./TrainingPreview";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { validateEmail } from "Helpers/validators";
import Preloader from "Components/Preloader";
import SendTemplatesList from "./SendTemplatesList";
import InfiniteScroll from "react-infinite-scroller";
import ComplianceDraftsList from "./ComplianceDraftsList";
import Checkbox from "Components/Input/Checkbox";
import { CheckableScreenshot } from "Components/CheckableScreenshot";
import { toggleItemPresence } from "Helpers/array";
export default class SendTrainingEmailDialog extends EmailDialog {
  state = {
    isOpen: false,
    view: "list",
    pending: false,
    item: {},
    preview: {},
    serverErrors: {},
    hasMore: true,
    isDraftEdit: false,
    items: [],
  };

  validators = {
    cc: validateEmail("cc"),
  };

  sizePerPage = 15;

  handleCreate = null;

  handleChangeCc = ({ target }) => this.changeValue("cc", target.value);
  handleChangeSubject = (subject) => this.changeValue("email_subject", subject);
  handleChangeBody = (body) => this.changeValue("email_body", body);

  handleSend = (emailToSend = this.state.item) => {
    const { representative, incident, onSuccessSend, handleSend } = this.props;
    this.setState({ pending: true });
    if (!!handleSend) {
      handleSend(emailToSend);
      return;
    }
    const url = `${this.props.sendUrl}/${emailToSend.id}/send_link_to_representative`;
    let { ...training } = emailToSend;
    const final_training = {
      ...training,
      id: training && training.training_id ? training.training_id : training.id,
      attachment_ids: training.attachments.map(({ id }) => id),
    };
    API.post(url, {
      body: {
        ...(!!representative && { representative_id: representative.id }),
        ...(!!incident && { incident_id: incident.id }),
        training: final_training,
      },
    }).then(
      () => {
        this.setState({ pending: false });
        this.close();
        onSuccessSend(emailToSend);
      },
      () => {
        this.setState({ pending: false });
        this.close();
      }
    );
  };

  getItemPreview = (item = this.state.item) => {
    const { id, email_body, email_subject, cc } = item;
    const { tab, emailsUrl, itemsUrl } = this.props;
    let body;
    let url;
    let method = "get";
    if (tab === "field-training-email") {
      const previewParam = this.props.previewParams();
      method = "post";
      url = `${emailsUrl}/${id}/preview`;
      body = {
        email_body,
        email_subject,
        cc,
        ...previewParam,
      };
    } else url = `${itemsUrl}/${id}/show_training_preview`;
    this.setState({ pending: true });
    API[method](url, {
      body: body,
    }).then(({ data }) => {
      this.setState({ pending: false, preview: data, view: "itemPreview" });
    });
  };

  getEmailPreview = () => {
    const { item } = this.state;
    let url;
    if (item.draft_id) url = `${this.props.draftsUrl}/${item.id}/preview`;
    else url = `${this.props.sendUrl}/${item.id}/preview`;
    API.post(url, {
      body: {
        subject: item.email_subject,
        body: item.email_body,
        incident_id: this.props.incident.id,
      },
    }).then((preview) => {
      this.setState({ preview });
    });
  };

  getFieldTrainingEmailPreview = () => {
    const { item } = this.state;
    const previewParam = this.props.previewParams();
    let url = `${this.props.draftsUrl}/${item.id}/preview`;
    if (!item.draft_id) url = `${this.props.emailsUrl}/${item.id}/preview`;
    API.post(url, {
      body: {
        email_subject: item.email_subject,
        email_body: item.email_body,
        cc: item.cc,
        ...previewParam,
      },
    }).then((preview) => {
      this.setState({ preview });
    });
  };

  open = () => {
    this.setState({ isOpen: true, view: "list" }, () => {
      this.fetchDrafts();
    });
  };

  fetchItems = async (page) => {
    const url = `${this.props.templatesUrl}&size_per_page=${this.sizePerPage}&page=${page}`;
    API.get(url).then(({ data, recordsTotal }) => {
      const items = [...this.state.items, ...data];
      this.setState({
        items,
        hasMore: recordsTotal > items.length,
      });
    });
  };

  fetchDrafts = () => {
    if (this.props.draftsUrl)
      API.get(this.props.draftsUrl).then(this.onFetchDrafts);
  };

  onDeleteDraft = (draftID) => {
    const { replyAttrs, item, isDraftEdit } = this.state;
    this.setState({ pending: true });
    API.delete(`${this.props.draftsUrl}/${draftID}`).then(() => {
      this.setState({ pendingDrafts: true, pending: false });
      this.fetchDrafts();
    });
  };

  get itemPreview() {
    return (
      <TrainingPreview preview={this.state.preview} onBack={this.setListView} />
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
    const { email_body } = this.state.item;
    this.setState({ pending: true });
    API.post(xssProtectionUrl, {
      body: {
        body: email_body,
      },
    }).then(({ data }) => {
      if (data) {
        this.changeValue("email_body", data, this.handleSubmit);
      } else {
        this.setState({ pending: false });
      }
    });
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
      training_draft: {
        ...item,
        name: item.title,
        ...additionEmailProps,
        training_id: item.draft_id ? item.training_id : item.id,
      },
    };
    if (!!replyAttrs) {
      body.in_reply_to = replyAttrs.message_id;
    }

    const httpMethod = item.draft_id ? "patch" : "post";
    const url = item.draft_id ? `${draftsUrl}/${item.draft_id}` : draftsUrl;

    API[httpMethod](url, {
      body,
    }).then(() => {
      this.setState({
        pending: false,
        pendingDrafts: true,
        view: "list",
        preview: null,
        item: {},
      });
      this.fetchDrafts();
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
  };

  get allScreenshotsChecked() {
    return (
      this.props.screenshots.length === this.state.item.screenshot_ids.length
    );
  }

  handleChangeAllScreenshotsChecked = ({ target }) => {
    const screenshot_ids = target.checked
      ? this.props.screenshots.map(({ id }) => id)
      : [];
    this.changeValue("screenshot_ids", screenshot_ids);
  };

  handleChangeScreenshots = ({ id }) => {
    this.changeValue(
      "screenshot_ids",
      toggleItemPresence(this.state.item.screenshot_ids, id)
    );
  };

  get isAllTemplateFilesChecked() {
    if (
      !this.state.item.attachments ||
      this.state.item.attachments.length === 0
    ) {
      return false;
    }

    return (
      this.state.item.attachments.length ===
      this.state.item.attachment_ids.length
    );
  }

  setFormView = (
    item = { body: "", screenshot_ids: [], files_ids: [] },
    isDraftEdit = false
  ) => {
    this.setState({
      item: {
        ...item,
        attachment_ids: item.attachments.map(({ id }) => id),
        screenshot_ids: item.screenshot_ids || [],
        files_ids: item.files_ids || [],
      },
      view: "form",
      submitted: false,
      //isDraftEdit: true,
    });
  };

  handleCreate = () => {
    const { replyAttrs } = this.state;
    this.setFormView({
      body: "",
      subject: replyAttrs ? replyAttrs.subject : "",
    });
  };

  handleDraftCreate = () => {
    this.setFormView({
      body: "",
      subject: "",
    });
  };

  get allFilesChecked() {
    if (!this.props.files || this.props.files.length == 0) {
      return false;
    }
    return this.props.files.length === this.state.item.files_ids.length;
  }

  handleChangeIncludeFiles = (e) => {
    const files_ids =
      e.target.checked && Array.isArray(this.props.files)
        ? this.props.files.map(({ id }) => id)
        : [];
    this.changeValue("files_ids", files_ids);
  };

  handleChangeIncludeTemplateFiles = (e) => {
    const attachment_ids =
      e.target.checked && Array.isArray(this.state.item.attachments)
        ? this.state.item.attachments.map(({ id }) => id)
        : [];
    this.changeValue("attachment_ids", attachment_ids);
  };

  handleChangeFiles = (data) => {
    this.changeValue(
      "files_ids",
      toggleItemPresence(this.state.item.files_ids, data)
    );
  };

  handleChangeTemplateFiles = (fileId) => {
    this.changeValue(
      "attachment_ids",
      toggleItemPresence(this.state.item.attachment_ids, fileId)
    );
  };

  get formBody() {
    const { item } = this.state;
    const { screenshots, files } = this.props;
    return (
      <form onSubmit={this.handleSubmitXSS}>
        <FormGroup
          label="Cc"
          vertical
          labelAlign="baseline"
          validationMessages={this.validationMessages.cc}
        >
          <Input
            value={item.cc}
            className="w-100p"
            invalid={!!this.validationMessages.cc}
            onChange={this.handleChangeCc}
          />
        </FormGroup>
        {!!screenshots && !!screenshots.length ? (
          <div className="grid mt-20">
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
        {files && files.length ? (
          <div className="mt-45">
            <FormGroup>
              <Input
                type="checkbox"
                label="Attach All Files"
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
                    style={{ display: "block" }}
                    checked={item.files_ids.indexOf(file.id) > -1}
                    onChange={(e) => {
                      this.handleChangeFiles(file.id);
                    }}
                  />
                </FormGroup>
              ))}
            </div>
          </div>
        ) : null}
        <ComponentWithMergeFields
          label="Subject"
          onChange={this.handleChangeSubject}
          validationMessages={this.validationMessages.subject}
          value={item.email_subject}
          mergeFields={[
            { title: "Subject", fields: TrainingSubjectMergeFields },
          ]}
        />
        <TextEditorWithMergeFields
          label="Body"
          onChange={this.handleChangeBody}
          validationMessages={this.validationMessages.body}
          inputComponent={TextEditor}
          value={item.email_body}
          mergeFields={[{ title: "Body", fields: TrainingBodyMergeFields }]}
        />
        {item.attachments && item.attachments.length ? (
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
                    style={{ display: "block" }}
                    checked={item.attachment_ids.indexOf(file.id) > -1}
                    onChange={() => {
                      this.handleChangeTemplateFiles(file.id);
                    }}
                  />
                </FormGroup>
              ))}
            </div>
          </div>
        ) : null}
      </form>
    );
  }

  get body() {
    const { pending, view, items, hasMore, listSelectedTabIndex, drafts } =
      this.state;
    if (!!pending) {
      return <Preloader />;
    }

    if (view === "list") {
      return (
        <InfiniteScroll
          pageStart={0}
          loadMore={this.fetchItems}
          hasMore={hasMore}
          useWindow={false}
          loader={<Preloader key={0} />}
        >
          {this.props.showDraftsTab ? (
            <Tabs
              selectedIndex={listSelectedTabIndex || 0}
              onSelect={this.handleListTabChange}
            >
              <TabList>
                <Tab>Templates</Tab>
                <Tab>Drafts</Tab>
              </TabList>
              <TabPanel>
                <SendTemplatesList
                  items={items}
                  onPreview={!!this.props.canPreview && this.getItemPreview}
                  //onCreate={this.handleCreate}
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
          ) : (
            <SendTemplatesList
              items={items}
              onPreview={!!this.props.canPreview && this.getItemPreview}
              //onCreate={this.handleCreate}
              onSend={this.handleSend}
              onEdit={!!this.props.canEdit && this.setFormView}
              analytics_key={this.props.analytics_key}
              current_user_role={this.props.current_user_role}
            />
          )}
        </InfiniteScroll>
      );
    }
    if (view === "form") {
      return this.form;
    }

    if (view === "itemPreview") {
      return this.itemPreview;
    }
  }
}
