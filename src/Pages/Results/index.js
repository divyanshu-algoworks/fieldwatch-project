import React, { createRef } from "react";
import classnames from "classnames";
import { inject, observer } from "mobx-react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import getClient from "../../helpers/getClient";
import ItemsList from "../../components/ItemsList";
import Preloader from "../../components/Preloader";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { Filters } from "../../components/Filters";
import QuestionMark from "../../components/QuestionMark";
import TablePaginator from "../../components/Table/TablePaginator";
import ExistIncidentUrlDialog from "../../components/ExistIncidentUrlDialog";
import Magnifier from "../../components/Magnifier";
import API from "../../helpers/api";

import TranscriptDialog from "./TranscriptDialog";
import SidePanel from "./SidePanel";
import HitsList from "./HitsList";
import DropTabs from "./DropTabs";
import PageTextDialog from "./PageTextDialog";
import WarningDialog from "../../components/WarningDialog";
import {getClientType } from '../../helpers/cookie';
import { FW_ADMIN_WARNING_MSG } from "../../constants/NonFWClientWarningMessage";
import { InstructionActionsPanel } from "../../components/ActionsPanel/InstructionPanel";
import { autobind } from "core-decorators";
import { action, makeAutoObservable, makeObservable } from "mobx";

// @DragDropContext(HTML5Backend)
@inject("store")
@observer
export default class Results extends ItemsList {
  storeName = "ResultsState";
  toComplianceWarningDialog = createRef();
  pageTextDialog = createRef();
  transcriptDialog = createRef();
  filters = createRef();
  state = {
    showFilters: false,
    search: "",
    submitted: false,
    reload: false,
    loader: true,
    checkedResultsItems: [],
    allChecked: false,
    hitStateItems: [],
    hitStatesList: [],
    isInstructionOpen: false,
    propsData: {},
  };
  constructor(props) {
    super(props);
    const { current_user_role } = this.props;
    makeObservable(this)
    const redirect_url = localStorage.getItem("redirect_url");
    if (redirect_url) {
      window.location.href = redirect_url
    }
    this.store.setSort("results", "desc");
    this.sidePanelHits = []; //JSON.parse(JSON.stringify(this.props.hit_states));
  }

  componentDidMount() {
    const { arbonneKey, current_user_role } = this.props;
    let url = window.location.href;
    var id = url.substring(url.lastIndexOf('/') + 1);
    this.props.store.ResultsState.dataUrl = `/api/v1/clients/${id}/hits`;
    this.fetchPropsData();
    if (window.__isReactDndBackendSetUp) {
      window.__isReactDndBackendSetUp = false;
    }
    if (
      current_user_role === "fw_specialist" ||
      current_user_role === "fw_admin"
    ) {
      this.setState({ isInstructionOpen: true });
    }
    let hitStatesList = [
      { id: "null", name: "New Results" },
      ...this.sidePanelHits,
      { id: undefined, name: "All" },
    ];
    if (
      arbonneKey == getClient() &&
      ["client_admin", "client_specialist"].includes(current_user_role)
    ) {
      hitStatesList = hitStatesList.filter((el) => {
        if (el.id === undefined || el.name.toLowerCase() == "not related") {
          return false;
        }
        return true;
      });
    }
    //this.setState({ hitStatesList: hitStatesList });
    this.setState(
      {
        hit_state: { direct_select: true, values: [hitStatesList[0].id + ""] },
      },
      () => {
        // !localStorage.getItem('redirect_url') && this.fetchData();
      }
    );

    localStorage.setItem("current_tab", "main");
  }

  setSubmitted = () => this.setState({ submitted: true });
  setUnsubmited = () => this.setState({ submitted: false });

  fetchPropsData = async () => {
    const data = await API.get(
      `/api/v1/clients/${1}/hits/hits_filterable_data`
    );
    this.setState({ propsData: data }, () => {
      this.fetchData();
      this.sidePanelHits = data.hit_states;
    });
   // this.sidePanelHits.push
    if (data.current_user_role.includes("fw")) {

      this.sidePanelHits.push({ id: "-1", name: "Deleted-Results" });
      this.sidePanelHits.push({ id: "-2", name: "Site For Review" });
    }
    let hitStatesList = [
      { id: "null", name: "New Results" },
      ...data.hit_states,
      ...this.sidePanelHits,
      { id: undefined, name: "All" },
    ];
    this.setState({ hitStatesList: hitStatesList});
  };

  
  fetchData = (pagination) => {
    if (!pagination) {
      this.store.setPagination({ page: 1 });
    }
    this.setState({ loader: true });
    this.store
      .fetchData({
        filter: {
          ...this.filters.current.serialize(),
          ...(this.state.hit_state.values[0] && {
            hit_state: this.state.hit_state,
          }),
          not_matching: {
            direct_select: "",
            include_nil: "",
            values: [],
          },
        },
        // radio_filter: { ...this.filters.current.serializeRadio() },
        search: this.state.search ? { value: this.state.search } : undefined,
      })
      .then((data) => {
        this.store.setHitStates(data);
        this.setState({hitStateItems: data.data, loader: false})
      })
  };

