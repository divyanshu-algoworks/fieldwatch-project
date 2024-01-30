import React from 'react';
import Common from './Common';
export class RepresentativeSmsReceiveNotification extends Common {
  logoIconClass = 'icon s7-phone';

  get content() {
    return (
      <span className="name">Not Assigned SMS From {this.props.representative_sms.from}</span>
    );
  }
};
