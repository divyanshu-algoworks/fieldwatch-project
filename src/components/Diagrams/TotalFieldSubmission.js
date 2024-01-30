import CommonDiagram from "./CommonDiagram";
import { autobind } from "core-decorators";

export default class TotalFieldSubmission extends CommonDiagram {
  @autobind drawChart() {
    const { data } = this.props;
    const getTooltipWidth = (length) => {
     switch(length) {
      case 4: return 50
      case 3: return 60
      case 2: return 90
      case 1: return 170
      default: return 30
     }
    }
    if (!data.data) return;
    $(this.container).highcharts({
      chart: {
        type: "column",
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: data.data.map(({ year_and_month }) => year_and_month),
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: "Action count",
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">Count: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
        positioner: function(labelWidth, labelHeight, point) {
          console.log(getTooltipWidth(data.data.length))
          let tooltipX = point.plotX + getTooltipWidth(data.data.length)
          let tooltipY = point.plotY - 20
          return {
              x: tooltipX,
              y: tooltipY
          };
      },
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: "Field Submission Count",
          data: data.data.map(
            ({ field_submission_count }) => field_submission_count
          ),
        },
        {
          name: "Reported Incident Count",
          data: data.data.map(
            ({ reported_incident_count }) => reported_incident_count
          ),
        },
      ],
    });
  }
}
