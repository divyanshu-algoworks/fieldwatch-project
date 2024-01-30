import CommonDiagram from './CommonDiagram';
import { autobind } from 'core-decorators';


export default class IncidentsQueryResultsByTabsDiagram extends CommonDiagram {
  shouldComponentUpdate({ data, loading }) {
    if (data == undefined) {
      return false;
    }

    const { dates, records } = data;
    const propsData = this.props.data.data || this.props.data;
    return (
      !dates || !records ||
      (loading !== this.props.loading) ||
      (data.length !== propsData.length) ||
      (dates.some((category, i) => category !== propsData.dates[i])) ||
      (records.some(({ name, data }, i) => {
        return (name !== propsData.records[i].name) ||
          (JSON.stringify(data) !== JSON.stringify(propsData.records[i].data));
      }))
    );
  }
  @autobind drawChart() {
    const { data } = this.props;

    if (data == undefined) {
      return;
    }
    if (!data.records) {
      return;
    }

    $(this.container).highcharts({
      title: {
        text: '',
        x: -20 //center
      },
      xAxis: {
        categories: data.dates || []
      },
      yAxis: {
        title: {
          text: 'Incidents'
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      tooltip: {
        crosshairs: {
          dashStyle: 'solid',
          color: '#000',
          width: 1,
        },
        shared: true,
      },
      legend: {
        borderWidth: 0
      },
      series: data.records || []
    });
  }
}
