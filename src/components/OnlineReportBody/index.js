import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { render } from 'react-dom';
import Widget from 'Components/Widget';
import { ONLINE_REPORT_WIDGETS_REG_EXP, WIDGET_ID_REG_EXP } from 'Constants/OnlineReportWidgetRegExp';

export default class OnlineReportBody extends Component {
  constructor(props) {
    super(props);
    const { body } = props;
    const processedBodyStr = body.replace(ONLINE_REPORT_WIDGETS_REG_EXP, (record, index) => {
      const widgetId = record.match(WIDGET_ID_REG_EXP)[1];
      return `<div class="online-report-body__widget-container" data-widget-id="${widgetId}"></div>`;
    });
    const bodyDOM = (
      <div className="online-report-body" ref={div => this.reportBody = div}
        dangerouslySetInnerHTML={{ __html: processedBodyStr }}></div>
    );
    this.state = { bodyDOM };
  }

  @autobind renderWidgets() {
    const { data } = this.props;
    const { attachedWidgets } = this.props;
    const widgetContainers = document.querySelectorAll('.online-report-body .online-report-body__widget-container');
    if (!!widgetContainers) {
      Array.from(widgetContainers).forEach(container => {
        const { widgetId } = container.dataset;
        const widgetConfig = attachedWidgets.filter(({ id }) => widgetId == id)[0];

        render((
          <Widget {...widgetConfig} data={data[widgetId]} />
        ), container);
      });
    }
  }

  componentDidMount() {
    this.renderWidgets();
  }

  componentDidUpdate() {
    this.renderWidgets();
  }

  render() {
    const { bodyDOM } = this.state;

    return (
      <div>{bodyDOM}</div>
    );
  }
}
