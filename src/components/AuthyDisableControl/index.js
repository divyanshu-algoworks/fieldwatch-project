import React, { Component } from 'react';
import Button from 'Components/Button';
import API from 'Helpers/api';
export default class AuthyDisableControl extends Component {
  disable = () => {
    const { paths, onChange, } = this.props;
    API.post(paths.disable_path).then(({ status }) => {
      if (!!status) {
        onChange(false);
      };
    });
  }
  render() {
    const { enabled } = this.props;

    if (!!enabled) {
      return (
        <Button size="big" status="orange" onClick={this.disable}>
          Disable Authy two factor authentication
        </Button>
      );
    }

    return (
      <div className="c-orange">
        Authy two factor authentication disabled
      </div>
    );
  }
}
