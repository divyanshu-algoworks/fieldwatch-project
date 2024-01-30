import Common from './Common';

export class Checklist extends Common {
  getItemName = (item) => {
    const { checkboxLabelFn } = this.props;
    return checkboxLabelFn ? checkboxLabelFn(item) : item.name;
  }
  get filterChanged() {
    return this.valueText !== this.props.allLabel
  }

  get valueText() {
    const { data, allLabel, } = this.props;
    if (!data) {
      return 'None';
    }

    const checkedItems = data.filter(({ checked }) => checked);
    if (!checkedItems.length) {
      return 'None';
    }
    if (checkedItems.length === data.length) {
      return allLabel;
    }
    return checkedItems.map(item => this.getItemName(item)).join(', ');
  }
}
