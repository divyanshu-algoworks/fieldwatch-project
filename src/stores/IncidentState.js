import { observable, action, computed, toJS } from "mobx";
import { autobind } from 'core-decorators';
import API from '../helpers/api';
import moment from "moment";
import ItemFormState from './ItemFormState';
import processObjectForModel from '../helpers/processObjectForModel';

export default class IncidentState extends ItemFormState {
  @observable linksWasChanged = false;
  @observable policiesWasChanged = false;
  @observable relatedRepresentativesChange = false;
   item = {};
  @observable links = [];
  @observable reported_links = [];
  @observable policies = [];
  @observable related_representatives = [];
  @observable imageToMagnify = {};
  @observable isViewUpdated = false;
  @observable isWarningOpen = false;
  @observable transcriptionData = [];
  @observable updateViewCallback = undefined;
  @observable duplicateLinkUrlFunc = undefined;
  @observable isFilterDropDownChanged = false;
  @observable linkLoader = false;

  @autobind @action setTags(tags) {
    this.item.tag_ids = tags;
  }

  @autobind @action setLinks(links) {
    this.links = links;
  }

  @autobind @action setReportedLinks(links) {
    this.reported_links = links;
  }

  @autobind @action setRelatedRepresentatives(related_representatives) {
    this.related_representatives = related_representatives;
  }

  @autobind @action setTranscriptonData(data) {
      this.transcriptionData = data;
  }

  @autobind @action setPolicies(policies) {
    if (!!this.policies.length) {
      this.policiesWasChanged = true;
    }
    this.policies = policies;
  }

  @autobind @action changeLinks(links) {
    this.links = links;
    this.linksWasChanged = true;
  }

  @autobind @action changeProgress(newProgress, item) {
    const index = this.links.findIndex(({ id }) => item.id === id);
    if (index < 0) {
      return;
    }

    const { progress, name, id, url } = this.links[index];
    const newitem = typeof newProgress === 'number' ? { name, id, url, progress: newProgress } : { name, id, url };
    this.links = [
      ...this.links.slice(0, index),
      newitem,
      ...this.links.slice(index + 1)
    ];
  }

  @autobind @action changePostContent(content) {
    this.item.post_content = content;
  }
 
  @autobind @action setIsFilterDropDownChanged(val) {
    this.isFilterDropDownChanged = val;
  }

  @autobind @action setUpdateViewCallback(callback) {    
    this.updateViewCallback = callback;
  }

  @autobind @action setDuplicateLinkUrl(callback) {
    this.duplicateLinkUrlFunc = callback;
  }

  @autobind @action setImageToView(img) {
    this.imageToMagnify = img;
  }
  @autobind @action setIsUpdatedView(val) {
    this.isViewUpdated = val;
  }

  @autobind @action setLoader(val) {
    this.linkLoader = val;
  }

  @autobind @action openWarning() {
    this.isWarningOpen = true;
  }

  @autobind @action closeWarning() {
    this.isWarningOpen = false;
  }

   get wasChanged() {
    return (this.startItem !== JSON.stringify(processObjectForModel(toJS(this.item)))) ||
      this.linksWasChanged || this.policiesWasChanged || this.relatedRepresentativesChange;
  }

  @computed get serializedLinks() {
    return this.links.map(({ id, url, url_full, _destroy, status }) => {
      return { id: id || '', status: status || '', url: url || '', url_full: url_full || '', ...(!!_destroy) && { _destroy } };
    })
  }

  validators = {
    reported_date: function (item) {
      const { reported_date } = item;
      const m = moment(reported_date);
      if (!reported_date) {
        return 'can\'t be blank';
      }
      if (!m.isValid()) {
        return 'invalid date format';
      }
      return null;
    },

    status: function (item) {
      if (!item.status || !item.status.id) {
        return 'can\'t be blank';
      }
      return null;
    },
    category: function (item) {
      if (!item.category || !item.category.id) {
        return 'can\'t be blank';
      }
      return null;
    },
    risk_level: function (item) {
      if (!item.risk_level || !item.risk_level.id) {
        return 'can\'t be blank';
      }
      return null;
    },
    territory: function (item) {
      if (!item.territory || !item.territory.id) {
        return 'can\'t be blank';
      }
      return null;
    },
    language:  function (item) {
      if (!item.language_id) {
        return 'can\'t be blank';
      }
      return null;
    },
  }
};
