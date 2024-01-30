import { observable, action, computed, makeAutoObservable } from 'mobx';
import { autobind } from 'core-decorators';
import { autoSave } from './autoStore';
import API from '../helpers/api';

export default class UserInfoState {
    constructor() {
    makeAutoObservable(this);   
    autoSave(this, 'userInfoState');
    }
  @observable userData = {};
  @observable userToken = ""

   @action setUserData(user) {
    this.userData = user;
    this.userToken = user.email_token;
  }

  @computed get getUserData() {
    return this.userData;
  }
  @computed get getUserToken() {
    return this.userToken;
  }
}