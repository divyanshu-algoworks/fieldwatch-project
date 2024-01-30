import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommonFilesList from 'Components/CommonFilesList';
import Paper from 'Components/Paper';
import ProgressBar from 'Components/ProgressBar';
import Input from 'Components/Input';
import { videoAudioFormats } from "Constants/video";
import WarningDialog from 'Components/WarningDialog';
import Button from 'Components/Button';
import Tooltip from 'Components/Tooltip';
import { FileUploader } from "react-drag-drop-files";
import API from "Helpers/api";

const FileName = ({ name, url, _destroy, }) => {
  if (!!url & !_destroy) {
    return (
      <a href={url} target="blank" className="files-list__file-name w-90p">
        {name}
      </a>
    );
  }

  if (!!_destroy) {
    return (
      <div className="files-list__file-name files-list__file-name--removed">
        {name}
      </div>
    );
  }

  return (
    <div className="files-list__file-name files-list__file-name--unloaded w-90p">
      {name}
    </div>
  );

}

class FileButton extends Component {
  handleDestroy = () => {
    const { file, onDestroyFile, } = this.props;
    onDestroyFile(file.id);
  }

  handleRecover = () => {
    const { file, onRecoverFile, } = this.props;
    onRecoverFile(file.id);
  }
 
  handleGetTranscribe = () => {
    const { file, onGetTranscribe} = this.props;
    onGetTranscribe(file);
  }

  render() {
    const { file, disabled, canDestroy, canRecover } = this.props;
    const showTranscribeIcon = !!file.name && videoAudioFormats.includes(file.name.toLowerCase().split('.').pop());
    const tooltip = showTranscribeIcon ? 'Get Transcript' : 'Generating a transcription for this file is not currently supported.'
    if (file._destroy && !!canRecover) {
      return (
        <Button type="button" status="link" onClick={this.handleRecover}
          disabled={disabled}>
          Recover
        </Button>
      );
    }

    if (!file._destroy && canDestroy) {
      return (
        <div>
          <Tooltip body={tooltip} className="table-actions__tooltip-container">
            <Button
              type="button"
              status="link"
              onClick={this.handleGetTranscribe}
              disabled={!showTranscribeIcon}
            >
              <i className="pe-7s-gleam icon icon--bold"></i>
            </Button>
          </Tooltip>
          <Button
            type="button"
            status="link"
            onClick={this.handleDestroy}
            disabled={disabled}
          >
            <i className="pe-7s-trash icon icon--bold"></i>
          </Button>
        </div>
      );
    }
    return null;
  }
}

export default class FilesList extends CommonFilesList {
  uploadTitle = 'document';
  idKey = 'file_id';
  state = { 
    openTranscriptPopup: false,
    selectedFileId: null,
  }
  static propTypes = {
    /* URL for upload new files */
    uploadUrl: PropTypes.string,
  };

  componentDidMount() {
    let div = document.getElementsByClassName("sc-eqUAAy");
    let element = document.createElement("span");
    element.id = "screenshot-id";
    let text = document.createTextNode("Upload or drag files right here");
    element.appendChild(text);
    if (div[1]) div[1].prepend(element);
 }

  isTranscriptExist = (file_id) => {
    const { checkTranscriptUrl, incident } = this.props;
    return API.post(checkTranscriptUrl, { 
      body: { file_id, incident_id: incident.id}
     }).then(({ data }) => {
      return data;
    });
  }

  handleFileDestroy = async (file_id) => {
    this.setState({ selectedFileId: file_id });
    if (await this.isTranscriptExist(file_id))
    this.setState({ openTranscriptPopup: true });
    else
    this.destroy(file_id)
  }

  handleConfirmTranscriptPopup = () => {
    const { selectedFileId } = this.state;
    this.setState({ openTranscriptPopup: false }, () => {
      this.destroy(selectedFileId);
    })
  }

  handleOnGetTranscript = async(file) => {
    if(await this.isTranscriptExist(file.id)) {
      FW.flash({
        type: 'warning',
        text: 'Transcript Already Exist '
      });
      return;
    }
    this.props.onGetTranscribe(file);
  }

  onTypeError = () => {
    let span = document.getElementById("screenshot-id");
     if(span) span.innerText = "Upload or drag files right here";
  }

  handleFileChange = (e) => {
    let span = document.getElementById("screenshot-id");
     if(span) span.innerText = "Upload or drag files right here";
    this.fileInputChange(e);
  }


  render() {
    const { uploadUrl, unbindUrl,multiple,recoverUrl, files, disabled } = this.props;
    return (
      <Paper>
        <Paper.Header>
          <Paper.Title small>Files</Paper.Title>
          {uploadUrl && (
             <div className="d-f">
             <FileUploader
               handleChange={(e) => this.handleFileChange(e)}
               classes="file_uploder"
               multiple={true}
               name="file"
               onTypeError={this.onTypeError}
               types={[
                 "PNG",
                 "JPEG",
                 "JPG",
                 "PDF",
                 "CSV",
                 "DOC",
                 "DOCX",
                 "MSG",
                 "MP4",
                 "MP3",
                 "MOV",
                 "WEBM",
                 "AVI",
                 "MKV",
                 "TXT",
                 "XLS",
                 "WORD",
                 "VIDEO/*",
                 "AUDIO/*",
               ]}
             />
               <Input
                 type="file"
                 accept={[
                   "image/png, image/jpeg, image/jpg, application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/msword, text/plain, .doc, .docx, .msg, video/mp4, video/x-m4v, video/x-m4v, video/*, audio/*",
                 ]}
                 multiple={multiple}
                 disabled={disabled}
                 label={
                   <Button
                     type="label"
                     size="small"
                     status="black"
                     disabled={disabled}
                   >
                     + Add
                   </Button>
                 }
                 heightClass="h-22"
                 onChange={this.fileInputChange}
               />
           </div>
          )}
        </Paper.Header>
        <WarningDialog
          key="warning-dialog-transcript-file"
          isOpen={this.state.openTranscriptPopup}
          text={`Are you sure, you want to delete this as generated transcription from this file will also be deleted?`}
          onClose={() => this.setState({ openTranscriptPopup: false })}
          onConfirm={this.handleConfirmTranscriptPopup}
          btnTextYes={"Yes"}
          btnTextNo={"Cancel"}
        />
        <Paper.Body>
          <ol className="files-list">
            {files.map((file) => (
              <li key={file.id}>
                <div className="files-list__file">
                  <ProgressBar
                    progress={file.progress}
                    className="files-list__file-progress"
                  />
                  <FileName {...file} />
                  <FileButton
                    file={file}
                    onDestroyFile={(file_id) => this.handleFileDestroy(file_id)}
                    onRecoverFile={this.recover}
                    canDestroy={!!unbindUrl}
                    canRecover={!!recoverUrl}
                    onGetTranscribe={(file) => this.handleOnGetTranscript(file)}
                    disabled={disabled}
                  />
                </div>
              </li>
            ))}
          </ol>
        </Paper.Body>
      </Paper>
    );
  }
}
