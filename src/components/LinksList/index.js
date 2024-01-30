import React, { Component, createRef, Fragment } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import API from "Helpers/api";
import Paper from "Components/Paper";
import BindLinkToSingleSearchDialog from "./BindToSingleSearchDialog";
import Tooltip from "Components/Tooltip";
import processLinkUrl from "Helpers/processLinkUrl";
import { videoAudioFormats, matchYoutubeUrl } from "Constants/video";
import WarningDialog from 'Components/WarningDialog';
import LinksListItem from "./LinksListItem";
import LinksForm from "./form";

export default class LinksList extends Component {
  static propTypes = {
    linkAsObject: PropTypes.bool,
  };

  static defaultProps = {
    links: [],
    linkAsObject: true,
  };

  state = {
    editUrlIndex: -1,
    urlToEdit: null,
    linkToBind: null,
    primaryPopUpState: false,
    secondaryPopUpState: false,
    tertiaryPopUpState: false,
    openTranscriptPopup: false,
    selectedLink: {},
    proceedWithExistingUrl: false,
    existingIncidents: []
  };

  constructor(props) {
    super(props);
    this.linkForm = createRef();
    props.store && props.store.IncidentState && props.store.IncidentState.setDuplicateLinkUrl(this.handleDuplicateLink);
  }

  getLinkIndex = (link) => {
    const { linkAsObject, links } = this.props;
    if (linkAsObject) {
      return links.findIndex(({ url_full }) => url_full === link.url_full);
    }
    return links.indexOf(link);
  };

  handleSetItemToEdit = async (url) => {
    const isTranscriptEditable = !!url.url && (videoAudioFormats.includes(url.url.toLowerCase().split('.').pop()) || matchYoutubeUrl(url.url));
    this.setState({ selectedLink: url, urlToEdit: url });
    if (isTranscriptEditable && await this.isTranscriptExist(url))
      this.setState({ openTranscriptPopup: true });
    else this.handleEditUrl(url);
    
  };

  handleEditUrl = (urlToEdit) => {
    const { linkAsObject } = this.props;
    let editUrlIndex = this.getLinkIndex(urlToEdit);
    this.setState(
      {
        editUrlIndex,
        urlToEdit: urlToEdit,
        formValue: linkAsObject ? urlToEdit.url : urlToEdit,
      },
      () => {
        this.linkForm.current.formInput.current.input.focus();
      }
    );
  }

  isUrlExist = (newUrl) => {
    const { linkAsObject, links } = this.props;
    if (linkAsObject) {
      return links.some(
        ({ url, url_full }) => url === newUrl || url_full === newUrl
      );
    }
    return links.indexOf(newUrl) > -1;
  };

  handleChangeEditValue = (formValue) => {
    this.setState({ formValue });
  };

  handleCancelUpdate = () => {
    this.setState({ editUrl: '', urlToEdit: null, formValue: '', editMode: false, editUrlIndex: -1 });
  }

  handleDuplicateLink = (removeDuplicateUrl = false, hits_url = []) => {
    const { onChange, links, store } = this.props;
    const { IncidentState } = store;
    const { editUrlIndex, urlToEdit, formValue } = this.state;
    if (!formValue && !removeDuplicateUrl &&  hits_url.length > 0) {
      IncidentState.setLinks(hits_url);
      return;
    }
      const editUrl = (this.state.formValue || "").trim();
      const isUrlExist = this.isUrlExist(this.state.formValue);
      let res, finalLink;
      if (isUrlExist || removeDuplicateUrl) {
        this.setState({ editUrlIndex: -1, urlToEdit: null, formValue: "" });
        return;
      }
        finalLink = {
          ...urlToEdit,
          url: editUrl,
          status: 'draft',
          status_name: 'New',
          url_full: processLinkUrl(editUrl),
        };
  
      if (editUrlIndex === -1) {
        res = [...links, finalLink];
      } else {
        res = [].concat(
          links.slice(0, editUrlIndex),
          finalLink,
          links.slice(editUrlIndex + 1)
        );
      }
      this.setState({ formValue: "", editUrlIndex: -1, urlToEdit: null }, () => {
        onChange(res);
      });
  }

  deleteSelectedUrl = (url, isTranscriptDeletable = false) => {
    const { links, onDeleteTranscript } = this.props;
    const index = this.getLinkIndex(url);
    if (url.id) {
      this.props.onChange(
        [].concat(
          links.slice(0, index),
          { ...url, _destroy: true },
          links.slice(index + 1)
        )
      );
    } else {
      this.props.onChange(
        [].concat(links.slice(0, index), links.slice(index + 1))
      );
    }
    isTranscriptDeletable && onDeleteTranscript(url.url, 'link')
  }

  handleDestroyUrl = async (url) => {
    const isTranscriptDeletable = !!url.url && (videoAudioFormats.includes(url.url.toLowerCase().split('.').pop()) || matchYoutubeUrl(url.url));
    this.setState({ selectedLink: url, urlToEdit: null });
    if (isTranscriptDeletable && await this.isTranscriptExist(url))
      this.setState({ openTranscriptPopup: true });
    else this.deleteSelectedUrl(url);
  };

  isTranscriptExist = (url) => {
    const { checkTranscriptUrl, incident } = this.props;
    return API.post(checkTranscriptUrl, { 
      body: { link: url.url, incident_id: incident.id}
     }).then(({ data }) => {
      return data;
    });
  }

