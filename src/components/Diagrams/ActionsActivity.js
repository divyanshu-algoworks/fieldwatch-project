import CommonDiagram from './CommonDiagram'
import { autobind } from 'core-decorators';

export default class ActionsActivityDiagram extends CommonDiagram {
  @autobind drawChart() {
    const { data } = this.props;

    $(this.container).highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: this.props.data ? this.props.data.categories : [],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Action count'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">Count: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        data: this.props.data ? this.props.data.series : [],
        showInLegend: false
      }]
    });
  }
}
