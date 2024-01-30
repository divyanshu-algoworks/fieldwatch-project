$('#incidents_by_status').highcharts({
  chart: {
    type: 'column'
  },
  title: {
    text: 'Incidents by Status'
  },
  subtitle: {
    text: ''
  },
  xAxis: {
    type: 'category'
  },
  yAxis: {
    title: {
      text: 'Total incidents'
    }
  },
  legend: {
    enabled: false
  },
  plotOptions: {
    series: {
      animation: false,
      enableMouseTracking: false,
      shadow: false,
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        format: '{point.y:f}'
      }
    }
  },
  series: [{
    name: 'Status',
    colorByPoint: true,
    data: chartData.incidentsByStatus.data
  }]
});


$('#incidents_by_category').highcharts({
  chart: {
    type: 'pie',
    options3d: {
      enabled: true,
      alpha: 45
    }
  },
  title: {
    text: 'Incidents by Category'
  },
  subtitle: {
    text: ''
  },
  plotOptions: {
    pie: {
      animation: false,
      enableMouseTracking: false,
      shadow: false,
      innerSize: 40,
      depth: 25,
      showInLegend: false,
      dataLabels: {
        enabled: true,
        formatter: function () {
          const total = this.series.data.reduce(function (sum, data) { return sum + data.y }, 0);
          var percent = Math.round(this.point.y / total * 10000) / 100;
          return '<span style="color:' + this.point.color + '">\u25CF </span>' + this.point.name + '\u00a0(<b>' + percent + '%</b>)';
        }
      },
      center: ["25%", "50%"]
    }
  },
  series: [{
    name: 'Incidents',
    data: chartData.incidentsByCategory.data
  }]
});

$('#incidents_average_resolution_time').highcharts({
  chart: {
    type: 'bar'
  },
  title: {
    text: 'Average Incident Resolution Time'
  },
  xAxis: {
    categories: chartData.incidentsAverageResolutionTime.categories,
    title: {
      text: null
    }
  },
  yAxis: {
    min: 0,
    title: {
      text: '',
      align: 'high'
    },
    labels: {
      overflow: 'justify'
    }
  },
  tooltip: {
    valueSuffix: ''
  },
  plotOptions: {
    bar: {
      animation: false,
      enableMouseTracking: false,
      shadow: false,
      dataLabels: {
        enabled: true
      }
    }
  },
  legend: {
    enabled: false
  },
  credits: {
    enabled: false
  },
  series: [{
    name: 'Average time per incident',
    data: chartData.incidentsAverageResolutionTime.data
  }]
});

$('#incidents_trends_over_time').highcharts({
  plotOptions: {
    line: {
      animation: false,
      enableMouseTracking: false,
      shadow: false
    }
  },
  title: {
    text: 'Trends over Time',
    x: -20 //center
  },
  xAxis: {
    categories: chartData.incidentsTrendsOverTime.categories
  },
  yAxis: {
    title: {
      text: 'Incidents'
    },
    plotLines: [{
      value: 0,
      width: 1,
      color: '#808080'
    }]
  },
  tooltip: {
    valueSuffix: ''
  },
  legend: {
    borderWidth: 0
  },
  series: chartData.incidentsTrendsOverTime.series
});


$('#incidents_keywords').highcharts({
  chart: {
    type: 'column'
  },
  plotOptions: {
    column: {
      animation: false,
      enableMouseTracking: false,
      shadow: false
    }
  },
  title: {
    text: 'Top 10 Keywords'
  },
  xAxis: {
    type: 'category',
    labels: {
      rotation: -45,
      style: {
        fontSize: '13px',
        fontFamily: 'Verdana, sans-serif'
      }
    }
  },
  yAxis: {
    min: 0,
    title: {
      text: 'incidents'
    }
  },
  legend: {
    enabled: false
  },
  tooltip: {
    pointFormat: '<b>{point.y}</b> incident(s)'
  },
  series: [{
    name: 'Population',
    data: chartData.incidentsKeywords.data,
    dataLabels: {
      enabled: true,
      rotation: -90,
      color: '#FFFFFF',
      align: 'right',
      format: '{point.y}', // one decimal
      y: 10, // 10 pixels down from the top
      style: {
        fontSize: '13px',
        fontFamily: 'Verdana, sans-serif'
      }
    }
  }]
});


