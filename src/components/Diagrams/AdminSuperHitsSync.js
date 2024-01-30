import { autobind } from 'core-decorators';
import CommonDiagram from "./CommonDiagram";

export default class AdminSuperHitsSync extends CommonDiagram {
  get series() {
    return [{
      name: 'Total Hits Count',
      data: this.props.data.map((i) => [Date.parse(i.measure_date), i.total_hits_cnt])
    }, {
      name: 'Current Hits Count',
      data: this.props.data.map((i) => [Date.parse(i.measure_date), i.current_hits_cnt])
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
