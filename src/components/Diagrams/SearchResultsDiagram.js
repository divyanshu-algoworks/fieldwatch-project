import CommonDiagram from './CommonDiagram'
import { autobind } from 'core-decorators';

export default class SearchResultsDiagram extends CommonDiagram {
  @autobind drawChart() {
    const { data } = this.props;

    $(this.container).highcharts({
      chart: {
        type: 'column'
      },
      colors: [
        '#96ff99',
        '#42a7f4',
        '#ef8170',
      ],
      title: {
        text: ''
      },
      credits: {
        text: "Fieldwatch"
      },
      xAxis: {
        type: "datetime"
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Results'
        },
        stackLabels: {
          enabled: true,
          style: {
            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
          },
          formatter: function () {
            return this.total > 0 ? this.total : '';
          }
        }
      },
      legend: {
        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
        shared: true,
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        useHTML: true
      },
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      series: !!data && data.series
    });
  }
}
