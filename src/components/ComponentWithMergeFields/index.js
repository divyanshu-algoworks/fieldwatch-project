import React, { Fragment, Component, createRef } from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';
import FormGroup from 'Components/FormGroup';
import MergeFields from './MergeFields';
export default class ComponentWithMergeFields extends Component {
  static propTypes = {
    label: PropTypes.string,
    validationMessages: PropTypes.string,
    // mergeFields: PropTypes.arrayOf(PropTypes.shape({
    //   title: PropTypes.string,
    //   fields: PropTypes.object,
    // })),
  }

  input = createRef();

  handleChange = ({target}) => this.props.onChange(target.value);

  handleMergeFieldSelect = (addonValue) => {
    const { onChange } = this.props;
    const input = this.input.current;
    const cursorPosition = input.selectionStart;

    let newVal = input.value.slice(0, cursorPosition) +
      ` {{${addonValue}}} ` +
      input.value.slice(cursorPosition, input.value.length);

    onChange(newVal);
  }

  getMergeOptions(mergeFields) {
    if(Array.isArray(mergeFields)) {
      return mergeFields;
    }
    return Object.keys(mergeFields).map(key => {
      return { id: key, name: mergeFields[key] };
    })
  }

  get control() {
    const { label, inputComponent, mergeFields, validationMessages, ...inputProps } = this.props;
    const InputComponent = inputComponent;
    if(!!InputComponent) {
      return (
        <InputComponent {...inputProps} ref={this.input} onChange={this.handleChange} invalid={!!validationMessages} />
      );
    }
    return (
      <input {...inputProps} ref={this.input} onChange={this.handleChange}
        className={classnames('fw-input w-100p', {'fw-input--invalid': !!validationMessages})} />
    );
  }

  render() {
    const { label, validationMessages, mergeFields, alignRight } = this.props;
    return (
      <Fragment>
        <div className="clearfix mt-10 mb-m5">
          <div className="f-r">
        {mergeFields.map((item) => (
          <MergeFields key={item.title}
          mergeFields={this.getMergeOptions(item.fields)}
          handleSelect={this.handleMergeFieldSelect}
          buttonLabel={item.title}
          alignRight={alignRight}
          />
          ))}
          </div>
        </div>
        <FormGroup className="w-100p" label={label} vertical labelAlign="baseline" validationMessages={validationMessages}>
          {this.control}
        </FormGroup>
      </Fragment>
    );
  }
}
