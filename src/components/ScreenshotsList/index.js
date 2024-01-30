import React from 'react';
import Paper from 'Components/Paper';
import Screenshot from 'Components/Screenshot';
import Magnifier from 'Components/Magnifier';
import Button from 'Components/Button';
import Input from 'Components/Input';
import CommonFilesList from 'Components/CommonFilesList';
import { FileUploader } from "react-drag-drop-files";

export default class ScreenshotsList extends CommonFilesList {
  uploadTitle = 'screenshot';
  idKey = 'screenshot_id';

  state = {
    imgToPreview: null,
  };

  componentDidMount() {
     let div = document.getElementsByClassName("sc-eqUAAy");
     let element = document.createElement("span");
     element.id = "screenshot-id";
     let text = document.createTextNode("Upload or drag images right here");
     element.appendChild(text);
     if(div[0]) div[0].prepend(element);
  }

  handleScreenshotClick = (imgToPreview) => {
    this.setState({ imgToPreview });
  }

  handleCloseMagnifier = () => {
    this.setState({ imgToPreview: null });
  }

  onTypeError = () => {
    let span = document.getElementById("screenshot-id");
     if(span) span.innerText = "Upload or drag images right here";
  }

  handleFileChange = (e) => {
    let span = document.getElementById("screenshot-id");
     if(span) span.innerText = "Upload or drag images right here";
    this.fileInputChange(e);
  }

  render() {
    const { screenshots, disabled, uploadUrl,multiple, unbindUrl, recoverUrl, onUnbind } = this.props;
    const { imgToPreview } = this.state;
    return (
      <Paper>
        <Paper.Header>
          <Paper.Title small>Screenshots</Paper.Title>
          <div className="d-f">
            {uploadUrl && <FileUploader handleChange={(e) => this.handleFileChange(e)} classes ="screenshot_uploder"  onTypeError={this.onTypeError} multiple={true} name="file" types={["JPEG", "JPG", "PNG", "GIF"]} />}
            {uploadUrl && (
            <Input type="file" heightClass="h-22" accept="image/png, image/jpeg, image/jpg" multiple={multiple} disabled={disabled} label={(
              <Button type="label" size="small" status="black"
                disabled={disabled}>
                + Add
              </Button>
            )} onChange={this.fileInputChange} />
          )}
          </div>
        </Paper.Header>
        <Paper.Body>
          <div className="screenshots-list">
            {screenshots.map((screenshot) => (
              <Screenshot key={screenshot.id} {...screenshot}
                canDestroy={!!unbindUrl}
                onUnbind={onUnbind}
                canRecover={!!recoverUrl}
                onClick={this.handleScreenshotClick}
                className="screenshots-list__screenshot"
                imgClassName="screenshots-list__img"
                imgContainerClassName="screenshots-list__img-container"
                nameClassName="screenshots-list__name"
                disabled={disabled}
                onDestroy={this.destroy}
                onRecover={this.recover} />
            ))}
            {!!imgToPreview && !!imgToPreview.url && (
              <Magnifier src={imgToPreview.url} onClose={this.handleCloseMagnifier} />
            )}
          </div>
        </Paper.Body>
      </Paper>
    );
  }
}