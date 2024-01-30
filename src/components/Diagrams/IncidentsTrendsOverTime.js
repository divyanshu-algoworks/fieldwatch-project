import React from 'react';
import CommonDiagram from './CommonDiagram';
import { autobind } from 'core-decorators';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { getClientType } from 'Helpers/cookie';
import { STATIC_GRAPH_DATA } from './StaticGraphsData';
import Preloader from 'Components/Preloader';

class IncidentsKeywordsDiagram extends CommonDiagram {
  shouldComponentUpdate({ data, loading }) {
    if (data == undefined) {
      return false;
    }

    const { categories, series } = data;
    return (
      !categories || !series ||
      (loading !== this.props.loading) ||
      (data.length !== this.props.data.length) ||
      (categories.some((category, i) => category !== this.props.data.categories[i])) ||
      (series.some(({ name, data }, i) => {
        return (name !== this.props.data.series[i].name) ||
          (JSON.stringify(data) !== JSON.stringify(this.props.data.series[i].data));
      }))
    );
  }
  @autobind drawChart() {
    const { data } = this.props;
    if (data == undefined || !data.series) {
      return;
    }

    $(this.container).highcharts({
      title: {
        text: '',
        x: -20 //center
      },
      xAxis: {
        categories: data.categories
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
        crosshairs: {
          dashStyle: 'solid',
          color: '#000',
          width: 1,
        },
        shared: true,
      },
      legend: {
        borderWidth: 0
      },
      series: data.series
    });
  }
}


function IncidentsKeywordsDiagrams({ loading, data, size }) {
  if (!!loading || !data || (!data.opened && !data.closed)) {
    return (<Preloader height="120px" />);
  }
  const { INCIDENTS_TRENDS_OVER_TIME } =  STATIC_GRAPH_DATA;
  const isNonFWClient = ['fc'].includes(getClientType());
  return (
    <Tabs>
      <TabList>
        <Tab>Opened</Tab>
        <Tab>Closed</Tab>
      </TabList>
      <TabPanel>
        <IncidentsKeywordsDiagram data={isNonFWClient && !data.opened.length ? INCIDENTS_TRENDS_OVER_TIME.closed_opened : data.opened} size={size} />
      </TabPanel>
      <TabPanel>
        <IncidentsKeywordsDiagram data={isNonFWClient && !data.closed.length ? INCIDENTS_TRENDS_OVER_TIME.closed_opened : data.closed} size={size} />
      </TabPanel>
    </Tabs>
  );
}

export default IncidentsKeywordsDiagrams;
