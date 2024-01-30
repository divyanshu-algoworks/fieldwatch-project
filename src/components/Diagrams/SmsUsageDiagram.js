import React from 'react';

const graphConfig = {
  chart: {
    type: 'column',
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false
  },
  title: {
    text: '',
  },
  xAxis: {
    type: 'category',
    labels: {
      rotation: -45,
      style: {
        fontSize: '13px',
        fontFamily: 'Verdana, sans-serif'
      }
    }
  },
  legend: {
    enabled: false,
  },
  yAxis: {
    title: {
      text: 'sms count'
    }
  },
}

import CommonDiagram from './CommonDiagram'
import { autobind } from 'core-decorators';

export default class SmsUsageDiagram extends CommonDiagram {
  @autobind drawChart() {
    const data = !!this.props.data && !!this.props.data.data ? this.props.data.data : this.props.data;
    const series = [{
      name: 'SMS Count',
      data: !!data.map ? (data).map(({month, sms_count}) => [month, sms_count]) : []
    }];

    $(this.container).highcharts({
      chart: {
        type: 'column',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
      },
      title: {
        text: '',
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      legend: {
        enabled: false,
      },
      yAxis: {
        title: {
          text: 'sms count'
        }
      },
      series: series,
    });
  }
}
