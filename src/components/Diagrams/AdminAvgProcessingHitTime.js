import { autobind } from 'core-decorators';
import CommonDiagram from "./CommonDiagram";

export default class AdminIntersection extends CommonDiagram {
  get series() {
    return [{
      name: 'Max',
      data: this.props.data.map((i) => [Date.parse(i.measure_date), i.max])
    },{
      name: 'Avg',
      data: this.props.data.map((i) => [Date.parse(i.measure_date), i.avg])
    }, {
      name: 'Min',
      data: this.props.data.map((i) => [Date.parse(i.measure_date), i.min])
    }]
  }


  @autobind
  drawChart() {
    $(this.container).highcharts({
      chart: {
        scrollablePlotArea: {
          minWidth: 700
        }
      },
      title: {
        text: null
      },
      xAxis: {
        type: 'datetime'
      },
      tooltip: {
        shared: true,
        crosshairs: true
      },
      series: this.series
    })
  }
}
