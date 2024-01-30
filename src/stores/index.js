import * as mobx from 'mobx';
import { store } from 'rfx-core';
import DataState from './DataState';
import NoticeState from './NoticeState';
import QueryResultTabState from './QueryResultTabState';
import RepImportsState from './RepImportsState';
import IncidentState from './IncidentState';
import RepresentativeState from './RepresentativeState';
import CommentsState from './CommentsState';
import ActionsHistoryState from './ActionsHistoryState';
import ComplianceEmailState from './ComplianceEmailState';
import EmailFormState from './EmailFormState';
import SmsFormState from './SmsFormState';
import IncidentFilesState from './IncidentFilesState';
import IncidentScreenshotsState from './IncidentScreenshotsState';
import SendTrainingDialogState from './SendTrainingDialogState';
import RelatedIncidentsState from './RelatedIncidentsState';
import SingleUrlQueriesState from './SingleUrlQueriesState';
import SearchResultsState from './SearchResultsState';
import FieldsState from './FieldsState';
import IncidentUserActivitiesState from './IncidentUserActivitiesState';
import ResultUserActivitiesState from './ResultUserActivitiesState';
import FiltersState from './FiltersState';
import AdminSearchResultsState from './AdminSearchResultsState';
import DashboardState from './DashboardState';
import WidgetFormState from './WidgetFormState';
import RepresentativesState from './RepresentativesState';
import RepresentativeLinksState from './RepresentativeLinksState';
import IncidentsState from './IncidentsState';
import AnalyticsIncidentState from './AnalyticsIncidentState';
import AnalyticsIncidentFiltersState from './AnalyticsIncidentFiltersState';
import FilterViewState from './FilterViewState';
import QueryFormState from './QueryFormState';
import ActivityLogsState from './ActivityLogsState';
import NPSQuestionState from './NPSQuestionState';
import ResultsImportState from './ResultsImportState';
import ResultsState from './ResultsState';
import SuperHitsState from './SuperHitsState';
import QueryLogsState from './QueryLogsState';
import SubQueryLogsState from './SubQueryLogsState';
import AdminIncidentAnalyticsState from './AdminIncidentAnalyticsState';
import UserInfoState from './UserInfoState';

// mobx.configure({ enforceActions: 'always' });

export default store.setup({
  DataState,
  NoticeState,
  QueryResultTabState,
  IncidentState,
  RepresentativeState,
  CommentsState,
  ActionsHistoryState,
  ComplianceEmailState,
  IncidentFilesState,
  IncidentScreenshotsState,
  EmailFormState,
  SmsFormState,
  SendTrainingDialogState,
  RelatedIncidentsState,
  SingleUrlQueriesState,
  SearchResultsState,
  FieldsState,
  RepImportsState,
  IncidentUserActivitiesState,
  ResultUserActivitiesState,
  FiltersState,
  AdminSearchResultsState,
  DashboardState,
  WidgetFormState,
  RepresentativesState,
  RepresentativeLinksState,
  IncidentsState,
  AnalyticsIncidentState,
  AnalyticsIncidentFiltersState,
  FilterViewState,
  QueryFormState,
  ActivityLogsState,
  NPSQuestionState,
  ResultsImportState,
  ResultsState,
  SuperHitsState,
  QueryLogsState,
  SubQueryLogsState,
  AdminIncidentAnalyticsState,
  UserInfoState
});
