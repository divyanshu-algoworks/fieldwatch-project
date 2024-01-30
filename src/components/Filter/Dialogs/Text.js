import React from 'react';
import Input from '../../../components/Input';
import Common from './Common';

export class Text extends Common {
  handleChangeInput = ({ target }) => this.setState({ data: target.value });

  get dialogBody() {
    const { data } = this.state;
    return (
      <div className="grid__col grid__col--12">
        <Input value={data} onChange={this.handleChangeInput}
          className="w-100p"
          placeholder={this.props.inputPlaceholder} />
      </div>
    );
  }
}
