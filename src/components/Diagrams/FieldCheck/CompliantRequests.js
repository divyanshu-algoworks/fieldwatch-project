import CommonDiagram from '../CommonDiagram';
import { autobind } from 'core-decorators';

export default class CompliantRequests extends CommonDiagram{
  @autobind drawChart() {
    const { data } = this.props;

    $(this.container).highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Flagged Requests'
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Count'
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
          return `<span style="color:${this.point.color}">${this.point.drilldown}</span>: <b>${this.point.y}</b> requests <br />`;
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