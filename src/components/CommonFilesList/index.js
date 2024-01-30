import React, { Component } from 'react';
import uploadFile from 'Helpers/uploadFile';
import API from 'Helpers/api';
import { autobind } from 'core-decorators';
import fileFormatVerification from "Helpers/fileFormatVerification";

/** FilesListComponent is the parent class for files and screenshots sections
 * on incident form
 */
export default class FilesListComponent extends Component {
  /**
   * Handler for change file input value
   * @param {object} e event handler
   */
  @autobind fileInputChange(e) {
    const files = e.target ? e.target.files : e 
    if(!!files && files.length>1) {
    for(let i=0;i<files.length;i++){
      this.checkImageFormatAndUpload(files[i]);
      }
    }
    else this.checkImageFormatAndUpload(files[0])
  }

  checkImageFormatAndUpload = (file) => {
    const { onAdd, onProgressChange, onUpload, uploadUrl, id } = this.props;
    fileFormatVerification.imageFormatCheck(file, () => {
      uploadFile(
        uploadUrl,
        file,
        {
          uploadData: {
            id,
          },
          onLoadStart: onAdd,
          onProgressChange: onProgressChange,
          onUpload: onUpload
        },
        this.uploadTitle);
      })
  }

  /**
   * Handler for destroy file
   * @param {number} fileId
   */
  @autobind destroy(fileId) {
    const { unbindUrl, onUnbind, id, onDeleteTranscript } = this.props;

    API.post(unbindUrl, {
      body: {
        id,
        [this.idKey]: fileId
      },
    }).then(() => {
      onDeleteTranscript(fileId, 'file_id');
      onUnbind(fileId)
    });
  }

  /**
   * Handler for recover destroyed file
   * @param {number} fileId
   */
  @autobind recover(fileId) {
    const { recoverUrl, onRecover, id } = this.props;
    API.post(recoverUrl, {
      body: {
        id,
        [this.idKey]: fileId
      },
    }).then(() => onRecover(fileId));
  }

}
