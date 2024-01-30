import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Tooltip from 'Components/Tooltip';
import Button from 'Components/Button';
import ProgressBar from 'Components/ProgressBar';
import { videoAudioFormats, matchYoutubeUrl } from "Constants/video";

class LinksListItem extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    isEditMode: PropTypes.bool,
    onOpenBindDialog: PropTypes.func,
    onEdit: PropTypes.func,
    onDestroy: PropTypes.func,
    url: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        url: PropTypes.string,
        url_full: PropTypes.string,
        _delete: PropTypes.bool,
      }),
    ]),
  };
  capitalizeFirstLetter = (str) =>  {
    return str[0].toUpperCase() + str.slice(1);
  }
  handleClickOpenBindDialog = () => this.props.onOpenBindDialog(this.props.url);
  handleClickEdit = () => this.props.onEdit(this.props.url);
  handleClickDestroy = () => this.props.onDestroy(this.props.url);
  handleLinkStatusChange = () => this.props.onLinkStatusChange(this.props.url);
  showStatus = (str) => {
    if(!str) return 'New';
    return str.includes("_") 
    ? this.capitalizeFirstLetter(str.split("_").join(" "))
    : str == 'draft' ? 'New' :this.capitalizeFirstLetter(str)
  }

  handleClickGetTranscript= () => this.props.onGetTranscript(this.props.url);

  render() {
    const { url, isEditMode, disabled, canOpenSingleUrlDialog, store} = this.props;
    const showTranscribeIcon = !!url.url && (videoAudioFormats.includes(url.url.toLowerCase().split('.').pop()) || matchYoutubeUrl(url.url));
    const tooltip = url.id && showTranscribeIcon ? 'Get Transcript' : 'Generating a transcription for this link is not currently supported.'
    return (
      <li className={classnames('files-list__file', {'links-list__list-item--edit': isEditMode, 'mt-10': !!url.progress})}>
        <ProgressBar progress={url.progress} className="files-list__file-progress mt--5" />
        <a href={url.url_full} target="_blank" className="links-list__link ellipsis">
          {url.url}
        </a>
        {!!isEditMode && (
          <div className="links-list__list-item-buttons table-actions">
           <Tooltip body={this.showStatus(url.status)} className="table-actions__tooltip-container">
              <Button className="table-actions__button" status="link" style={{color: ['resolved', 'updated'].includes(url.status) && 'green'}}
                disabled={disabled || !url.id} onClick={this.handleLinkStatusChange}>
                <i className="fa fa-safari icon icon--bold icon--button"></i>
              </Button>
            </Tooltip>
            {url.id && (<Tooltip body={tooltip} className="table-actions__tooltip-container">
              <Button className="table-actions__button" status="link"
                disabled={!showTranscribeIcon} onClick={this.handleClickGetTranscript}>
                <i className="pe-7s-gleam icon--bold icon--button"></i>
              </Button>
            </Tooltip>
              )}
            {!!canOpenSingleUrlDialog && (<Tooltip body="Add URL to Single Site Search Query" className="table-actions__tooltip-container">
              <Button className="table-actions__button" status="link"
                disabled={disabled} onClick={this.handleClickOpenBindDialog}>
                <i className="pe-7s-link icon icon--bold icon--button"></i>
              </Button>
            </Tooltip>
            )}
            <Tooltip body="Edit URL" className="table-actions__tooltip-container">
              <Button className="table-actions__button" status="link"
                disabled={disabled} onClick={this.handleClickEdit}>
                <i className="pe-7s-note icon icon--bold icon--button"></i>
              </Button>
            </Tooltip>
            <Tooltip body="Remove URL" className="table-actions__tooltip-container">
              <Button className="table-actions__button" status="link"
                disabled={disabled} onClick={this.handleClickDestroy}>
                <i className="pe-7s-close-circle icon icon--bold icon--button"></i>
              </Button>
            </Tooltip>
          </div>
        )}
      </li>
    );
  }
}

export default LinksListItem;

