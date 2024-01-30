import CommonDiagram from './CommonDiagram'
import { autobind } from 'core-decorators';

export default class AnalyticsStatusDiagram extends CommonDiagram {
  @autobind drawChart() {
    const { data } = this.props;

    $(this.container).highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Incidents by Status'
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Total incidents'
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:f}'
          }
        }
      },
      tooltip: {
        formatter: function () {
          return `<span style="color:${this.point.color}">${this.point.drilldown}</span>: <b>${this.point.y}</b> incidents <br />`;
        }
      },
      series: [{
        name: 'Status',
        colorByPoint: true,
        data,
      }]
    });
  }
}
