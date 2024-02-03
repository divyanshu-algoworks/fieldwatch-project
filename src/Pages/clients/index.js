import React from "react";
import { NavLink } from "react-router-dom";
import IconButton from "../../components/IconButton";
import CommonList from "../../components/CommonList";
import Input from "../../components/Input";
import Paper from "../../components/Paper";
import Button from "../../components/Button";
import AdminSideMenu from "../../components/AdminSideMenu"

export default class ClientsDashboard extends CommonList {
  get tableConfig() {
    return [
      {
        title: "Client Name",
        accessor: "client_name",
        sortable: true,
        componentFn: ({ item }) => (
          <NavLink  className="client-link" to={`/clients/${item.id}/results`}>{item.client_name}</NavLink>
        ),
      },
      {
        title: "On Hold",
        accessor: "on_hold",
        sortable: true,
        componentFn: ({ item }) => (!!item.on_hold ? "Yes" : "No"),
      },
      {
        title: "SW Enabled",
        sortable: false,
        componentFn: ({ item }) => (!!item.has_super_queries ? "Yes" : ""),
      },
      {
        title: "Actions",
        style: {
          width: "100px",
        },
        componentFn: ({ item }) => (
          <div className="table-actions">
            {!!item.can_view_queries && (
              <IconButton
                tooltip="View Query"
                icon="pe-7s-note2 icon icon--bold icon--button"
                type="link"
                //href={`/clients/${item.id}/queries`}
              />
            )}
            {item.can_edit && (
              <IconButton tooltip="Edit Record" icon="pe-7s-note" type="link" />
            )}
            {item.can_destroy && this.getDestroyBtn(item)}
          </div>
        ),
      },
    ];
  }

  getUrl = () => {
    return "/api/v1/case_management/clients";
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-3">
            <AdminSideMenu/>
          </div>
          <div className="col-xs-9">
            <Paper key="page">
              <Paper.Header>
                <Paper.Title>Clients</Paper.Title>
                <div>
                  <Input
                    type="search"
                    onChange={this.handleChangeSearch}
                    value={this.state.search}
                  />
                  <Button type="link" href={`${this.props.url}/new`}>
                    <i className="glyphicon glyphicon-plus"></i>
                    New Client
                  </Button>
                </div>
              </Paper.Header>
              <Paper.Body>{this.table}</Paper.Body>
              {this.warningDialog}
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}
