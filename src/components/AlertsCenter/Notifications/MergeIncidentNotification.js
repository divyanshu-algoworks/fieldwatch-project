import React from 'react';
import Common from './Common';
export class MergeIncidentNotification extends Common {
  logoIconClass = 'icon s7-news-paper';

  get content() {
    const { id, incident, } = this.props;
    const { incidents_url } = this.context;

    return (
      <div>
        Incident Merged to:&nbsp;
        <a href={`${incidents_url}/${incident.id}/edit`}>
          #{incident.incident_id}
        </a>
      </div>
    )
  }
};
