import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Input from 'Components/Input';
import Button from 'Components/Button';
import ProgressBar from 'Components/ProgressBar';
import uploadFile from 'Helpers/uploadFile';
import getToken from 'Helpers/getToken';
import fileFormatVerification from "Helpers/fileFormatVerification";

export default class AvatarControl extends Component {
  static propTypes = {
    value: PropTypes.shape({
      id: PropTypes.any,
      src: PropTypes.string,
      progress: PropTypes.number,
    }).isRequired,
    uploadUrl: PropTypes.string,
    destroyUrl: PropTypes.string,
    onChange: PropTypes.func,
    onUploadProgressChange: PropTypes.func,
    tokenKeyName: PropTypes.string,
    avatarKeyName: PropTypes.string,
  };

  static defaultProps = {
    value: {
      id: null,
      src: '',
    },
    tokenKeyName: 'authenticity_token',
    avatarKeyName: 'avatar',
  }

  constructor(props) {
    super(props);
    this.deleteBtn = createRef();
    this.uploadBtn = createRef();
  }

  handleProgressChange = (progress) => {
    const { onUploadProgressChange } = this.props;
    if (!!onUploadProgressChange) {
      onUploadProgressChange(progress);
    }

    this.setState({ progress });
  }

  handleUpload = ({ id, url }) => {
    this.setState({ progress: 0 });
    this.props.onChange({ id, src: url });
  }

  state = {
    progress: null,
  }

  handleDeleteAvatar = () => {
    this.props.onChange({ id: null, src: this.props.defaultImgUrl });
  }

  handleChange = ({ target }) => {
     if (!!target.files[0]) {
      fileFormatVerification.imageFormatCheck(target.files[0], () => {
        const { uploadUrl, tokenKeyName, avatarKeyName } = this.props;
        uploadFile(uploadUrl, target.files[0], {
          [tokenKeyName]: getToken(),
          onProgressChange: this.handleProgressChange,
          onUpload: this.handleUpload,
        }, avatarKeyName);
      })
    }
  }

  handleMouseEnter = () => {
    if (!!this.state.progress) {
      return;
    }
    if (!!this.deleteBtn.current) {
      this.deleteBtn.current.dom.classList.add('avatar-control__button--visible');
    }
    this.uploadBtn.current.dom.classList.add('avatar-control__button--visible');
  }

  handleMouseLeave = () => {
    if (!!this.deleteBtn.current) {
      this.deleteBtn.current.dom.classList.remove('avatar-control__button--visible');
    }
    this.uploadBtn.current.dom.classList.remove('avatar-control__button--visible');
  }

  render() {
    const { value, clientType} = this.props;
    const { progress, } = this.state;
    return (
      <div className="avatar-control" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        {!!progress && (<ProgressBar progress={progress} className="avatar-control__progress" />)}
        <img src={value.src} className="avatar-control__image" />
        {!!value.id && (
          <Button className={`avatar-control__button avatar-control__button--top ${['fc'].includes(clientType) ? 'disabled_element' : ''}`} ref={this.deleteBtn}
            onClick={this.handleDeleteAvatar}>
            Remove Logo
          </Button>
        )}
        <Input type="file" accept="image/png, image/jpeg, image/jpg" onChange={this.handleChange} label={
          (
            <Button type="label" ref={this.uploadBtn} className={`avatar-control__button avatar-control__button--bottom ${['fc'].includes(clientType) ? 'disabled_element' : ''}`}>Upload Logo</Button>
          )
        } />
      </div>
    );
  }
}
