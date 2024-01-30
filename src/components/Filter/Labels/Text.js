import Common from './Common';

export class Text extends Common {
  get valueText() {
    const { data, allLabel } = this.props;
    if (!data || !data.length) {
      return allLabel;
    }
    return data;
  }

  get filterChanged() {
    return this.valueText !== this.props.allLabel
  }
}
