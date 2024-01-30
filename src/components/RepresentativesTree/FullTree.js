import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import * as go from "gojs";
import { inject, observer } from 'mobx-react';

import Button from 'Components/Button';
import {
  ID, REP_ID, SPONSOR_REP_ID, LAST_IN_BRANCH, CHILDREN_COUNT,
  HAS_INCIDENTS, NAME,
} from 'Constants/FieldsTreeKeys';
var $ = go.GraphObject.make;

const DEFAULT_ZOOM_INCREASE_FACTOR = 1.5;
const DEFAULT_ZOOM_DECREASE_FACTOR = 1 / DEFAULT_ZOOM_INCREASE_FACTOR;

@inject('store')
@observer
export default class FullTree extends Component {
  static defaultProps = {
    style: {
      width: '100%',
      height: '450px',
      margin: '2px'
    }
  }


  @autobind updateLocalDiagram(node) {
    const { repUrl, onNodeClick } = this.props;
    const model = new go.TreeModel();
    model.nodeKeyProperty = REP_ID;
    model.nodeParentKeyProperty = SPONSOR_REP_ID;
    model.nodeDataArray = [];
    onNodeClick(node);

    // make sure the selected node is in the viewport
    this.diagram.scrollToRect(node.actualBounds);
    // move the large yellow node behind the selected node to highlight it
    this.highlighter.location = node.location;

  }

  @autobind showLocalOnFullClick() {
    const { onSelectionChange } = this.props;
    var node = this.diagram.selection.first();
    if (!!onSelectionChange) {
      const filteredSelection = this.diagram.selection.filter(({ data, type, }) =>  data[REP_ID] !== 'root' && type.name !== 'Link');
      onSelectionChange(filteredSelection);
    }
    if (this.diagram.selection.count !== 1) {
      return;
    }

    if (node === null) {
      return;
    }
    if (node.type.name === 'Link') {
      this.diagram.select(node.toNode);
      return;
    }

    this.updateLocalDiagram(node);
  }

  @autobind increaseZoom() {
    this.diagram.commandHandler.increaseZoom(DEFAULT_ZOOM_INCREASE_FACTOR);
  }

  @autobind decreaseZoom() {
    this.diagram.commandHandler.decreaseZoom(DEFAULT_ZOOM_DECREASE_FACTOR);
  }

  shouldComponentUpdate({ data, updateTime, activeNodeData }) {
    if (updateTime == this.props.updateTime && activeNodeData[REP_ID] === this.props.activeNodeData[REP_ID]) {
      return false;
    };
    if (updateTime != this.props.updateTime) {
      this.buildTree(data, activeNodeData);
    }
    if (activeNodeData[REP_ID] !== this.props.activeNodeData[REP_ID]) {
      this.selectNodeById(activeNodeData[REP_ID]);
    }
    return true;
  }

  @autobind selectAllParents({ data }, list) {
    if (data[SPONSOR_REP_ID] === 'root') {
      return;
    }
    const repID = data[REP_ID];
    const node = this.diagram.findNodeForKey(repID);
    const parent = node.findTreeParentNode();
    if (!parent) {
      return list;
    }
    list.add(parent);
    this.selectAllParents(parent, list);
    return list;
  }

  @autobind getAllChildrenNodes({ data }, list) {
    if (!data || data[LAST_IN_BRANCH]) {
      return list;
    }
    const repID = data[REP_ID];
    const node = this.diagram.findNodeForKey(repID);
    const children = node.findTreeChildrenNodes();
    for (let it = children; it.next();) {
      list.add(it.value);
      this.getAllChildrenNodes(it.value, list);
    }
    return list;
  }

  @autobind hasParent({ data }) {
    const node = this.diagram.findNodeForKey(data[REP_ID]);
    return !!node.findTreeParentNode() && data[SPONSOR_REP_ID] !== 'root';
  }

  @autobind hasChildren({ data }) {
    const node = this.diagram.findNodeForKey(data[REP_ID]);
    return node.findTreeChildrenNodes().count > 0;
  }

  @autobind isntRoot({ data }) {
    return data[REP_ID] !== 'root';
  }

  @autobind handleSelectParentsClick(_, obj) {
    const node = obj.part;
    if (node.data[REP_ID] === 'root') {
      return;
    }
    const list = new go.List(go.Node);
    const parentsList = this.selectAllParents(node, list);
    this.diagram.selectCollection(parentsList);
  }

  @autobind handleSelectChildrenClick(_, obj) {
    const node = obj.part;
    const list = new go.List(go.Node);
    const childrenNodes = this.getAllChildrenNodes(node, list);
    this.diagram.selectCollection(childrenNodes);
  }

  @autobind handleMoveRepToTop(_, obj) {
    const { onMoveToTop } = this.props;
    if(!!onMoveToTop) {
      const {data} = obj.part;
      onMoveToTop({
        id: data[ID],
        rep_id: data[REP_ID],
        name: data[NAME],
      });
    }
  }

