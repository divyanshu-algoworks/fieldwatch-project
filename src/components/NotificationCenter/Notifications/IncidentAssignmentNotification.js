import React from 'react';
import Common from './Common';
export class IncidentAssignmentNotification extends Common {
  logoIconClass = 'icon s7-news-paper';

  get content() {
    const { id, incident, } = this.props;
    const { incidents_url } = this.context;

    if (!!incident.id) {
      return (
        <a href={`${incidents_url}/${incident.id}/edit`}>
          Incident Assignment: #{incident.incident_id}
        </a>
      );
    }

    return (<span className="name">Incident Deleted</span>);
  }
};
