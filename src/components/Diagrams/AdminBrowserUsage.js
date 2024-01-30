
import CommonDiagram from './CommonDiagram'
import { autobind } from 'core-decorators';

export default class AdminBrowserUsage extends CommonDiagram {
  get categories() {
    return Object.keys(this.props.data);
  }
  get series() {
    return [{
      name: 'Browsers',
      colorByPoint: true,
      data: this.categories.map((category) => {
        return {
          name: category,
          y: this.props.data[category]
        }
      })
    }]
  }

  @autobind drawChart() {
    $(this.container).highcharts({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: '',
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          }
        }
      },
      series: this.series
    });
  }
}
