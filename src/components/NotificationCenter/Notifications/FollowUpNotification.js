import React from 'react';
import Common from './Common';
export class FollowUpNotification extends Common {
  logoIconClass = 'icon s7-date';

  get content() {
    const { id, incident, } = this.props;
    const { incidents_url } = this.context;

    return (
      <div>
        Follow Up: Incident&nbsp;
        <a href={`${incidents_url}/${incident.id}/edit`}>
          #{incident.incident_id}
        </a>
      </div>
    )
  }
};
