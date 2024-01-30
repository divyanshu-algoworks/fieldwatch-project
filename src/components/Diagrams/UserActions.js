import CommonDiagram from './CommonDiagram'
import { autobind } from 'core-decorators';

export default class UserActionsDiagram extends CommonDiagram {
  get categories() {
    return Object.keys(this.props.data);
  }

  get series() {
    return [{
      name: 'Actions',
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
        type: 'column',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      credits: {
        text: 'Fieldwatch'
      },
      xAxis: {
        type: 'category',
        categories: this.categories,
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Actions count'
        }
      },
      tooltip: {
        formatter: function () {
          return `<span style="font-size: 10px">${this.point.name}</span> <br />` +
            `<span style="color:${this.point.color}">\u25CF </span>${this.series.name}: <b>${this.point.y}</b> <br />`;
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true
          }
        }
      },
      series: this.series
    });
  }
}
