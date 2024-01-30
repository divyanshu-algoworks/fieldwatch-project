import React from "react";
import PropTypes from "prop-types";
import API from "Helpers/api";
import CommonForm from "Components/CommonForm";
import Dialog from "Components/Dialog";
import Button from "Components/Button";
import Preloader from "Components/Preloader";
import SendTemplatesList from "./SendTemplatesList";

export default class SendFromTemplateDialog extends CommonForm {
  state = {
    isOpen: false,
    view: "list",
    pending: false,
    item: {},
    preview: {},
    serverErrors: {},
    formSelectedTabIndex: 0,
    listSelectedTabIndex: 0,
    pendingTemplates: false,
    pendingDrafts: false,
    isDraftEdit: false,
  };

  static propTypes = {
    /** Dialog title */
    title: PropTypes.string,
    /** url to fetch templates */
    templatesUrl: PropTypes.string,
    /** Merge fields for template body */
    onSuccessSend: PropTypes.func,
    /** if true, in templates list will be Edit button */
    canEdit: PropTypes.bool,
    /** If true, in templates list will be Preview button */
    canPreview: PropTypes.bool,
  };

  static defaultProps = {
    canEdit: true,
    canPreview: true,
  };

  validators = {};

  open = (replyAttrs = null, emailData = {}) => {
    this.fetchItems();
    this.setState({ isOpen: true, view: "list", replyAttrs, emailData });
  };

  close = () => this.setState({ isOpen: false, pending: false });

  fetchItems = () => {
    this.setState({
      pending: true,
      pendingTemplates: true,
      pendingDrafts: this.props.showDraftsTab ? true : false,
    });
    API.get(this.props.templatesUrl).then(this.onFetchItems);
    if (this.props.showDraftsTab && this.onFetchDrafts) {
      API.get(this.props.draftsUrl).then(this.onFetchDrafts);
    }
  };

  onFetchItems = ({ data }) => {
    this.setState({ items: data, pending: false });
  };

  setFormView = (item = { body: "" }) => {
    this.setState({ item, view: "form", submitted: false });
  };

  setListView = () =>
    this.setState({
      view: "list",
      preview: null,
      item: {},
      isDraftEdit: false,
    });
  handleCreate = () => this.setFormView();

  handleListTabChange = (tabIndex) => {
    this.setState({
      listSelectedTabIndex: tabIndex,
    });
  };

  handleSubmit = (e) => {
    if (!!e) {
      e.preventDefault();
    }
    if (!!this.state.submitDisabled) {
      return;
    }
    this.setSubmitted();
    if (!this.isFormValid) {
      return;
    }
    this.handleSend();
  };

  get body() {
    const { pending, view, items } = this.state;
    if (!!pending) {
      return <Preloader />;
    }

    if (view === "list") {
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
      );
    }
    if (view === "form") {
      return this.form;
    }

    if (view === "itemPreview") {
      return this.itemPreview;
    }
  }

  render() {
    const { title } = this.props;
    const { isOpen, item } = this.state;
    return (
      <Dialog isOpen={isOpen} onClose={this.close}>
        <Dialog.Header onClose={this.close}>
          {title}
          {(!!item.title || !!item.name) && (
            <span>
              &nbsp;–&nbsp;
              <span className="c-orange">{item.title || item.name}</span>
            </span>
          )}
        </Dialog.Header>
        <Dialog.Body>{this.body}</Dialog.Body>
        <Dialog.Footer>
          <Button status="black" onClick={this.close}>
            Cancel
          </Button>
        </Dialog.Footer>
      </Dialog>
    );
  }
}
