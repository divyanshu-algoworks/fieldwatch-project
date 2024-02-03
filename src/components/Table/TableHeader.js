import React from 'react';
import Button from '../Button';
import Input from '../Input';
import { getClientType } from '../../helpers/cookie'
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
function getSortIcon(sorting, column) {
  if (column.accessor !== sorting.sortColumn) {
    return 'fa fa-sort';
  }
  //return `glyphicon glyphicon-sort-by-attributes${sorting.sortDirection === 'desc' ? '-alt' : ''}`;
  return sorting.sortDirection !== 'desc' ? 'fa fa-sort-amount-asc' : 'fa fa-sort-amount-desc'
}

/**
 * FieldWatch table column sort button component
 * @param {*} param0
 */
const SortingButton = ({ sorting, column, onSortChange }) => {
  return (
    <Button status="link"
      className="table__sort-indicator"
      onClick={() => { onSortChange(column.accessor, sorting.sortDirection == 'asc' ? 'desc' : 'asc') }}>
      &nbsp;
    <i className={getSortIcon(sorting, column)}></i>
    </Button>
  )
};

/**
 * FieldWatch table header component
 * @param {*} props
 */
const TableHeader = (props) => {
  const client_type =  getClientType()
  return (
    <thead>
      <tr className="fw-table__header">
        {!!props.onRowCheck && [(
          <th className="fw-table__cell fw-table__cell--header fw-table__cell--fixed fw-table__cell--check" key="row-check">
            {!!props.showCheckPageCheckbox ? (
              <Input type="checkbox" size="small" disabled={['fc'].includes(client_type) || !props.data.length}
                checked={props.isAllPageChecked}
                onChange={({ target }) => props.onRowCheck('all', target.checked)} />
            ) : (<div>&nbsp;</div>)}
          </th>
        ), (
          <th style={{ minWidth: '31px' }} key="back"></th>
        )]}
        {props.config.map((column) => (
          <th className="fw-table__cell fw-table__cell--header" key={column.accessor || column.title}>
            {column.title}
            {!!column.sortable && (<SortingButton {...props} column={column} />)}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default observer(TableHeader);
