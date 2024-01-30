import React, { Component } from 'react';

import Row from './Row';
import Col from './Col';
const FlexGrid = ({ children }) => (<div className="flex-grid">{children}</div>);
FlexGrid.Row = Row;
FlexGrid.Col = Col;
export default FlexGrid;
