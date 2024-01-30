import Common from './Common';

export class Edgecase extends Common {
  static defaultProps = {
    allLabel: 'All Edge Case',
    existLabel: 'Is Edge Case',
    notExistLabel: 'Not Edge Case',
  }

  get filterChanged() {
    return this.valueText !== this.props.allLabel;
  }

  get valueText() {
    const { data, allLabel, existLabel, notExistLabel } = this.props;
    if (data[0] === true && data[1] === false) {
      return allLabel;
    }
    if (data[0] === true) {
      return existLabel;
    }
    if (data[0] === false) {
      return notExistLabel;
    }
    return 'None';
  }
}
