import { observable, action } from 'mobx';
import { autobind } from 'core-decorators';
import DataCheckState from './DataCheckState';

export default class ResultsState extends DataCheckState {
  @observable hitStates = {};
  @observable incidents = [];
  @observable newIncidentUrl = '';
  @observable magnifierImg = '';

  @autobind @action setHitStates({counter}) {
    {/*Show only 1000 results at MAX on hits page FW-842*/}
    let counterWithLimit={};
    counter && Object.keys(counter).length > 0 && Object.keys(counter).map((key)=>{
      if(counter[key]>1000 && key=="null"){
        counterWithLimit[key]=1000;
      }
      else{
        counterWithLimit[key]=counter[key];
      }
    })
    {/*Show only 1000 results at MAX on hits page FW-842*/}
    this.hitStates = counterWithLimit;
  }

  @autobind @action setIncidents(incidents, newIncidentUrl) {
    this.incidents = incidents;
    this.newIncidentUrl = newIncidentUrl;
  }

  @autobind @action setMagnifierImg(magnifierImg) {
    this.magnifierImg = magnifierImg;
  }
}