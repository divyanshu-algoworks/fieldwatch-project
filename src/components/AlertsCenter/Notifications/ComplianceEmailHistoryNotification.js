import React from 'react';
import Common from './Common';
export class ComplianceEmailHistoryNotification extends Common {
  get logoIconClass() {
    const { is_viewed } = this.props;
    return is_viewed ? 'icon s7-mail-open' : 'icon s7-mail';
  }

  get content() {
    const { id, incident, } = this.props;
    const { incidents_url } = this.context;

    return (
      <div>
        New mail: Incident&nbsp;
        <a className="c-orange" target="_blank" href={`${incidents_url}/${incident.id}/edit`}>
          #{incident.incident_id}
        </a>
      </div>
    )
  }
};
