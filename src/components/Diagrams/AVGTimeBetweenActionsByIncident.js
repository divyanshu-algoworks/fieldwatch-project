import CommonDiagram from './CommonDiagram'
import { autobind } from 'core-decorators';
import { getClientType } from 'Helpers/cookie';
import { STATIC_GRAPH_DATA } from './StaticGraphsData';

export default class AVGTimeBetweenActionsByIncidentDiagram extends CommonDiagram {
  @autobind drawChart() {
    const { data } = this.props;
    const isNonFWClient = ['fc'].includes(getClientType());
    const { AVERAGE_TIME_BW_ACTIONS_BY_INCIDENT } = STATIC_GRAPH_DATA;
    const final_data = isNonFWClient ? AVERAGE_TIME_BW_ACTIONS_BY_INCIDENT : data;
    const formattedData = final_data && final_data.length > 0 &&  final_data.map(item => {
      return {...item, 
      avg_in_hours: +item.avg_in_hours
      }});

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
          text: 'Average (h)'
        }
      },

      tooltip: {
        formatter: function () {
          const { avgLabels } = this.series.userOptions;
          return `<span style="font-size: 10px">${this.point.name}</span> <br />` +
            `<span style="color:${this.point.color}">\u25CF </span>${this.series.name}: <b>${avgLabels[this.point.y]}</b> <br />`;
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

      series: [{
        name: 'AVG',
        avgLabels: !data.length ? {} : data.reduce((res, { avg_in_hours, avg_in_days }) => {
          res[avg_in_hours] = avg_in_days;
          return res;
        }, {}),
        color: '#90ed7d',
        data: formattedData.length ? formattedData && formattedData.map(({ incident_number, avg_in_hours }) => [`#${incident_number}`, avg_in_hours]) : []
        // data: data.length ? data.map(({ date, count }) => [date, count]) : []
        // data: data.length ? data.map(({ incident_number, avg_in_hours }) => [`#${incident_number}`, avg_in_hours]) : []
      }]
    });
  }
}
