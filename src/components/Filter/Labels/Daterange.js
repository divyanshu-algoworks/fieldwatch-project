import Common from './Common';

export class Daterange extends Common {
  get filterChanged() {
    const { type, field } = this.props.data;
    return (type !== 'all_period' || (!!field && field !== 'reported_date'));
  }

  get valueText() {
    const { data, dateRanges, types, } = this.props;
    const fieldInfo = !!data.field ? ` by ${types[data.field]}` : '';
    if (data.type === 'custom') {
      return `${data.from} - ${data.till}${fieldInfo}`;
    }
    return `${dateRanges[data.type]}${fieldInfo}`;
  }
}
