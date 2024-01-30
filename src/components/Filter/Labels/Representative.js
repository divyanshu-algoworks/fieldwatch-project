import { isEmpty } from '../../../helpers/object';
import Common from './Common';

export class Representative extends Common {
  get filterChanged() {
    return this.valueText !== this.props.allLabel
  }

  get valueText() {
    const { data, allLabel } = this.props;
    if (!data || isEmpty(data)) {
      return allLabel;
    };

    return `${data.name}`;
  }
}
