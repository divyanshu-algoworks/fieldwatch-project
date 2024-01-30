import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import Dialog from 'Components/Dialog';
import Button from 'Components/Button';
import ChecklistDialog from 'Components/Filter/ChecklistDialog';
import Input from 'Components/Input';

export default class ColumnsVisibilityDialog extends ChecklistDialog {
  @autobind handleOpenDialog() {
    const { allColumns, visibleColumns } = this.props;

    const data = allColumns.filter(({ title }) => !!title).map(({ accessor, title }) => {
      return { id: accessor, name: title, checked: visibleColumns.indexOf(accessor) > -1 };
    });
    this.setState({ data });
  }
}
