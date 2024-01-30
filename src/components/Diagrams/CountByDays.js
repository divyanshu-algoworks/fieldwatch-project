import CommonDiagram from './CommonDiagram'
import { autobind } from 'core-decorators';

export default class CountByDaysDiagram extends CommonDiagram {
  shouldComponentUpdate({ data, loading }) {
    return ((data.date !== this.props.data.date) || (loading !== this.props.loading));
  }
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
      xAxis: {
        categories: !!data.value && data.value.categories
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Count'
        },
        stackLabels: {
          enabled: true,
          style: {
            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
          },
        }
      },
      legend: {
        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
        }
      },
      series: !!data.value && data.value.series
    });
  }
}
