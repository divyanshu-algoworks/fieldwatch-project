import CommonDiagram from './CommonDiagram'
import { autobind } from 'core-decorators';
import { getClientType } from 'Helpers/cookie';
import { STATIC_GRAPH_DATA } from './StaticGraphsData';

export default class IncidentsAverageResolutionTimeDiagram extends CommonDiagram {
  @autobind drawChart() {
    const { data } = this.props;
    if (!data.data) {
      return;
    }
    const { INCIDENT_AVERAGE_RESOLUTION_TIME } = STATIC_GRAPH_DATA;
    const isNonFWClient = ['fc'].includes(getClientType());
    $(this.container).highcharts({
      chart: {
        type: 'bar'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: isNonFWClient && !data.categories.length?  INCIDENT_AVERAGE_RESOLUTION_TIME.categories : data.categories,
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Days',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        valueSuffix: '',
        pointFormat: '<span style="color:{point.color}">\u25CF</span>Average time per incident: <b>{point.y}</b> day(s)',
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Average time per incident',
        data: isNonFWClient && !data.data.length ? INCIDENT_AVERAGE_RESOLUTION_TIME.data : data.data,
      }]
    });
  }
}