  componentDidMount() {
    const diagram = $(go.Diagram, 'fullDiagram',
      {
        initialAutoScale: go.Diagram.UniformToFill,  // automatically scale down to show whole tree
        maxScale: 2,
        contentAlignment: go.Spot.Center,  // center the tree in the viewport
        isReadOnly: true,  // don't allow user to change the diagram
        'animationManager.isEnabled': false,
        padding: 200,
        'toolManager.hoverDelay': 100,
        layout: $(go.TreeLayout,
          { angle: 90, sorting: go.TreeLayout.SortingAscending }),
        // maxSelectionCount: 1,  // only one node may be selected at a time in each diagram
        // when the selection changes, update the myLocalDiagram view
        'ChangedSelection': this.showLocalOnFullClick,
      }
    );
    const nodeHoverAdornment =
      $(go.Adornment, 'Spot',
        {
          background: 'transparent',
          // hide the Adornment when the mouse leaves it
          mouseLeave: function (e, obj) {
            var ad = obj.part;
            ad.adornedPart.removeAdornment('mouseHover');
          }
        },
        $(go.Placeholder,
          {
            background: 'transparent',  // to allow this Placeholder to be 'seen' by mouse events
            isActionable: true,  // needed because this is in a temporary Layer
            click: function (e, obj) {
              var node = obj.part.adornedPart;
              node.diagram.select(node);
            }
          }),
        // $('Button',
        //   { alignment: go.Spot.Left, alignmentFocus: go.Spot.Right },
        //   {
        //     click: this.handleSelectParentsClick,
        //   },
        //   new go.Binding('visible', '', this.hasParent).ofObject(),
        //   $(go.TextBlock, '⬆'),
        // ),
        // $('Button',
        //   { alignment: go.Spot.Right, alignmentFocus: go.Spot.Left, },
        //   {
        //     click: this.handleSelectChildrenClick,
        //   },
        //   new go.Binding('visible', '', this.hasChildren).ofObject(),
        //   $(go.TextBlock, '⬇')),
        $('Button',
          { alignment: go.Spot.Right, alignmentFocus: go.Spot.Left, },
          {
            click: this.handleMoveRepToTop,
          },
          new go.Binding('visible', '', this.isntRoot).ofObject(),
          $(go.TextBlock, '🔝')
        ),
      );

    // Define a node template that is shared by both diagrams
    const myNodeTemplate =
      $(go.Node, 'Auto',
        {
          locationSpot: go.Spot.Center,
          'mouseHover': function (_, obj) {
            var node = obj.part;
            nodeHoverAdornment.adornedObject = node;
            node.addAdornment('mouseHover', nodeHoverAdornment);
          },
        },

        new go.Binding('text', REP_ID, go.Binding.toString),  // for sorting
        $(go.Shape, 'Rectangle',
          {name: 'node'},
          new go.Binding('fill', LAST_IN_BRANCH, (h, { panel }) => {
            if (!!panel.data[LAST_IN_BRANCH] && panel.data[CHILDREN_COUNT] > 0) {
              return '#3ea1d2';
            }
            return panel.data[HAS_INCIDENTS] ? '#ed8800' : '#464547';
          }),
          { stroke: null }),
        $(go.TextBlock,
          { row: 0, column: 1, stroke: '#ffffff', margin: 4, cursor: 'move', },
          new go.Binding('text', LAST_IN_BRANCH, (c, { panel }) => {
            if (panel.data[LAST_IN_BRANCH] && !!panel.data[CHILDREN_COUNT]) {
              return `${panel.data[NAME]} (${panel.data[CHILDREN_COUNT]})`;
            }
            return panel.data[NAME];
          })),
        {
          toolTip:  // define a tooltip for each node that displays the color as text
            $(go.Adornment, 'Auto',
              $(go.Shape, { fill: '#FFFFCC' }),
              $(go.TextBlock, { margin: 4 },
                new go.Binding('text', NAME))
            )  // end of Adornment
        }
      );
    this.diagram = diagram;
    this.diagram.nodeTemplate = myNodeTemplate;

    this.highlighter =
      $(go.Part, 'Auto',
        {
          layerName: 'Background',
          selectable: false,
          isInDocumentBounds: false,
          locationSpot: go.Spot.Center
        },
        $(go.Shape, 'Ellipse',
          {
            fill: $(go.Brush, 'Radial', { 0.95: 'white', 1.0: '#3ea1d2' }),
            stroke: null,
            desiredSize: new go.Size(200, 100),
          })
      );
    this.diagram.add(this.highlighter);
    this.buildTree();


    //   // Start by focusing the diagrams on the node at the top of the tree.
    //   // Wait until the tree has been laid out before selecting the root node.
    this.diagram.addDiagramListener('InitialLayoutCompleted', (e) => {
      const { activeNodeData, data } = this.props;
      const canvas = this.container.getElementsByTagName('canvas')[0];
      canvas.style.top = `-90px`;
      const isActiverNodeExist = data.some(item => item[REP_ID] === activeNodeData[REP_ID]);
      if(isActiverNodeExist) {
        this.selectNodeById(activeNodeData[REP_ID]);
      } else {
        this.selectNodeById(data[0][REP_ID]);
      }
      this.showLocalOnFullClick();
    });
  }

  @autobind generateModel(data) {
    this.diagram.model = new go.TreeModel();
    this.diagram.model.nodeKeyProperty = REP_ID;
    this.diagram.model.nodeParentKeyProperty = SPONSOR_REP_ID;
    this.diagram.model.nodeDataArray = data;
  }

  @autobind selectNodeById(id) {
    this.diagram.select(this.diagram.findNodeForKey(id));
  }

  @autobind buildTree(data = this.props.data, activeNodeData = this.props.activeNodeData) {
    this.generateModel(data);

    if (!activeNodeData.key) {
      return;
    }
    this.selectNodeById(activeNodeData.key);
  }

  render() {
    const { style } = this.props;
    return [
      (
        <div className="grid__col grid__col--12" key="diagram-block">
          <div id="fullDiagram" className="tree" ref={div => this.container = div} style={style}>
          </div>
        </div>
      ),
      (
        <div key="buttons-block"
          className="grid__col grid__col--12 mt-10 mb-10 ta-r">
          <Button status="white" onClick={this.decreaseZoom}>-</Button>
          <Button status="white" onClick={this.increaseZoom}>+</Button>
        </div>
      )
    ];
  }
}
