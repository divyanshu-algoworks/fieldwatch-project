import CommonDiagram from "./CommonDiagram";
import { autobind } from "core-decorators";
import { STATIC_GRAPH_DATA } from "./StaticGraphsData"

export default class WarningEmail extends CommonDiagram {
  @autobind drawChart() {
    const { data } = this.props;
    const { WARNING_EMAIL_DATA } = STATIC_GRAPH_DATA;
    if (!data && !data.data) return;
    const warningCountData = data.data && data.data[0];
    const warningEmailData = warningCountData && WARNING_EMAIL_DATA.map(item => {
      return (
        {...item, y: warningCountData[item.drilldown]}
      )
    })
    $(this.container).highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Warning Emails Count'
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Count'
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
          }
        }
      },
      tooltip: {
        formatter: function () {
          return `<span style="color:${this.point.color}">${this.point.drilldown}</span>: <b>${this.point.y}`;
        }
      },
      series: [{
        name: 'Status',
        colorByPoint: true,
        data: warningEmailData
      }]
    });
  }
}
