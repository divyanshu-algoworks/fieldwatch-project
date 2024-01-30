import CommonDiagram from './CommonDiagram'
import { autobind } from 'core-decorators';
import { getClientType } from 'Helpers/cookie';
import { STATIC_GRAPH_DATA } from './StaticGraphsData';

export default class IncidentByCategoryDiagram extends CommonDiagram {
  @autobind drawChart() {
    const { data, widgetSize } = this.props;

    if (!data.data) {
      return;
    }
    let legendSize;
    const { INCIDENT_BY_CATEGORY } = STATIC_GRAPH_DATA;

    if (widgetSize === 1) {
      const containerWidth = this.container.getBoundingClientRect().width;
      legendSize = {
        width: containerWidth,
        itemWidth: containerWidth / 2,
      };
    } else {
      legendSize = {};
    }

    $(this.container).highcharts({
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45
        }
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      plotOptions: {
        pie: {
          innerSize: 40,
          depth: 25,
          showInLegend: true,
          dataLabels: {
            enabled: false,
            formatter: function () {
              const total = this.series.data.reduce((sum, { y }) => { return sum + y }, 0);
              const percent = Math.round(this.point.y / total * 10000) / 100;
              return `<span style="color:${this.point.color}">\u25CF</span>${this.point.name}\u00a0</span>(${percent}%)`;
            }
          }
        }
      },
      tooltip: {
        formatter: function () {
          return `<span style="font-size: 10px">${data.data[this.point.x].drilldown}</span> <br />` +
            `<span style="color:${this.point.color}">\u25CF </span>${this.series.name}: ${this.point.y} <br />`;
        }
      },
      legend: {
        ...legendSize,
        labelFormatter: function () {
          const total = this.series.data.reduce((sum, { y }) => { return sum + y }, 0);
          const percent = Math.round(this.y / total * 10000) / 100;
          return `${this.name}:\u00a0${this.y}\u00a0</span>(${percent}%)`;
        },
        shadow: true,
      },
      series: [{
        name: 'Incidents',
        data: ['fc'].includes(getClientType()) && !data.data.length ? INCIDENT_BY_CATEGORY.map(({ name, y }) => [name, y]) 
              :  data.data.length ? data.data.map(({ name, y }) => [name, y]) : [],
      }]
    });
  }
}
