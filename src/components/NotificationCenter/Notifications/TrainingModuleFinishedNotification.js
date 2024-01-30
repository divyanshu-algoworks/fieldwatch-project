import React from 'react';
import Common from './Common';
export class TrainingModuleFinishedNotification extends Common {
  logoIconClass = 'icon s7-news-paper';

  get content() {
    const { training, representative_id } = this.props;
    const { representatives_url } = this.context;
    if (!training.id) {
      return (<span className="name">Training Deleted</span>)
    }
    return (
      <a className="c-orange" href={`${representatives_url}/${representative_id}/trainings_actions_history`}>
        Training Module Finished: {training.name}
      </a>
    );
  }
};
