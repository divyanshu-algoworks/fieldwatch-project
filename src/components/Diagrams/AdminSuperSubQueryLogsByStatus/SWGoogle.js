import AdminSuperSubQueryLogsByStatus from "Components/Diagrams/AdminSuperSubQueryLogsByStatus";

export default class AdminSWGoogleSuperSubQueryLogsByStatus extends AdminSuperSubQueryLogsByStatus {
  get successData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_success_sw_google_cnt]);
  }

  get runnedData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_runned_sw_google_cnt]);
  }

  get noResultData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_no_results_sw_google_cnt]);
  }

  get internalErrorData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_internal_error_sw_google_cnt]);
  }

  get errorResultData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_error_result_sw_google_cnt]);
  }

  get totalData() {
    return this.props.data.map((i) => [Date.parse(i.measure_date), i.super_sub_query_log_summary_sw_google_cnt]);
  }
}
