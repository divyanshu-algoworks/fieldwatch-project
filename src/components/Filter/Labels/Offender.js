import Common from './Common';

export class Offender extends Common {
  get valueText() {
    const { data, allLabel } = this.props;
    if (!data || !data.length || data == '0') {
      return allLabel;
    }
    return data;
  }

  get filterChanged() {
    return this.valueText !== this.props.allLabel
  }
}
