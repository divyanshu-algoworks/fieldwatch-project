import CommonDiagram from './CommonDiagram'
import { autobind } from 'core-decorators';
import { getClientType } from 'Helpers/cookie';
import { STATIC_GRAPH_DATA } from './StaticGraphsData';
export default class IncidentsByStatusDiagram extends CommonDiagram {

  @autobind drawChart() {
    const { data, statusSelected } = this.props;
    if (!data.data) {
      return;
    }
    
    const client_type = getClientType();
    const graph_data = client_type === 'fc' && !data.data.length ? STATIC_GRAPH_DATA.INCIDENT_BY_STATUS_DATA 
    : data.data.length ? data.data.map(({ name, y }) => [name, y]) : []
    $(this.container).highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Total incidents'
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:f}'
          },
          cursor: 'pointer',
          point: {
              events: {
                  click: function () {
                    client_type !== 'fc' && statusSelected(this.name);
                  }
              }
          }
        }
      },
      useHtml: true,  
      tooltip: {
        formatter: function () {
          const name = this.point.name.length < 40 ? this.point.name : this.point.name.slice(0, 40) + '...'
          return `<span style="color:${this.point.color}">${name}</span>: <b>${this.point.y}</b> incidents <br />`;
        }
      },
      series: [{
        name: 'Status',
        colorByPoint: true,
        data: graph_data
      }]
    });
  }
}


