import React from 'react';
import Tooltip from '../../Tooltip';
import Common from './Common';
import classnames from 'classnames';


export class Radiolist extends Common {


    handleChangeCheckbox = (item, checked) => {
        const { data } = this.state;
        //console.log(item.id,item.target.checked,data,"28data");
        var dataCopy = JSON.parse(JSON.stringify(data));
        for (var i = 0; i < dataCopy.length; i++) {
            if (dataCopy[i].id == item.id) {
                dataCopy[i].checked = !dataCopy[i].checked;
            }
            else {
                dataCopy[i].checked = false;
            }
        }
        this.setState({ data: dataCopy, selected: item.id });
    }

    get dialogBody() {
        const { data } = this.state;
        const { checkboxLabelFn, name } = this.props;
        if (!data) {
            return;
        }
        return (
            <div className="grid">
                <div className="grid__row">
                    {data.map(item => {
                        const label = checkboxLabelFn ? checkboxLabelFn(item) : item.name;
                        return (
                            <div className="grid__col grid__col--4 filter-dialog__checkbox"
                                key={item.id}>
                                <Tooltip body={label}>
                                    <label className="fw-checkbox">
                                        <div className={classnames(`fw-checkbox__indicator`, {
        [`fw-checkbox__indicator--checked`]: item.checked
      })} />
                                        <input type="radio" className="fw-checkbox__input"
                                            checked={this.state.selected==item.id?true:false}
                                            onClick={(e) => { this.handleChangeCheckbox(item, e.target.checked) }} />
                                        <div className="fw-checkbox__label-text">{label}</div></label>
                                </Tooltip>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
