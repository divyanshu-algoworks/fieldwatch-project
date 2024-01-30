import React from 'react';
import CommonDiagram from './CommonDiagram'
import { autobind } from 'core-decorators';

export default class TrainingScoresDiagram extends CommonDiagram {
  @autobind drawChart() {
    const data = !!this.props.data && !!this.props.data.data ? this.props.data.data : this.props.data;
    const avg_score = this.props.data.avg_score;
    const series = [{
      name: 'Representatives Count',
      data: !!data.map ? (data).map(({score, reps_count}) => [score, reps_count]) : []
    }];

    $(this.container).highcharts({
      chart: {
        type: 'spline',
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
        },
        plotLines: [{
          value: avg_score,
          dashStyle: 'dash',
          width: 1,
          color: '#d33'
        }]
      },
      legend: {
        enabled: false,
      },
      yAxis: {
        title: {
          text: 'Reps Count'
        }
      },
      series: series,
    });
  }
}
