import React from 'react';
import Input from '../../../components/Input';
import Common from './Common';

export class Offender extends Common {
  handleChangeInput = ({ target }) => {
    if(Number.isInteger(parseInt(target.value)) && target.value.length <= 8){
      this.setState({ data: target.value.replace(/[^0-9]/g, '').slice(0, 8) })
    }else {
      console.log(typeof target.value)
      this.setState({ data: target.value.replace(/[^0-9]/g, '').slice(0, 8) }) 
    }
  };

  get dialogBody() {
    const { data } = this.state;
    return (
      <div className="grid__col grid__col--12">
        <div>Representatives with incidents greater than equal to
        <Input value={data} onChange={this.handleChangeInput}
          className="w-100p-offener"
          placeholder={this.props.inputPlaceholder} /> incidents          
        </div>        
      </div>
    );
  }
}
