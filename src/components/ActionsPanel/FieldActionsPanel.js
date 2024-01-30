import React, { Fragment, createRef } from 'react';
import Common from './Common';
import ActionButton from './ActionPanelButton';
import { FieldSummaryInfo } from './FieldSummaryInfo';
import SendEmailConfirmationDialog from 'Components/SendEmailConfirmationDialog';


export class FieldActionsPanel extends Common {
  state = {
    isModelOpen: false,
    sendEmailDialog: false,
    sendTrainingDialog: false,
    remediationIncidentData: {},
    isAllRemediation: false,
  };
  title = 'Selected Representatives\n';
  wide = true;

  complianceEmailDialog = createRef();
  trainingEmailDialog = createRef();
  groupsDialog = createRef();

  handleOpenChangeDialog = ({ currentTarget }) => {
    const { propName, method } = currentTarget.dataset;
    this.changePropDialog.current.open({ propName, method, });
  }

  handleEmailDialog = (value) => {
    if(value === 'email') {
      this.setState({sendEmailDialog: true, sendTrainingDialog: false}, () => this.checkCount());
    }
    if(value === 'training') {
      this.setState({sendEmailDialog: false, sendTrainingDialog: true}, () => this.checkCount());
    }
  }

  checkCount() {
    const { count, can_send_warning_email, current_user_role } = this.props;
    if (current_user_role && current_user_role.role === 'fw_specialist' && can_send_warning_email) {
      if(this.checkRemediationConditons()) {
         this.fetchRemediationData();
         this.setState({ isModelOpen: true })
         return;
      }
    }

    if(count > 25) {
      this.setState({isModelOpen: true});
    } else {
      this.onSuccess();
    }
  }

  fetchRemediationData = () => {
    const { remediation_condition, filter } = this.props;
    const { country, rep_ranks } = remediation_condition;

    const rep_ranks_name = rep_ranks && rep_ranks.map(id => filter.rep_ranks.filter(x => x.id === id)[0].name) || [];
    const countries = country && country.map(id => filter.countries.filter(x => x.id === id)[0].name) || [];
    const obj = {
      rep_rank_data: rep_ranks_name.join(', '),
      rep_country_data: countries.join(', ')
    }

    this.setState({ remediationIncidentData: obj });
  }

  checkRemediationConditons = () => {
    const { remediation_condition, representativeData } = this.props;
    const { country, rep_ranks } = remediation_condition;

    const countri = country ? country : [];
    const reps = rep_ranks ? rep_ranks : [];

    if(countri.length == 0 && reps.length == 0) {
      this.setState({ isAllRemediation: true })
      return true;
    }

    let country_ids = [], rep_ranks_ids = [];
    representativeData.forEach(({ rep_country_id, rep_rank_id }) => {
      country_ids.push(rep_country_id);
      rep_ranks_ids.push(rep_rank_id)
    })
    const isCountryIdExist = country_ids.some(x => countri.includes(x));
    const isRepRankIdExist = rep_ranks_ids.some(x => reps.includes(x));

    return isCountryIdExist || isRepRankIdExist;
  }

  onSuccess = () => {
    const { onSendTrainingClick, onSendEmailClick } = this.props;
    this.setState({isModelOpen: false});
    if (this.state.sendEmailDialog) {
      onSendEmailClick();
    }
    if (this.state.sendTrainingDialog) {
      onSendTrainingClick();
    }
  }

  handleOpenTrainingDialog = () => this.trainingEmailDialog.current.open();
  handleOpenGroupsDialog = () => this.groupsDialog.current.open();

  get actionsList() {
    const { expanded } = this.state;
    const { onAddGroupClick } = this.props;
    return (
      <Fragment>
        <ActionButton buttonText="E"
          propName="Send Email"
          text="Send Email"
          onClick= {() => this.handleEmailDialog('email')}
          collapsed={!expanded} />
        <ActionButton buttonText="Te"
          propName="Send Training"
          text="Send Training"
          onClick={() => this.handleEmailDialog('training')}
          collapsed={!expanded} />
        <ActionButton buttonText="G"
          propName="Add Representative Groups"
          text="Add Representative Groups"
          onClick={onAddGroupClick}
          collapsed={!expanded} />
      </Fragment>
    );
  }

  get summary() {
    return (
    <FieldSummaryInfo {...this.props} />
    )
  }

  get confirmationDialog() {
    const { count, current_user_role, can_send_warning_email } = this.props;
    return (
      <SendEmailConfirmationDialog
      isOpen = {this.state.isModelOpen}
      count = {count}
      onClose = {()=>this.setState({isModelOpen: false})}
      title = {'Warning'}
      can_send_warning_email= {current_user_role.role === 'fw_specialist' && can_send_warning_email}
      remediationIncidentData={this.state.remediationIncidentData}
      isAllRemediation={this.state.isAllRemediation}
      onSuccess = {()=> this.onSuccess()}
      />  
    )
  }
}
