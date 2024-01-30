import { MAX_SIZE, VIDEO_MAX_SIZE } from 'Constants/File';
import getToken from 'Helpers/getToken';
export default function (url, file, { uploadData = {}, onLoadStart, onProgressChange, onUpload }, fileKey = 'file', callback = {}) {
  if (file.type.startsWith('video/') && file.size > VIDEO_MAX_SIZE) {
    FW.flash({
      text: 'File must not be larger than 100 MB megabytes for ' + file.name,
      type: 'warning'
    });
    return;
  }

  if (!file.type.startsWith('video/') && file.size > MAX_SIZE) {
    FW.flash({
      text: 'File must not be larger than 20.0 megabytes for ' + file.name,
      type: 'warning'
    });
    callback()
    return;
  }

  let formData = new FormData(),
    xhr = new XMLHttpRequest();
  file.id = (new Date()).valueOf();
  const data = {
    ...uploadData,
    ...getToken(),
    [`${fileKey}`]: file
  };

  Object.keys(data).forEach(key => formData.append(key, data[key]));

  xhr.open('POST', url);

  if (onLoadStart) {
    xhr.upload.addEventListener('loadstart', () => onLoadStart(file));
  }

  if (onProgressChange) {
    xhr.upload.addEventListener('progress', ({ lengthComputable, loaded, total }) => {
      if (!lengthComputable) {
        return;
      }
      let percentage = Math.round((loaded * 100) / total);
      if (percentage == 100) {
        percentage -= 20;
      };
      onProgressChange(percentage, file);
    }, false);
  }

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 422 && xhr.responseText) {
      let resp = JSON.parse(xhr.responseText);
      FW.flash({type: 'warning', text: resp.error});
      onProgressChange(null, file);
      return;
    }
    if (xhr.readyState !== 4 || xhr.status !== 200) {
      typeof callback === 'function' && callback()
      return;
    }
    let resp = JSON.parse(xhr.responseText);
    if (resp && resp.flash_type) {
      FW.flash({type: resp.flash_type, text: resp.flash_message});
    };
    if (onUpload) {
      onUpload(resp, file);
    }
  };

  xhr.send(formData);
}
