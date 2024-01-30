export default class fileFormatVerification {
static imageFormatCheck(file, callback) {
    console.log(file);
    const fileObj = new FileReader()
    fileObj.onloadend = function(res) {
      if (res.target.readyState === FileReader.DONE) {
          const uintFormat = new Uint8Array(res.target.result)
          let bytes = []
          uintFormat.forEach((byte) => {
              bytes.push(byte.toString(16))
          })
          const hexCode = bytes.join('').toUpperCase()
          const binaryFileType = getMimetype(hexCode)
          const isValidImageType = !binaryFileType.includes('Unknown filetype');
          const fileTypes = ['application/pdf', 'text/csv', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain', 'application/vnd.ms-excel', 'application/excel', 'application/x-excel', 'application/x-msexcel'];
          const validFile = fileTypes.includes(file.type);
          if(isValidImageType || validFile || file.type.startsWith('video/')) {
            callback()
          }
          else {
            FW.flash({
                type: 'warning',
                text: file.name + ' not supported'
              });
          }
      }
  }

  const blobObj = file.slice(0, 4);
  fileObj.readAsArrayBuffer(blobObj);

  const getMimetype = (format) => {
    switch (format) {
        case '89504E47':
            return 'image/png'
        case 'D0CF11E0':
            return 'application/vnd.ms-outlook'
        case 'FFD8FFDB':
        case 'FFD8FFE1':
        case 'FFD8FFE0':
        case 'FFD8FFE2':
        case 'FFD8FFE8':
            return 'image/jpeg'
        default:
            return 'Unknown filetype'
    }
}
}}