export const STATIC_GRAPH_DATA = {
  INCIDENT_BY_STATUS_DATA: [
    { drilldown: "Status", name: "Status", y: 71 },
    { drilldown: "Frozen", name: "Frozen", y: 21 },
    { drilldown: "Closed Incident", name: "Closed Incident", y: 24 },
    { drilldown: "New", name: "New", y: 100 },
    { drilldown: "Other", name: "Other", y: 50 },
    { drilldown: "pass", name: "pass", y: 20 },
  ],

  INCIDENT_AVERAGE_RESOLUTION_TIME: {
    categories: ["TestRiskLevel", "Low", "test lang risk level", "high"],
    data: [15, 61, 75, 90],
  },

  INCIDENT_BY_CATEGORY: [
    { drilldown: "Test Category", name: "Test Category", y: 45 },
    { drilldown: "Category2", name: "Category2", y: 55 },
    { drilldown: "Other", name: "Other", y: 65 },
    { drilldown: "qwe", name: "qwe", y: 20 },
    { drilldown: "abc", name: "abc", y: 10 },
    { drilldown: "manishdes", name: "manishdes", y: 30 },
  ],

  TOP_TEN_KEYWORDS_DATA: [
    ["pro", 18],
    ["product", 12],
    ["the", 25],
    ["heal", 15],
    ["ill", 7],
    ["ment", 16],
    ["als", 12],
    ["over", 15],
    ["help", 10],
    ["home", 15],
    ["uti", 20],
    ["check", 25],
  ],

  INCIDENTS_TRENDS_OVER_TIME: {
    closed_opened: {
      categories: [
        "07/30/2020",
        "07/31/2020",
        "08/01/2020",
        "08/02/2020",
        "08/03/2020",
        "08/04/2020",
        "08/05/2020",
        "08/06/2020",
        "08/07/2020",
        "08/08/2020",
        "08/09/2020",
        "08/10/2020",
        "08/11/2020",
        "08/12/2020",
        "08/13/2020",
        "08/14/2020",
        "08/15/2020",
        "08/16/2020",
        "08/17/2020",
        "08/18/2020",
        "08/19/2020",
        "08/20/2020",
        "08/24/2020",
        "08/25/2020",
        "08/26/2020",
        "08/27/2020",
        "08/28/2020",
        "08/29/2020",
        "08/31/2020",
        "09/02/2020",
        "09/03/2020",
      ],
      series: [
        {
          data: [
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
            2, 2, 2, 2, 2, 2, 2, 2,
          ],
          name: "Cat1",
        },
        {
          data: [
            3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
            3, 3, 3, 3, 3, 3, 3, 3,
          ],
          name: "Cat2",
        },
        {
          data: [
            4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
            4, 4, 4, 4, 4, 4, 4, 4,
          ],
          name: "Cat3",
        },
        {
          data: [
            5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
            5, 5, 5, 5, 5, 5, 5, 5,
          ],
          name: "Cat4",
        },
        {
          data: [
            6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
            6, 6, 6, 6, 6, 6, 6, 6,
          ],
          name: "Cat5",
        },
        {
          data: [
            7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
            7, 7, 7, 7, 7, 7, 7, 7,
          ],
          name: "Cat6",
        },
      ],
    },
  },

  INCIDENT_USER_ACTIVITY: [
    { title: "Total Actions", value: "3h 15m" },
    { title: "AVG Time Between Actions", value: 6 },
    { title: "Incidents Created", value: 10 },
    { title: "Incidents Closed", value: 8 },
    { title: "Incidents Updated", value: 12 },
  ],

  ACTIONS_ANALYTICS: {
    ["Add comment"]: 4,
    ["Add compliance action"]: 2,
    ["Add file"]: 9,
    ["Add image"]: 4,
    ["Assigned to incident"]: 5,
    ["Change owner"]: 5,
    ["Create incident"]: 9,
    ["Marked as edge case"]: 3,
    ["Send compliance email"]: 4,
    ["Send training email"]: 2,
  },

  AVERAGE_ACTIONS_PER_DAY: [
    { full_name: "Chander Shekhar", avg_number: 2 },
    { full_name: "client1 Admin_1", avg_number: 8 },
    { full_name: "Manish1 FWadmin", avg_number: 6 },
    { full_name: "Manish Chaubey", avg_number: 1 },
    { full_name: "manish_client admin", avg_number: 9 },
    { full_name: "manish FWspecialist", avg_number: 4 },
    { full_name: "manish specialist", avg_number: 4 },
    { full_name: "ronnen holf", avg_number: 7 },
    { full_name: "Vignesh", avg_number: 3 },
  ],

  AVERAGE_TIME_BW_ACTIONS_BY_USER: [
    {
      full_name: "Chander Shekhar",
      avg_in_days: "0d 05h 07m",
      avg_in_hours: "5.128652",
    },
    {
      full_name: "client1 Admin_1",
      avg_in_days: "0d 07h 09m",
      avg_in_hours: "7.312433",
    },
    {
      full_name: "Manish1 FWadmin",
      avg_in_days: "0d 03h 09m",
      avg_in_hours: "3.312433",
    },
    {
      full_name: "Manish Chaubey",
      avg_in_days: "0d 01h 08m",
      avg_in_hours: "1.312433",
    },
    {
      full_name: "manish_client admin",
      avg_in_days: "0d 02h 09m",
      avg_in_hours: "2.312433",
    },
    {
      full_name: "manish FWspecialist",
      avg_in_days: "0d 06h 09m",
      avg_in_hours: "6.312433",
    },
    {
      full_name: "manish specialist",
      avg_in_days: "0d 01h 09m",
      avg_in_hours: "1.312433",
    },
    {
      full_name: "ronnen holf",
      avg_in_days: "0d 08h 09m",
      avg_in_hours: "8.312433",
    },
    {
      full_name: "Vignesh",
      avg_in_days: "0d 4h 09m",
      avg_in_hours: "4.312433",
    },
  ],

  AMOUNT_OF_ACTIONS_BY_DAY: [
    { date: "2023-04-03", count: 17 },
    { date: "2023-04-04", count: 20 },
    { date: "2023-04-05", count: 10 },
    { date: "2023-04-06", count: 25 },
    { date: "2023-04-10", count: 14 },
  ],

  AVERAGE_TIME_BW_ACTIONS_BY_INCIDENT: [
    {
      incident_number: "2023-04-00001",
      avg_in_days: "0d 09h 07m",
      avg_in_hours: "9.128652",
    },
    {
      incident_number: "2023-04-00002",
      avg_in_days: "0d 02h 09m",
      avg_in_hours: "2.312433",
    },
    {
      incident_number: "2023-04-00003",
      avg_in_days: "0d 06h 09m",
      avg_in_hours: "6.312433",
    },
    {
      incident_number: "2023-04-00004",
      avg_in_days: "0d 04h 08m",
      avg_in_hours: "1.412433",
    },
    {
      incident_number: "2023-04-00005",
      avg_in_days: "0d 08h 09m",
      avg_in_hours: "8.312433",
    },
    {
      incident_number: "2023-04-00006",
      avg_in_days: "0d 01h 09m",
      avg_in_hours: "1.312433",
    },
    {
      incident_number: "2023-04-00007",
      avg_in_days: "0d 06h 09m",
      avg_in_hours: "6.312433",
    },
    {
      incident_number: "2023-04-00008",
      avg_in_days: "0d 1h 09m",
      avg_in_hours: "1.312433",
    },
    {
      incident_number: "2023-04-00009",
      avg_in_days: "0d 8h 09m",
      avg_in_hours: "8.312433",
    },
  ],

  TRAINING_SCORES: [
    { score: "0-10", reps_count: 0 },
    { score: "10-20", reps_count: 0 },
    { score: "20-30", reps_count: 10 },
    { score: "30-40", reps_count: 40 },
    { score: "40-50", reps_count: 80 },
    { score: "50-60", reps_count: 20 },
    { score: "60-70", reps_count: 200 },
    { score: "70-80", reps_count: 100 },
    { score: "80-90", reps_count: 400 },
    { score: "90-100", reps_count: 300 },
  ],

  COMPLIANCE_DATA: [
    { drilldown: "Compliant Requests", name: "Compliant Requests", y: 10 },
    {
      drilldown: "Non-Compliant Requests",
      name: "Non-Compliant Requests",
      y: 7,
    },
  ],

  TOP_TEN_KEYWORD_DATA: [
    { serial: 1, drilldown: "cures", name: "cures", y: 10 },
    { serial: 2, drilldown: "covid", name: "covid", y: 7 },
    { serial: 3, drilldown: "virus", name: "virus", y: 12 },
    { serial: 4, drilldown: "covid-19", name: "covid-19", y: 15 },
    { serial: 5, drilldown: "immunity", name: "immunity", y: 9 },
    { serial: 6, drilldown: "income", name: "income", y: 4 },
    { serial: 7, drilldown: "antiviral", name: "antiviral", y: 5 },
    { serial: 8, drilldown: "treat", name: "treat", y: 13 },
    { serial: 9, drilldown: "cancer", name: "cancer", y: 6 },
    { serial: 10, drilldown: "medicine", name: "medicine", y: 14 },
  ],

  WARNING_EMAIL_DATA: [
    { serial: 1, drilldown: "total_incidents", name: "Total number of incidents"},
    { serial: 2, drilldown: "unresolved_by_month", name: "Number of incidents unresolved"},
    { serial: 3, drilldown: "resolved_without_compliance_email_history", name: "Resolved without compliance email"},
    { serial: 4, drilldown: "resolved_after_1st_email", name: "Number of incidents resolved after 1st email"},
    { serial: 5, drilldown: "resolved_after_2nd_email", name: "Number of incidents resolved after 2nd email"},
    { serial: 6, drilldown: "resolved_after_3rd_email", name: "Number of incidents resolved after 3rd email"},

  ],

  SMS_DATA: [
    { month: "2019-07", sms_count: 3, total_price: 0.03 },
    { month: "2019-12", sms_count: 2, total_price: 0.02 },
    { month: "2020-01", sms_count: 1, total_price: 0.01 },
    { month: "2020-03", sms_count: 1, total_price: 0.01 },
    { month: "2020-04", sms_count: 1, total_price: 0.01 },
    { month: "2020-08", sms_count: 2, total_price: 0.02 },
    { month: "2020-10", sms_count: 2, total_price: 0.02 },
    { month: "2021-10", sms_count: 2, total_price: 0.02 },
    { month: "2021-11", sms_count: 1, total_price: 0.01 },
    { month: "2022-05", sms_count: 2, total_price: 0.02 },
    { month: "2022-08", sms_count: 1, total_price: 0.01 },
  ],

  USER_ACTIVITY_TIME: {
    data: [
      { week_day: "Monday", activity_hours: 1000 },
      { week_day: "Tuesday", activity_hours: 1200 },
      { week_day: "Wednesday", activity_hours: 1800 },
      { week_day: "Thrusday", activity_hours: 2000 },
      { week_day: "Friday", activity_hours: 2200 },
      { week_day: "Saturday", activity_hours: 2400 },
      { week_day: "Sunday", activity_hours: 2600 },
    ],
  },
};
