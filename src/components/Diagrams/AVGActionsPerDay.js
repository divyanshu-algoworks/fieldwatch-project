import CommonDiagram from './CommonDiagram'
import { autobind } from 'core-decorators';

export default class UserActionsDiagram extends CommonDiagram {
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
          text: 'Average Number'
        }
      },
      tooltip: {
        formatter: function () {
          return `<span style="font-size: 10px">${this.series.name}</span> <br />` +
            `<span style="color:${this.point.color}">\u25CF </span>${this.point.name}: <b>${this.point.y}</b> <br />`;
        }
      },
      dataLabels: {
        enabled: true,
        rotation: -90,
        color: '#FFFFFF',
        align: 'right',
        format: '{point.y:.1f}', // one decimal
        y: 10, // 10 pixels down from the top
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'User',
        color: '#f15c80',
        data: data.length ? data.map(({ full_name, avg_number }) => [full_name, avg_number]) : []
      }]
    });
  }
}