  handleChangeHitState = (hit_state) =>
    this.setState(
      { hit_state: { ...this.state.hit_state, values: [hit_state] } },
      this.fetchData
    );

  handleChangeSort = () => {
    const { sortDirection } = this.store.sorting;
    const newSortDirection = sortDirection === "asc" ? "desc" : "asc";
    this.store.setSort("results", newSortDirection);
    this.fetchData();
  };

  handleChangeSearch = ({ target }) => {
    this.setState({ search: target.value }, this.fetchData);
  };

  handleCheckRow = (item, selected) => {
    const {
      handleCheckItem,
      handleUncheckItem,
      handleCheckAllItems,
      handleUncheckAllItems,
    } = this.store;
    if (item === "all") {
       selected ? 
      handleCheckAllItems(item) : 
      handleUncheckAllItems(item);
    }
    else selected ? handleCheckItem(item) : handleUncheckItem(item);

     setTimeout(() => {
      this.setState({ reload: true });
     }, 0)
  };


  handleChangePagination = (pagination) => {
    this.store.setPagination(pagination);
    this.fetchData(pagination);
  };

  handleChangeState = (hit_state_id) => {
    const { change_state_url } = this.props;
    const ids = this.store.checkedItems.map(({ id }) => id);
    API.put(change_state_url, {
      body: {
        hit: {
          hit_state_id,
        },
        ids,
      },
    }).then(() => {
      this.store.handleUncheckAllItems();
      this.fetchData();
    });
  };

  handleClickMoveToCompliance = () => {
    if (this.store.checkedItems.length === 1) {
      this.handleActionToCompliance();
    } else {
      this.toComplianceWarningDialog.current.open();
    }
  };

  handleActionToCompliance = () => {
    const { incidents_url } = this.props;
    const linksCheckUrl = `${incidents_url}/links_check.json`;
    API.get(linksCheckUrl, {
      body: { hit_ids: this.store.checkedItems.map(({ id }) => id) },
    });
  };

  exportResultsToCsv = () => {
    const { export_results_to_csv_url } = this.props;

    API.post(export_results_to_csv_url, {
      body: {
        filter: this.filters.current.serialize(),
        ...this.store.sortingParams,
      },
    }).then(({ redirect }) => {
      if (!!redirect) {
        window.location.href = redirect;
      }
    });
  };

  toggleFiltersVisibility = () =>
    this.filters.current.toggleFiltersVisibility();
  handleCloseIncidentsDialog = () => this.store.setIncidents([]);
  handleSubmitCreateIncident = () =>
    (window.location.href = this.store.newIncidentUrl);
  handleCloseMagnifier = () => this.store.setMagnifierImg("");
  handleClickHitImg = (src) => this.store.setMagnifierImg(src);
  handleFiltersClear = () => (window.location.href = this.props.url);
  showPageText = (result) => {
    this.setSubmitted();
    this.pageTextDialog.current.open();
    API.get(`${this.props.url}/${result.id}`).then(({ hit }) => {
      this.setUnsubmited();
      if (hit) {
        this.pageTextDialog.current.change(hit.url, hit.bolded_page_text);
      }
    });
  };

  showTranscriptText = (result, type) => {
    this.setSubmitted();
    this.transcriptDialog.current.open();
    API.get(`${this.props.url}/${result.id}`).then(({ hit }) => {
      this.setUnsubmited();
      if (hit) {
        this.transcriptDialog.current.change(hit.url, hit, type);
      }
    });
  };

