import { autobind } from 'core-decorators';
import CommonDiagram from "./CommonDiagram";

export default class AdminSuperSubQueriesCountByClient extends CommonDiagram {
  get series() {
    return [{
      name: 'Super Sub Queries Count',
      data: this.props.data.map((i) => [i.super_sub_queries_count]),
    }]
  }

  @autobind
  drawChart() {
    $(this.container).highcharts({
      chart: {
        type: 'column',
        scrollablePlotArea: {
          minWidth: 700
        }
      },
      title: {
        text: null
      },
      xAxis: {
        categories: this.props.data.map((i) => [i.client_name]),
      },
      tooltip: {
        shared: true,
        crosshairs: true
      },
      series: this.series
    })
  }
}
