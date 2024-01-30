import React from 'react';
import Common from './Common';
export class SmsMonthlyLimitExceededNotification extends Common {
  logoIconClass = 'icon s7-attention';

  get content() {
    return (
      <span className="name">SMS Monthly Limit Exceeded for client {this.props.client.name}</span>
    );
  }
};
