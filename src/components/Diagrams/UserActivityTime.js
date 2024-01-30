import CommonDiagram from './CommonDiagram'
import { autobind } from 'core-decorators';
import { getClientType } from 'Helpers/cookie';
import { STATIC_GRAPH_DATA } from './StaticGraphsData';

export default class UserActivityTime extends CommonDiagram {
  @autobind drawChart() {
    const { data } = this.props;
    const isNonFWClient = ['fc'].includes(getClientType());
    const { USER_ACTIVITY_TIME } = STATIC_GRAPH_DATA;
    const final_data = isNonFWClient ? USER_ACTIVITY_TIME : data;
    const formattedData = final_data && final_data.data &&  final_data.data.map(item => {
      return {...item, 
        activity_hours: Math.floor(item.activity_hours/60),
        week_day: item.week_day.trimEnd()
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
          text: 'Time (m)'
        }
      },

      tooltip: {
        formatter: function () {
          const { avgLabels } = this.series.userOptions;
          return `<span style="font-size: 10px">${this.series.name}</span> <br />` +
            `<span style="color:${this.point.color}">\u25CF </span>${this.point.name}: <b>${avgLabels[this.point.y]} min</b> <br />`;
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
        name: 'User',
        color: '#f7a35c',
        avgLabels: !formattedData ? {} : formattedData.reduce((res, { week_day, activity_hours }) => {
          res[activity_hours] = activity_hours;
          return res;
        }, {}),
        data: formattedData && formattedData.length ? formattedData.map(({ week_day, activity_hours }) => [week_day, activity_hours]) : []
      }]
    });
  }
}
