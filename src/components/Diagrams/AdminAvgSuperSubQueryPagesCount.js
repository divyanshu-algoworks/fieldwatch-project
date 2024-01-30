import { autobind } from 'core-decorators';
import CommonDiagram from "./CommonDiagram";

export default class AdminAvgSuperSubQueryPagesCount extends CommonDiagram {
  get series() {
    return [{
      name: 'Avg Requested Pages',
      data: this.props.data.map((i) => [Date.parse(i.measure_date), i.requested_pages_count_avg])
    }, {
      name: 'Avg Returned Pages',
      data: this.props.data.map((i) => [Date.parse(i.measure_date), i.returned_pages_count_avg])
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
