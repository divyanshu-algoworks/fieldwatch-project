import CommonDiagram from './CommonDiagram'
import { autobind } from 'core-decorators';
import { getClientType } from 'Helpers/cookie';
import { STATIC_GRAPH_DATA } from './StaticGraphsData';

export default class IncidentsKeywordsDiagram extends CommonDiagram {
  @autobind drawChart() {
    const { data } = this.props;
    if (!data.data && !['fc'].includes(getClientType())) {
      return;
    }

    const { TOP_TEN_KEYWORDS_DATA } = STATIC_GRAPH_DATA;
    $(this.container).highcharts({
      chart: {
        type: 'column'
      },
      title: {
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
          text: 'incidents'
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> incident(s)'
      },
      series: [{
        name: 'Population',
        data: ['fc'].includes(getClientType()) && !data.length ? TOP_TEN_KEYWORDS_DATA :  data.data,
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',
          format: '{point.y}', // one decimal
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      }]
    });
  }
}
