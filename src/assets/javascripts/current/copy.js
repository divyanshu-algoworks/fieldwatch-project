function copyToClipboard(text) {
  var textarea, success;
  try {
    textarea = document.createElement('TEXTAREA');
    textarea.value = text;
    textarea.classList.add('clipboard-input')

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    var successful = document.execCommand('copy');
    if (!successful) {
      throw new Error('copy command was unsuccessful');
    }
    success = true;
  } catch (err) {
    console.warn('Work with clipboard is not available in this browser');
    success = false;
  } finally {
    if (textarea) {
      document.body.removeChild(textarea);
    }
  }
  return success;
}

$(function () {
  $.extend($.gritter.options, { position: '' });
  if (!window.FW) {
    window.FW = {};
  }
  window.FW.copyToClipboard = copyToClipboard;
});
