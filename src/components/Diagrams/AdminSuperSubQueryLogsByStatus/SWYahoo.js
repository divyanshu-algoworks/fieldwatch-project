import AdminSuperSubQueryLogsByStatus from "Components/Diagrams/AdminSuperSubQueryLogsByStatus";

export default class AdminSWYahooSuperSubQueryLogsByStatus extends AdminSuperSubQueryLogsByStatus {
  get successData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_success_sw_yahoo_cnt]);
  }

  get runnedData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_runned_sw_yahoo_cnt]);
  }

  get noResultData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_no_results_sw_yahoo_cnt]);
  }

  get internalErrorData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_internal_error_sw_yahoo_cnt]);
  }

  get errorResultData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_error_result_sw_yahoo_cnt]);
  }

  get totalData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_summary_sw_yahoo_cnt]);
  }
}
