import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { autobind } from 'core-decorators';
import * as go from "gojs";
import Button from 'Components/Button';

import {
  REP_ID, NAME, PARENTS_COUNT, REP_RANK, REP_STATUS,
} from 'Constants/FieldsTreeKeys';

var $ = go.GraphObject.make;

const DEFAULT_ZOOM_INCREASE_FACTOR = 1.5;
const DEFAULT_ZOOM_DECREASE_FACTOR = 1 / DEFAULT_ZOOM_INCREASE_FACTOR;

function textStyle() {
  return { font: "9pt  Segoe UI,sans-serif", stroke: "white", cursor: 'move' };
}

var levelColors = ["#AC193D", "#2672EC", "#8C0095", "#5133AB",
  "#008299", "#D24726", "#008A00", "#094AB2"];

@inject('store')
@observer
export default class LocalTree extends Component {
  static defaultProps = {
    style: {
      width: '100%',
      height: '450px',
      margin: '2px'
    }
  }

  @autobind showLocalOnLocalClick() {
    const { onNodeClick } = this.props;
    var selectedLocal = this.diagram.selection.first();
    if (selectedLocal !== null) {
      // there are two separate Nodes, one for each Diagram, but they share the same key value
      onNodeClick(selectedLocal);
    }
  }

  @autobind increaseZoom() {
    this.diagram.commandHandler.increaseZoom(DEFAULT_ZOOM_INCREASE_FACTOR);
  }

  @autobind decreaseZoom() {
    this.diagram.commandHandler.decreaseZoom(DEFAULT_ZOOM_DECREASE_FACTOR);
  }

  componentDidMount() {
    this.diagram = $(go.Diagram, 'localDiagram', {
      initialAutoScale: go.Diagram.None,
      maxScale: 1,
      contentAlignment: go.Spot.Center,
      isReadOnly: true,
      'animationManager.isEnabled': false,
      padding: 200,
      layout: $(go.TreeLayout,
        {
          treeStyle: go.TreeLayout.StyleLastParents,
          arrangement: go.TreeLayout.ArrangementHorizontal,
          // properties for most of the tree:
          angle: 90,
          layerSpacing: 35,
          // properties for the "last parents":
          alternateAngle: 90,
          alternateLayerSpacing: 35,
          alternateAlignment: go.TreeLayout.AlignmentBus,
          alternateNodeSpacing: 20,
          sorting: go.TreeLayout.SortingAscending
        }),
      'LayoutCompleted': (e) => {
        const sel = e.diagram.selection.first();
        if (sel !== null) this.diagram.scrollToRect(sel.actualBounds);
      },
      maxSelectionCount: 1,
      // when the selection changes, update the contents of the myLocalDiagram
      'ChangedSelection': this.showLocalOnLocalClick
    });
    this.diagram.nodeTemplate =
      $(go.Node, 'Auto',
        // for sorting, have the Node.text be the data.name
        new go.Binding('text', NAME),
        // bind the Part.layerName to control the Node's layer depending on whether it isSelected
        new go.Binding('layerName', 'isSelected', function (sel) { return sel ? 'Foreground' : ''; }).ofObject(),
        // define the node's outer shape
        $(go.Shape, 'Rectangle',
          new go.Binding('fill', PARENTS_COUNT, (parentsCount) =>
            levelColors[parentsCount - this.props.store.FieldsState.minDepth]),

          {
            name: 'SHAPE', stroke: null,
            // set the port properties:
            portId: '', fromLinkable: true, toLinkable: true, cursor: 'move',
            strokeWidth: 8,
          }),
        $(go.Panel, 'Horizontal',
          // define the panel where the text will appear
          $(go.Panel, 'Table',
            {
              maxSize: new go.Size(150, 999),
              margin: new go.Margin(6, 10, 0, 3),
              cursor: 'move',
              defaultAlignment: go.Spot.Left
            },
            $(go.RowColumnDefinition, { column: 2, width: 4 }),
            $(go.TextBlock, textStyle(),  // the name
              {
                row: 0, column: 0, columnSpan: 5,
                font: '12pt Segoe UI,sans-serif',
                cursor: 'move',
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 16)
              },
              new go.Binding('text', NAME)),
            $(go.TextBlock, 'Rank: ', textStyle(),
              { row: 1, column: 0 }),
            $(go.TextBlock, textStyle(),
              {
                row: 1, column: 1, columnSpan: 4,
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 14),
                margin: new go.Margin(0, 0, 0, 3)
              },
              new go.Binding('text', REP_RANK)),
            $(go.TextBlock, 'ID#: ', textStyle(),
              { row: 2, column: 0 }),
            $(go.TextBlock, textStyle(),
              {
                row: 2, column: 1, columnSpan: 4,
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 14),
                margin: new go.Margin(0, 0, 0, 3)
              },
              new go.Binding('text', REP_ID)),
            $(go.TextBlock, 'Status: ', textStyle(),
              { row: 3, column: 0 }),
            $(go.TextBlock, textStyle(),
              {
                row: 3, column: 1, columnSpan: 4,
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 14),
                margin: new go.Margin(0, 0, 0, 3)
              },
              new go.Binding('text', REP_STATUS)),
          )  // end Table Panel
        ) // end Horizontal Panel
      );  // end Node
    this.diagram.linkTemplate =
      $(go.Link, go.Link.Orthogonal,
        { corner: 5, relinkableFrom: true, relinkableTo: true },
        $(go.Shape, { strokeWidth: 4, stroke: '#3ea1d2' }));  // the link shape
    this.diagram.addDiagramListener('InitialLayoutCompleted', (e) => {
      const canvas = this.container.getElementsByTagName('canvas')[0];
      canvas.style.top = `-90px`;
    });
  }

  shouldComponentUpdate({ model, updateTime, selectedNode }) {
    if (updateTime == this.props.updateTime) {
      return false;
    }
    this.diagram.model = model;
    // select the node at the diagram's focus
    var selectedLocal = this.diagram.findPartForKey(selectedNode.data[REP_ID]);
    if (selectedLocal !== null) selectedLocal.isSelected = true;
    return true;
  }

  render() {
    const { style } = this.props;
    return [(
      <div id="localDiagram" className="tree" key="diagram"
        ref={div => this.container = div}
        style={style}></div>
      ),
      (
        <div key="buttons-block"
          className="grid__col grid__col--12 mt-10 mb-10 ta-r">
          <Button status="white" onClick={this.decreaseZoom}>-</Button>
          <Button status="white" onClick={this.increaseZoom}>+</Button>
        </div>
      ),
    ];
  }
}
