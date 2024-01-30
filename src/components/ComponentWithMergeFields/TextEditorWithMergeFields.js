import React from 'react';
import ComponentWithMergeFields from './index';

export default class TextEditorWithMergeFields extends ComponentWithMergeFields {
  handleChange = (val) => this.props.onChange(val);

  handleMergeFieldSelect = (addonValue) => {
    const { editor } = this.input.current.editor;
    editor.focus();
    const cursorPosition = editor.getSelection().index;
    editor.insertText(cursorPosition, ` {{${addonValue}}} `);
  }
}
