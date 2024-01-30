import { DATE_RANGE_TYPES } from '../constants/DateRangeTypes';
export const DEFAULT_FILTER_WIDTH = 4;

export const FILTER_PARAMS = {
  actions: {
    label: 'Actions',
    allLabel: 'All Actions',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  incident_user_actions: {
    label: 'Actions',
    allLabel: 'All Actions',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  result_user_actions: {
    label: 'Actions',
    allLabel: 'All Actions',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  clients: {
    label: 'Clients',
    allLabel: 'All Clients',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  compliance_action_options: {
    label: 'Compliance Action Options',
    allLabel: 'All Compliance Action Options',
    type: 'checklist',
    width: 8,
  },
  created_at_range: {
    label: 'Date Ranges',
    type: 'daterange',
    width: DEFAULT_FILTER_WIDTH,
  },
  search_systems: {
    label: 'Search Systems',
    allLabel: 'All Search Systems',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },

  statuses: {
    label: 'Statuses',
    allLabel: 'All Statuses',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  participants: {
    label: 'Team Members',
    allLabel: 'All Team Members',
    type: 'checklist',
    checkboxLabelFn: ({ first_name, last_name }) =>
      `${first_name} ${last_name}`,
    width: DEFAULT_FILTER_WIDTH,
  },
  risk_levels: {
    label: 'Risk Levels',
    allLabel: 'All Risk Levels',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  tags: {
    label: 'Tags',
    allLabel: 'All Tags',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  rep_groups: {
    label: 'Rep Groups',
    allLabel: 'All Rep Groups',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  rep_countries: {
    label: 'Rep Countries',
    allLabel: 'All Rep Countries',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  rep_states: {
    label: 'Rep State',
    allLabel: 'All State',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  owners: {
    label: 'Owners',
    allLabel: 'All Owners',
    type: 'checklist',
    checkboxLabelFn: ({ full_name }) => full_name,
    width: DEFAULT_FILTER_WIDTH,
  },
  categories: {
    label: 'Categories',
    allLabel: 'All Categories',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  rep_ranks: {
    label: 'Rep Ranks',
    allLabel: 'All Rep Ranks',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  additional_rep_ranks: {
    label: window.location.href.includes('187') ? 'Alternate Ranks' : 'Lifetime Ranks',
    allLabel: window.location.href.includes('187') ? 'All Alternate Ranks' : 'All Lifetime Ranks',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  territories: {
    label: 'Territories',
    allLabel: 'All Territories',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  social_media: {
    label: 'Social Media',
    allLabel: 'All Social Media',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  claims_rules: {
    label: 'Claims Rules',
    allLabel: 'All CLaims Rules',
    type: 'radiolist',
    width: DEFAULT_FILTER_WIDTH,
  },
  field_submissions: {
    label: 'Field Submissions',
    allLabel: 'All Field Submissions',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  policies: {
    label: 'Policies',
    allLabel: 'All Policies',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  edge_case: {
    label: 'Edge Case',
    type: 'edgecase',
    allLabel: 'All Edge Case',
    existLabel: 'Is Edge Case',
    notExistLabel: 'Not Edge Case',
    width: DEFAULT_FILTER_WIDTH,
  },
  creators: {
    label: 'Creators',
    allLabel: 'All Creators',
    type: 'checklist',
    checkboxLabelFn: ({ full_name }) => full_name,
    width: DEFAULT_FILTER_WIDTH,
  },
  updated_date: {
    label: 'Updated Date',
    type: 'daterange',
    width: DEFAULT_FILTER_WIDTH,
  },
  links: {
    label: 'URLs',
    allLabel: 'All URLs',
    type: 'text',
    dialogHeadeer: 'Incident URLs',
    placeholder: 'Enter URLs',
    width: DEFAULT_FILTER_WIDTH,
  },
  date_range: {
    label: 'Date Range',
    type: 'daterange',
    types: DATE_RANGE_TYPES,
    width: DEFAULT_FILTER_WIDTH,
  },
  post_date_range: {
    label: 'Post Date Range',
    type: 'daterange',
    timeDefault: 'all_period',
    width: DEFAULT_FILTER_WIDTH,
  },
  rep_values: {
    label: 'Representative',
    type: 'representative',
    uplineDownline: true,
    allLabel: 'All Representatives',
    autocompleteUrl: 'representatives',
    width: DEFAULT_FILTER_WIDTH,
  },
  follow_up_range: {
    label: 'Follow Up',
    type: 'daterange',
    shortRanges: true,
    width: DEFAULT_FILTER_WIDTH,
  },
  rep_join_date_range: {
    label: 'Rep Join Date',
    type: 'daterange',
    width: DEFAULT_FILTER_WIDTH,
  },
  comments: {
    label: 'Comments',
    allLabel: 'All Comments',
    dialogHeadeer: 'Incidents Comments',
    placeholder: 'Enter the comments text',
    type: 'text',
    width: DEFAULT_FILTER_WIDTH,
  },
  updated_date_range: {
    label: 'Updated Date',
    type: 'daterange',
    width: DEFAULT_FILTER_WIDTH,
  },
  email_response_received: {
    label: 'Email Response Received',
    type: 'daterange',
    width: DEFAULT_FILTER_WIDTH,
  },
  incident: {
    label: 'Incidents Presence',
    type: 'edgecase',
    allLabel: 'All',
    existLabel: 'Yes',
    notExistLabel: 'No',
    width: DEFAULT_FILTER_WIDTH,
  },
  incident_categories: {
    label: 'Incident Categories',
    type: 'checklist',
    allLabel: 'All Incident Categories',
    width: DEFAULT_FILTER_WIDTH,
  },
  incident_territories: {
    label: 'Incident Territories',
    type: 'checklist',
    allLabel: 'All Incident Territories',
    width: DEFAULT_FILTER_WIDTH,
  },
  compliance_emails: {
    label: 'Compliance Emails',
    type: 'checklist',
    allLabel: 'All Compliance Emails',
    width: DEFAULT_FILTER_WIDTH,
  },
  trainings: {
    label: 'Trainings',
    type: 'checklist',
    allLabel: 'All Trainings',
    width: DEFAULT_FILTER_WIDTH,
  },
  rep_statuses: {
    label: 'Rep Statuses',
    type: 'checklist',
    allLabel: 'All Rep Statuses',
    width: DEFAULT_FILTER_WIDTH,
  },
  rep_ranks: {
    label: 'Rep Ranks',
    type: 'checklist',
    allLabel: 'All Rep Ranks',
    width: DEFAULT_FILTER_WIDTH,
  },
  reported_date_range: {
    label: 'Reported Date Range',
    type: 'daterange',
    allLabel: 'All Reported Date Ranges',
    width: DEFAULT_FILTER_WIDTH,
  },
  join_date_range: {
    label: 'Join Date Range',
    type: 'daterange',
    timeDefault: 'all_period',
    allLabel: 'All Join Date Ranges',
    width: DEFAULT_FILTER_WIDTH,
  },
  countries: {
    label: 'Countries',
    type: 'checklist',
    allLabel: 'All Countries',
    width: DEFAULT_FILTER_WIDTH,
  },
  incident_policies: {
    label: 'Incident Policies',
    type: 'checklist',
    allLabel: 'All Incident Policies',
    width: DEFAULT_FILTER_WIDTH,
  },
  incident_tags: {
    label: 'Incident Tags',
    type: 'checklist',
    allLabel: 'All Incident Tags',
    width: DEFAULT_FILTER_WIDTH,
  },
  representative_groups: {
    label: 'Rep Groups',
    type: 'checklist',
    allLabel: 'All Rep Groups',
    width: DEFAULT_FILTER_WIDTH,
  },
  root_representative: {
    label: 'Show Organization',
    type: 'representative',
    uplineDownline: false,
    allLabel: 'Show Organization',
    autocompleteUrl: 'root_representative',
    width: DEFAULT_FILTER_WIDTH,
  },
  users: {
    label: 'Users',
    type: 'checklist',
    allLabel: 'All Users',
    width: DEFAULT_FILTER_WIDTH,
  },
  reported_incidents_filter: {
    type: 'none',
  },
  roles: {
    type: 'checklist',
    label: 'Roles',
    allLabel: 'All Roles',
    width: DEFAULT_FILTER_WIDTH,
  },
  queries: {
    type: 'checklist',
    label: 'Queries',
    allLabel: 'All Queries',
    width: DEFAULT_FILTER_WIDTH,
  },
  deleted_queries: {
    type: 'checklist',
    label: 'Deleted Queries',
    allLabel: 'All Deleted Queries',
    width: DEFAULT_FILTER_WIDTH,
  },
  super_queries: {
    type: 'checklist',
    label: 'Super Queries',
    allLabel: 'All Super Queries',
    width: DEFAULT_FILTER_WIDTH,
  },
  single_site_queries: {
    type: 'checklist',
    label: 'Single Site Queries',
    allLabel: 'All Single Site Queries',
    width: DEFAULT_FILTER_WIDTH,
  },
  hit_state: {
    type: 'none',
  },
  trends_over_time_date_range: {
    label: 'Trends over Time',
    type: 'daterange',
    width: DEFAULT_FILTER_WIDTH,
  },
  metrics_date_range: {
    label: 'Date',
    type: 'daterange',
    width: DEFAULT_FILTER_WIDTH,
  },
  measure_date_range: {
    label: 'Date',
    type: 'daterange',
    width: DEFAULT_FILTER_WIDTH,
  },
  executed_at_range: {
    label: 'Date Ranges',
    type: 'daterange',
    width: DEFAULT_FILTER_WIDTH,
  },
  executed_at_range: {
    label: 'Date Ranges',
    type: 'daterange',
    width: DEFAULT_FILTER_WIDTH,
  },
  send_date_range: {
    label: 'Send Date',
    type: 'daterange',
    width: DEFAULT_FILTER_WIDTH,
  },
  received_date_range: {
    label: 'Received Date',
    timeDefault: 'all_period',
    type: 'daterange',
    width: DEFAULT_FILTER_WIDTH,
  },
  completed_date_range: {
    label: 'Completed Date',
    timeDefault: 'all_period',
    type: 'daterange',
    width: DEFAULT_FILTER_WIDTH,
  },
  sent_from: {
    type: 'checklist',
    label: 'Sent From',
    allLabel: 'All Pages',
    width: DEFAULT_FILTER_WIDTH,
  },
  show_deleted: {
    label: 'Show Deleted',
    type: 'edgecase',
    allLabel: 'All',
    existLabel: 'Yes',
    notExistLabel: 'No',
    width: DEFAULT_FILTER_WIDTH,
  },
  offender: {
    label: 'Offender',
    allLabel: 'All Incidents',
    type: 'offender',
    width: DEFAULT_FILTER_WIDTH,
  },
  language: {
    label: 'Language',
    allLabel: 'All Language',
    type: 'checklist',
    width: DEFAULT_FILTER_WIDTH,
  },
  incident_links: {
    label: 'Incident Links Statuses',
    type: 'checklist',
    allLabel: 'All Resolved',
    width: DEFAULT_FILTER_WIDTH,
  },
};

export const INCIDENTS_FILTERS_NAMES = [
  'date_range',
  'rep_values',
  'follow_up_range',
  'statuses',
  'policies',
  'tags',
  'edge_case',
  'rep_join_date_range',
  'rep_ranks',
  'categories',
  'rep_countries',
  'territories',
  'links',
  'owners',
  'creators',
  'risk_levels',
  'comments',
  'updated_date_range',
  'rep_groups',
  'rep_statuses',
  'email_response_received',
  'offender',
  'language',
  'incident_links'
];

// export const INCIDENT_ANALYTICS_FILTERS_NAMES = INCIDENTS_FILTERS_NAMES.concat([
//   'trends_over_time_date_range'
// ]);

export const INCIDENT_ANALYTICS_FILTERS_NAMES = [
  'date_range',
  'follow_up_range',
  'statuses',
  'policies',
  'tags',
  'edge_case',
  'rep_join_date_range',
  'rep_ranks',
  'categories',
  'rep_countries',
  'territories',
  'owners',
  'creators',
  'risk_levels',
  'updated_date_range',
  'rep_groups',
  'rep_statuses',
  'trends_over_time_date_range',
  'offender',
  'language',
];
