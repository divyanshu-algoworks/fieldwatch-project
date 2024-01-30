import React, { Fragment, createRef } from "react";
import Common from "./Common";
import ActionButton from "./ActionPanelButton";
import ChangeActionsPropertyDialog from "./ChangeActionPropertyDialog";
import BulkIncidentUpdate from "./BulkIncidentUpdate";
import SendComplianceEmailDialog from "Components/SendFromTemplateDialog/SendComplianceEmailDialog";
import SendEmailConfirmationDialog from "Components/SendEmailConfirmationDialog";
import WarningDialog from "Components/WarningDialog";

export class IncidentsActionsPanel extends Common {
  state = {
    isModelOpen: false,
    isArchiveModelOpen: false,
    isArchiveTab: localStorage.getItem('current_tab') === 'archived',
    isSendMailDialogOpen: false,
    remediationIncidentData: {},
    isAllRemediation: false,
    showArchiveUnarchiveButton: ['archived', 'main'].includes(localStorage.getItem('current_tab'))
  };
  title = "Actions";
  changePropDialog = createRef();
  complianceEmailDialog = createRef();
  bulkIncidentUpdateDialog = createRef();

  handleOpenChangeDialog = ({ currentTarget }) => {
    const { propName, method } = currentTarget.dataset;
    this.changePropDialog.current.open({ propName, method });
  };

  handleOpenBulkUpadteDialog = () => {
    this.bulkIncidentUpdateDialog.current.open("all", "all");
  };

  handleOpenEmailDialog = () => {
    const { count, can_send_warning_email, current_user_role} = this.props;
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
  };

  fetchRemediationData = () => {
    const { remediation_condition, filter } = this.props;
    const { country, rep_ranks, territories } = remediation_condition;

    const rep_ranks_name = rep_ranks && rep_ranks.map(id => filter.rep_ranks.filter(x => x.id === id)[0].name) || [];
    const territory_name = territories && territories.map(id => filter.territories.filter(x => x.id === id)[0].name) || [];
    const countries = country && country.map(id => filter.rep_countries.filter(x => x.id === id)[0].name) || [];
    const obj = {
      rep_rank_data: rep_ranks_name.join(', '),
      territory_data: territory_name.join(', '),
      rep_country_data: countries.join(', ')
    }

    this.setState({ remediationIncidentData: obj });
  }

  checkRemediationConditons = () => {
    const { remediation_condition, incidentData } = this.props;
    const { country, rep_ranks, territories } = remediation_condition;

    const terri = territories ? territories : [];
    const countri = country ? country : [];
    const reps = rep_ranks ? rep_ranks : [];

    if(countri.length == 0 && reps.length == 0 && terri.length == 0) {
      this.setState({ isAllRemediation: true })
      return true;
    }

    let country_ids = [], rep_ranks_ids = [], territory_ids = [];
    incidentData.forEach(({ rep_country_id, rep_rank_id, territory_id}) => {
      country_ids.push(rep_country_id);
      rep_ranks_ids.push(rep_rank_id);
      territory_ids.push(territory_id);
    })
    const isCountryIdExist = country_ids.some(x => countri.includes(x));
    const isRepRankIdExist = rep_ranks_ids.some(x => reps.includes(x));
    const isTerritoryExist = territory_ids.some(x=> terri.includes(x));

    return isCountryIdExist || isRepRankIdExist || isTerritoryExist
  }

  onSuccess = () => {
    this.setState({ isModelOpen: false });
    this.complianceEmailDialog.current.open();
  };

  onConfirm = () => {
    this.setState({ isArchiveModelOpen: false }, () => {
      this.props.onBulkArchiveUnarchive();
    });
  };

  get actionsList() {
    const { expanded, isArchiveTab, showArchiveUnarchiveButton } = this.state;
    return (
      <Fragment>
        <ActionButton
          buttonText="B"
          text="Bulk Edit"
          onClick={this.handleOpenBulkUpadteDialog}
          collapsed={!expanded}
        />
        <ActionButton
          buttonText="St"
          propName="Status"
          method="status"
          onClick={this.handleOpenChangeDialog}
          collapsed={!expanded}
        />
        <ActionButton
          buttonText="Rl"
          propName="Risk Level"
          method="risk_level"
          onClick={this.handleOpenChangeDialog}
          collapsed={!expanded}
        />
        <ActionButton
          buttonText="Ct"
          propName="Category"
          method="category"
          onClick={this.handleOpenChangeDialog}
          collapsed={!expanded}
        />
        <ActionButton
          buttonText="T"
          propName="Territory"
          method="territory"
          onClick={this.handleOpenChangeDialog}
          collapsed={!expanded}
        />
        <ActionButton
          buttonText="L"
          propName="Language"
          method="language"
          onClick={this.handleOpenChangeDialog}
          collapsed={!expanded}
        />
        <ActionButton
          buttonText="Ec"
          propName="Edge Cases"
          method="edge_cases"
          onClick={this.handleOpenChangeDialog}
          collapsed={!expanded}
        />
        <ActionButton
          buttonText="P"
          propName="Policies"
          method="policies"
          onClick={this.handleOpenChangeDialog}
          collapsed={!expanded}
        />
        <ActionButton
          buttonText="T"
          propName="Tags"
          method="tags"
          onClick={this.handleOpenChangeDialog}
          collapsed={!expanded}
        />
         <ActionButton
          buttonText="R"
          propName="tags"
          method= "incidents_tags"
          text="Remove Tags"
          onClick={this.handleOpenChangeDialog}
          collapsed={!expanded}
        />
        <ActionButton
          buttonText="E"
          text="Send Email"
          onClick={this.handleOpenEmailDialog}
          collapsed={!expanded}
        />
        <ActionButton
          buttonText="O"
          propName="Owner"
          method="owner"
          onClick={this.handleOpenChangeDialog}
          checkedItems
          collapsed={!expanded}
        />
        {showArchiveUnarchiveButton && (
          <ActionButton
            buttonText={isArchiveTab ? "U" : "A"}
            text={isArchiveTab ? "Unarchive" : "Archive"}
            onClick={() => this.setState({ isArchiveModelOpen: true })}
            checkedItems
            collapsed={!expanded}
          />
        )}
      </Fragment>
    );
  }

  get dialogs() {
    const { can_send_warning_email, current_user_role } = this.props;
    return (
      <Fragment>
        <SendEmailConfirmationDialog
          isOpen={this.state.isModelOpen}
          count={this.props.count}
          onClose={() => this.setState({ isModelOpen: false })}
          title={"Warning"}
          can_send_warning_email= {current_user_role.role === 'fw_specialist' && can_send_warning_email}
          remediationIncidentData={this.state.remediationIncidentData}
          isAllRemediation={this.state.isAllRemediation}
          onSuccess={() => this.onSuccess()}
        />
         <WarningDialog
        key="warning-dialog"
        isOpen = {this.state.isArchiveModelOpen}
        text={`Are you sure you want to ${!this.state.isArchiveTab ? 'archive': 'Unarchive'} these incident?`}
        onClose={() => this.setState({isArchiveModelOpen: false })}
        onConfirm={() => this.onConfirm()}
      />,
       <BulkIncidentUpdate
          ref={this.bulkIncidentUpdateDialog}
          {...this.props}
        />,
        <ChangeActionsPropertyDialog ref={this.changePropDialog} {...this.props} />
        <SendComplianceEmailDialog {...this.props}
          title="Compliance Actions"
          ref={this.complianceEmailDialog}
          noPreview
        />
      </Fragment>
    );
  }
}
