import DataState from './DataState';
import { autobind } from 'core-decorators';
import { action } from "mobx";
import API from '../helpers/api';

export default class RelatedIncidentsState extends DataState {
  incidentUrl = '';
  @autobind @action unlinkIncident(item) {
    API.post(
      `${this.incidentUrl}/unlink_related_incident`,
      {
        body: {
          related_incident_id: item.id
        }
      }
    ).then(this.fetchData)
  }
}
