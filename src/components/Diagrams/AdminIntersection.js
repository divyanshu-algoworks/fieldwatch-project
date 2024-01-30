import { autobind } from 'core-decorators';
import CommonDiagram from "./CommonDiagram";

export default class AdminIntersection extends CommonDiagram {
  get series() {
    return [{
      name: 'Super Hits',
      data: this.props.data.map((i) => [Date.parse(i.measure_date), i.super_hits_count])
    }, {
      name: 'Hits',
      data: this.props.data.map((i) => [Date.parse(i.measure_date), i.hits_count])
    }, {
      name: 'Intersection',
      data: this.props.data.map((i) => [Date.parse(i.measure_date), i.hit_intersection_count])
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