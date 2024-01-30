import React, { Fragment } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Preloader from "Components/Preloader";
import Button from "Components/Button";
import Common from "./Common";

export default class EmailDialog extends Common {
  handleChangeCc = ({ target }) => this.changeValue("cc", target.value);
  handleChangeSubject = (subject) => this.changeValue("email_subject", subject);
  handleChangeBody = (body) => this.changeValue("email_body", body);

  handleTabChange = (tabIndex) => {
    if (tabIndex === 0) {
      this.setState({ preview: null, formSelectedTabIndex: tabIndex });
    } else {
      this.setState({
        formSelectedTabIndex: tabIndex,
      });
      if (this.props.tab == "training-email") {
        this.getEmailPreview();
      }
      if (this.props.tab == "field-training-email") {
        this.getFieldTrainingEmailPreview();
      }
      if (!this.props.tab) {
        this.getEmailPreview();
        return;
      }
    }
  };

  get navButtons() {
    return (
      <Fragment>
        {this.props.showDraftsTab && (
          <Button size="small" status="red" onClick={this.handleSaveDraft}>
            save as a draft
          </Button>
        )}
        <Button
          size="small"
          status="black"
          onClick={(e) => {
            this.setListView(e), this.handleTabChange(0);
          }}
        >
          back to list
        </Button>
        <Button size="small" onClick={this.handleSubmitXSS}>
          send email
        </Button>
      </Fragment>
    );
  }

  get form() {
    const { preview, formSelectedTabIndex, item } = this.state;
    if (this.props.noPreview) {
      return this.formBody;
    }
    return (
      <Tabs
        onSelect={this.handleTabChange}
        selectedIndex={formSelectedTabIndex || 0}
      >
        <div className="f-r mb-10">{this.navButtons}</div>
        <TabList>
          <Tab>{item.isNew ? 'New Email' : 'Edit Email'}</Tab>
          <Tab>Preview</Tab>
        </TabList>
        <TabPanel>{this.formBody}</TabPanel>
        <TabPanel>
          {!!preview ? (
            <div>
              <div>
                <strong>Subject:&nbsp;</strong>
                {preview.subject}
              </div>
              <div>
                <strong>Body:</strong>
                <div
                  dangerouslySetInnerHTML={{ __html: preview.message }}
                ></div>
              </div>
            </div>
          ) : (
            <Preloader />
          )}
        </TabPanel>
      </Tabs>
    );
  }
}