  render() {
    const {
      sorting,
      items,
      pagination,
      checkedItems,
      isAllPageChecked,
      incidents,
      magnifierImg,
      loading,
    } = this.store;
    console.log(this.store.checkedItems);
    const { hitStatesList, loader } = this.state;
    const { current_user_role } = this.props;
    const sortIconClassName = classnames({
      "fa fa-sort-amount-asc": sorting.sortDirection === "desc",
      "fa fa-sort-amount-desc": sorting.sortDirection === "asc",
    });
    const filters = {
      ...this.props.filters,
      initialValues: {
        ...(this.props.current_territory && {
          territories: [this.props.current_territory.id],
        }),
        ...(this.props.current_query && {
          queries: [this.props.current_query.id],
        }),
        ...{ show_deleted: [false], deleted_queries: [] },
      },
    };
    return [
      <div className="container">
      <div className="page results" key="results-page">
        {["fc"].includes(getClientType("fw_client_type")) && (
          <h4 className="non-fw-warning">{FW_ADMIN_WARNING_MSG}</h4>
        )}
        <div className="page__header">
          <div className="page__header-title">
            Results
            <Button
              status="link"
              className="results__header-button"
              onClick={this.handleChangeSort}
            >
              <i className={sortIconClassName}></i>
            </Button>
            <Button
              status="link"
              className="results__header-button"
              onClick={this.toggleFiltersVisibility}
            >
              <i className="fa fa-filter"></i>
            </Button>
          </div>
          <div>
            <Button
              size="big"
              status="black"
              className={`mr-10 ${
                ["fc"].includes(getClientType()) ? "disabled_element" : ""
              }`}
              // onClick={this.exportResultsToCsv}
            >
              Export Results To CSV
            </Button>
            <Input
              type="search"
              onChange={this.handleChangeSearch}
              value={this.state.search}
            />
          </div>
        </div>
        <div className="page__body grid">
          {this.state.propsData.filters && (
            <Filters
              filtersNames={[
                "queries",
                "deleted_queries",
                "single_site_queries",
                "territories",
                "show_deleted",
                "claims_rules",
                "social_media",
              ]}
              ref={this.filters}
              filters={{
                ...this.state.propsData.filters,
                date_ranges: this.state.propsData.date_ranges,
              }}
              onChange={this.fetchData}
              onClear={this.handleFiltersClear}
            />
          )}

          <div
            className={`results__list-header ${
              ["fc"].includes(getClientType()) ? "disabled_element" : ""
            } `}
          >
            <div className="results__select-all-container">
              <Input
                type="checkbox"
                size="small"
                checked={isAllPageChecked}
                onChange={({ target }) =>
                  this.handleCheckRow("all", target.checked)
                }
              />
            </div>
            <ul className="results__tabs">
              {hitStatesList &&
                hitStatesList
                  .filter(({ id, name }) => {
                    if (
                      (id === "null" && this.store.hitStates["null"] <= 0) ||
                      name === "All"
                    ) {
                      return false;
                    }
                    return true;
                  })
                  .map(({ id, name }) => (
                    <li
                      className={classnames("results__tab", {
                        "results__tab--active":
                          this.state.hit_state.values[0] == id,
                      })}
                      key={id || name}
                      onClick={() => this.handleChangeHitState(id)}
                    >
                      <b>
                        {this.store.hitStates[id === undefined ? "all" : id] ||
                          0}
                      </b>
                      <div>{name}</div>
                    </li>
                  ))}
            </ul>
            {/* <QuestionMark
              tooltipPosition="left"
              tooltipWidth={100}
              tooltip="Use the buttons on the right, or the corresponding hotkeys to organize your results into these tabs"
            /> */}
          </div>
          <div
            className={`results__panel ${
              ["fc"].includes(getClientType()) ? "disabled_element" : ""
            }`}
          >
            {(!!loading || !!loader) ? (
              <Preloader className="results__loader" />
            ) : (
              <HitsList
                items={items}
                onCheckRow={this.handleCheckRow}
                onPageTextShow={this.showPageText}
                onTranscriptTextShow={this.showTranscriptText}
                userRole={current_user_role}
                dragPreviewImage={this.props.drag_preview_image}
                onImgClick={this.handleClickHitImg}
                checkedItems={checkedItems}
              />      
            )}
            <aside className="results__hits-actions">
              <SidePanel
                selectedCount={checkedItems.length}
                hitStates={this.sidePanelHits}
                onChangeState={this.handleChangeState}
                onClearSelection={this.store.handleClearCheckedItems}
                onMoveToCompliance={this.handleClickMoveToCompliance}
              />
            </aside>
          </div>
          <div className="results__pagination-container">
            <div className="grid__col grid__col--12">
              <TablePaginator
                pagination={pagination}
                onPaginationChange={this.handleChangePagination}
              />
            </div>
          </div>
        </div>
        </div>
        <DropTabs
          tabs={this.sidePanelHits}
          onStateChange={this.handleChangeState}
        />
        <PageTextDialog
          ref={this.pageTextDialog}
          submitted={this.state.submitted}
        />
        <TranscriptDialog
          ref={this.transcriptDialog}
          submitted={this.state.submitted}
        />
      </div>,
      <ExistIncidentUrlDialog
        key="exist-incidents"
        onClose={this.handleCloseIncidentsDialog}
        isOpen={!!incidents && !!incidents.length}
        onConfirm={this.handleSubmitCreateIncident}
        existIncidents={incidents}
      />,
      !!magnifierImg && (
        <Magnifier
          key="magnifier"
          src={magnifierImg}
          onClose={this.handleCloseMagnifier}
        />
      ),
      <WarningDialog
        key="to-compliance-warning-dialog"
        ref={this.toComplianceWarningDialog}
        text={`You are about to add ${this.store.checkedItems.length} URLs to a new Incident.`}
        onConfirm={this.handleActionToCompliance}
      />,
      <div>
        {this.props.instruction_text && this.state.isInstructionOpen && (
          <InstructionActionsPanel text={this.props.instruction_text} />
        )}
      </div>,
    ];
  }
}
