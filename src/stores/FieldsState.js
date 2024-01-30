import { observable, action } from "mobx";
import * as go from "gojs";
import { autobind } from 'core-decorators';
import { ID, REP_ID, NAME, LAST_IN_BRANCH, PARENTS_COUNT, SPONSOR_REP_ID, } from '../constants/FieldsTreeKeys';

const DEFAULT_ROOT_NODE = { [REP_ID]: 'root', [LAST_IN_BRANCH]: false, };

export default class FieldsState {
  @observable globalTree = [];
  @observable treeToDisplay = [];
  @observable treeToDisplayUpdateTime = null;
  @observable detailedTreeModel = null;
  @observable detailedSelectedNode = null;
  @observable detailedUpdateTime = null;
  @observable minDepth = 1;
  @observable activeNode = { ...DEFAULT_ROOT_NODE };
  @observable isFormCollapsed = true;
  @observable selectedRepresentativesIds = [];
  @observable relatives = { type: undefined, items: [] }
  @observable summaryInfo = {};

  @autobind @action setFullTree(treesArrays, userName = 'root', showdefaultRootNode = true) {
    this.globalTree = !!showdefaultRootNode ? [
      { ...DEFAULT_ROOT_NODE, [NAME]: userName },
      ...[].concat.apply([], treesArrays)
    ] : [].concat.apply([], treesArrays);
    this.setTreeToDisplay(this.globalTree);
    this.setActiveNode = null;
  }

  @autobind @action setTreeToDisplay(treeToDisplay, activeNode) {
    this.treeToDisplay = treeToDisplay;
    this.treeToDisplayUpdateTime = new Date();
    if (!!activeNode) {
      this.activeNode = activeNode;
    }
  }

  @autobind @action reset() {
    this.setTreeToDisplay(this.globalTree, { ...DEFAULT_ROOT_NODE });
  }

  @autobind @action setActiveNode(activeNode) {
    this.activeNode = activeNode;
  }

  @autobind @action createDetailedTreeModel(data, selectedRepId) {
    this.detailedTreeModel = new go.TreeModel();
    this.detailedTreeModel.nodeKeyProperty = REP_ID;
    this.detailedTreeModel.nodeParentKeyProperty = SPONSOR_REP_ID;
    this.detailedTreeModel.nodeDataArray = data;
    const nodeData = selectedRepId ? this.detailedTreeModel.findNodeDataForKey(selectedRepId) : undefined;
    this.detailedSelectedNode = nodeData ? {data: nodeData} : {data: {[REP_ID]: selectedRepId}};
    this.minDepth = Math.min.apply(null, this.detailedTreeModel.nodeDataArray.map((item) => item[PARENTS_COUNT]));
    this.detailedUpdateTime = new Date();
  }

  @autobind @action setDetailedTreeModel(detailedTreeModel, detailedSelectedNode) {
    this.detailedTreeModel = detailedTreeModel;
    if (detailedSelectedNode) {
      this.detailedSelectedNode = detailedSelectedNode;
    }
    this.detailedUpdateTime = new Date();
    this.minDepth = Math.min.apply(null, detailedTreeModel.nodeDataArray.map((item) => item[PARENTS_COUNT]));
  }

  @autobind @action expandForm() {
    this.isFormCollapsed = !this.isFormCollapsed;
  }

  @autobind @action setSelectedRepresentatives(selectedRepresentatives) {
    if (selectedRepresentatives.count === 0) {
      this.selectedRepresentativesIds = [];
    } else {
      this.selectedRepresentativesIds = selectedRepresentatives
        .toArray()
        .map(({ data }) => data[ID])
        ;
    }
  }

  @autobind @action clearRepresentativesSelection() {
    this.selectedRepresentativesIds = [];
  }

  @autobind @action selectRepresentativeFromTable({ id }) {
    this.selectedRepresentativesIds = [id];
  }

  @autobind @action setRelatives(type, items) {
    this.relatives = { type, items };
  }

  @autobind @action setSummaryInfo(summaryInfo) {
    this.summaryInfo = summaryInfo;
  }
}