  onGetTranscript = async (url) => {
    const { uploadLinkUrl, incident, handleGetFileTranscribe, store } = this.props;
    const { IncidentState } = store;
    if (await this.isTranscriptExist(url)) {
      FW.flash({
        type: 'warning',
        text: 'Transcript Already Exist '
      });
      return;
    }
    if (matchYoutubeUrl(url.url)) {
      const link = JSON.parse(JSON.stringify(url));
      delete link.id;
      handleGetFileTranscribe(link, url);
      return;
    }

    IncidentState.changeProgress(60, url);
    API.post(uploadLinkUrl, 
      { 
        body: 
        {
         incident_id: incident.id,
         link: url.url
       }
     }
    ).then(({data}) => {
      IncidentState.changeProgress(80, url)
       handleGetFileTranscribe(data, url);
    })
  }

  handleOpenBindLinkDialog = (linkToBind) => {
    this.setState({ linkToBind });
  };

 
  handleSubmit = async (e) => {
    e.preventDefault();
    const { linkAsObject, links, onChange, fromReportedIncident, checkUrl } = this.props;
    const { formValue, editUrlIndex, urlToEdit } = this.state;
    let finalLink, res;
    if (!fromReportedIncident && await checkUrl(formValue)) {
      return;
    }

    const editUrl = (formValue || "").trim();
    const isUrlExist = this.isUrlExist(editUrl);
    if (isUrlExist) {
      this.setState({ editUrlIndex: -1, urlToEdit: null, formValue: "" });
      return;
    }
    if (linkAsObject) {
      finalLink = {
        ...urlToEdit,
        url: editUrl,
        status: 'draft',
        status_name: 'New',
        url_full: processLinkUrl(editUrl),
      };
    } else {
      finalLink = editUrl;
    }

    if (editUrlIndex === -1) {
      res = [...links, finalLink];
    } else {
      res = [].concat(
        links.slice(0, editUrlIndex),
        finalLink,
        links.slice(editUrlIndex + 1)
      );
    }
    this.setState({ formValue: "", editUrlIndex: -1, urlToEdit: null }, () => {
      onChange(res);
    });
  };

  closeTranscriptDialog = () => {
    this.setState({ openTranscriptPopup: false });
    return;
  }

  handleConfirmTranscriptPopup = () => {
    const { selectedLink, urlToEdit } = this.state;
    this.setState({ openTranscriptPopup: false }, () => {
      if(!urlToEdit) this.deleteSelectedUrl(selectedLink, true)
      else {
        this.props.onDeleteTranscript(selectedLink.url, 'link');
        this.handleEditUrl(selectedLink);
      }
    });
  }

  get visibleLinks() {
    const { links, linkAsObject } = this.props;
    if (linkAsObject) {
      return links.filter(({ url, _destroy }) => !!url && !_destroy);
    }
    return links.map((url) => {
      return { url, url_full: url };
    });
  }

  render() {
    const {
      disabled,
      singleUrlQueriesPath,
      bindUrlPath,
      editMode,
      onChange,
      linkAsObject,
      blockTitle,
      addButtonText,
      validationMessages,
      required,
      onLinkStatusChange
    } = this.props;
    const { formValue, urlToEdit, linkToBind, primaryPopUpState, secondaryPopUpState, tertiaryPopUpState, openTranscriptPopup } = this.state;

    return (
      <Fragment>
        <WarningDialog key="warning-dialog-transcript" isOpen={openTranscriptPopup}
          text={`Are you sure, you want to ${urlToEdit ? 'edit' : 'delete'} this as generated transcription from this link will also be deleted?`}
          onClose = {this.closeTranscriptDialog}
          onConfirm = {this.handleConfirmTranscriptPopup}
          btnTextYes={'Yes'} btnTextNo={'Cancel'} />

        <Tooltip body={validationMessages} type="validation-message">
          <Paper
            className={classnames({ "paper--invalid": !!validationMessages })}
          >
            <Paper.Header>
              <Paper.Title small>
                {blockTitle || "Links"}&nbsp;
                {required && (
                  <span className="fw-form-group__label--required">*</span>
                )}
              </Paper.Title>
            </Paper.Header>
            <Paper.Body>
              <div className="links-list">
                <ol
                  className={classnames("links-list__list", {
                    "links-list__list--edit": editMode,
                  })}
                >
                  {this.visibleLinks.map((url, index) => (
                    <LinksListItem
                      key={url.id || url.url}
                      url={url}
                      isEditMode={!!onChange}
                      disabled={disabled}
                      index={index}
                      onOpenBindDialog={this.handleOpenBindLinkDialog}
                      onLinkStatusChange={onLinkStatusChange}
                      canOpenSingleUrlDialog={singleUrlQueriesPath}
                      onEdit={(url) => this.handleSetItemToEdit(url)}
                      onDestroy={(url) => this.handleDestroyUrl(url)}
                      onGetTranscript={this.onGetTranscript}
                      store={this.props.store}
                    />
                  ))}
                </ol>
                {!!onChange && (
                  <LinksForm
                    onSubmit={this.handleSubmit}
                    disabled={disabled}
                    ref={this.linkForm}
                    primaryPopUp={primaryPopUpState}
                    linkAsObject={linkAsObject}
                    value={formValue}
                    placeholder={this.props.placeholder || "example.com"}
                    addButtonText={addButtonText || "Add"}
                    onChange={this.handleChangeEditValue}
                    onCancel={this.handleCancelUpdate}
                    mode={urlToEdit && !disabled ? "edit" : "new"}
                  />
                )}
                {!!singleUrlQueriesPath && (
                  <BindLinkToSingleSearchDialog
                    isOpen={!!linkToBind}
                    bindUrlPath={bindUrlPath}
                    linkToBind={linkToBind}
                    singleUrlQueriesPath={singleUrlQueriesPath}
                    onClose={() => {
                      this.handleOpenBindLinkDialog(null);
                    }}
                  />
                )}
              </div>
            </Paper.Body>
          </Paper>
        </Tooltip>
      </Fragment>
    );
  }
}
