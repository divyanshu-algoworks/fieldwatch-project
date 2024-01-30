import CommonDiagram from "Components/Diagrams/CommonDiagram";

export default class AdminSuperSubQueryLogsByStatus extends CommonDiagram {
  get series() {
    return [{
      name: 'Success',
      data: this.successData,
      color: '#84f787',
    }, {
      name: 'Runned',
      data: this.runnedData,
      color: '#42a7f4',
    }, {
      name: 'No Result',
      data: this.noResultData,
      color: '#aaaaaa'
    }, {
      name: 'Internal Error',
      data: this.internalErrorData,
      color: '#ef8170',
    }, {
      name: 'Error Result',
      data: this.errorResultData,
      color: '#f9b5ab',
    }, {
      type: 'spline',
      name: 'Summary',
      data: this.totalData,
      marker: {
        lineWidth: 2,
        lineColor: Highcharts.getOptions().colors[3],
        fillColor: 'white'
      }
  }]
  }

  get successData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_success_cnt]);
  }

  get runnedData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_runned_cnt]);
  }

  get noResultData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_no_results_cnt]);
  }

  get internalErrorData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_internal_error_cnt]);
  }

  get errorResultData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_error_result_cnt]);
  }

  get totalData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_summary_cnt]);
  }

  drawChart = () => {
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
        type: 'datetime'
      },
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      tooltip: {
        shared: true,
        crosshairs: true
      },
      series: this.series
    })
  }
}
