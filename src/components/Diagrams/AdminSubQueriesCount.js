import { autobind } from 'core-decorators';
import CommonDiagram from "./CommonDiagram";

export default class AdminIntersection extends CommonDiagram {
  get series() {
    return [{
      name: 'Super Sub Queries',
      data: this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_queries_count])
    }, {
      name: 'Sub Queries',
      data: this.props.data.map((i) => [Date.parse(i.measure_date), i.sub_queries_count])
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