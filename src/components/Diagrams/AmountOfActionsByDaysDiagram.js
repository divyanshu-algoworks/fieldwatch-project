import CommonDiagram from './CommonDiagram'
import { autobind } from 'core-decorators';

export default class AmountOfActionsByDaysDiagram extends CommonDiagram {
  @autobind drawChart() {
    const { data } = this.props;
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
      series: [{
        name: 'Amount',
        color: '#aafffa',
        data: data.length ? data.map(({ date, count }) => [date, count]) : []
      }]
    });
  }
}
