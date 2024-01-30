import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import TableHeader from './TableHeader';
import { TableBody, DraggableTableBody } from './TableBody';
import TablePaginator from './TablePaginator';
import PAGINATION from '../../constants/Pagination';

/**
 * Fieldwatch table component
 * @param {*} props
 */
const Table = (props) => {
  const isTbodyDraggable = !!props.draggable && !!props.data && !!props.data.length;
  const TbodyComponent = isTbodyDraggable ? DraggableTableBody : TableBody;
  const showPagination = !!props.pagination && (props.pagination.recordsTotal > PAGINATION.SIZES[0]);
  let config = props.config;
  if (!!props.visibleColumns) {
    config = config.filter(({ accessor }) => props.visibleColumns.indexOf(accessor) > -1);
  }
  const style = !!props.scroll ? {
    'overflow-x': 'scroll',
    'overflow-y': 'hidden'
  }: {}
  return (
    <div className={classnames('fw-table', { [`fw-table--horizontal-scroll`]: props.horizontalScroll })} style={style}>
      <table className={classnames('table', 'fw-table__table', {
        'table--no-pagination': !props.pagination
      })} key="table">
        <TableHeader {...props} config={config} />
        <TbodyComponent {...props} config={config} />
      </table>
      {
        !!showPagination ? (
          <div className="fw-table__paginatior-container" key="pagination-container">
            <TablePaginator {...props} key="pagination" />
          </div>
        ) : null
      }
    </div>
  );
}

Table.defaultProps = {
  pagination: true,
  showCheckPageCheckbox: true,
}

export default observer(Table);
