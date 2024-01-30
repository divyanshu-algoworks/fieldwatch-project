import React from 'react';
import Preloader from 'Components/Preloader';
import TabStates from 'Components/TabStates';
import CommonDiagram from './CommonDiagram';
import { getClientType } from 'Helpers/cookie';
export default class IncidentsStatistic extends CommonDiagram {
  drawChart() {
  }

  static defaultProps = {
    data: [],
    //size: 'nano',
  }

  render() {
    const { data, loading, size } = this.props;
    const client_type = getClientType();
    let tabs = null;
    if (!!loading) {
      return (<Preloader height="120px" />);
    }
    if (!!data && data.msg) {
      return (<div className="chart-msg">{data.msg}</div>);
    }

    if (!!data.hits_statistic) {
      tabs = Object.keys(data.hits_statistic).map(key => {
        return { title: key, value: data.hits_statistic[key] };
      });
    }

    return (
      <div className={`graph-container graph-container--${size}`} ref={(r) => { this.container = r; }}>
        <div className="incidents-statistic">
          <div className="incidents-statistic__numbers">
            <div className="incident-number">
              <div className="incident-number__number incident-number__number--blue">
                {client_type && client_type.includes('fc') && !data.total_incidents ? '100' : data.total_incidents}
              </div>
              <div className="incident-number__description">
                Total Incidents
              </div>
            </div>
            <div className="incident-number">
              <div className="incident-number__number incident-number__number--blue">
                {client_type && client_type.includes('fc') && !data.total_resolved ? '75' : data.total_resolved}
              </div>
              <div className="incident-number__description">
                Total Resolved
              </div>
            </div>
          </div>
          <div className="incidents-statistic__numbers ml-10">
            <div className="incident-number">
              <div className="incident-number__number incident-number__number--blue">
                {client_type && client_type.includes('fc') && !data.total_incidents ? '100' : data.total_links}
              </div>
              <div className="incident-number__description">
                Total Links
              </div>
            </div>
            <div className="incident-number">
              <div className="incident-number__number incident-number__number--blue">
                {client_type && client_type.includes('fc') && !data.total_resolved ? '75' : data.total_resolved_links}
              </div>
              <div className="incident-number__description">
                Total Resolved Count
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
