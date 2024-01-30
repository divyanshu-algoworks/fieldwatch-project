import React from 'react';
import PaginationButtons from './PaginationButtons';
import PAGINATION from '../../constants/Pagination';

const PaginationInfo = (({ pagination }) => {
  const { page, sizePerPage, recordsTotal } = pagination;
  const firstRecord = (page - 1) * sizePerPage + 1;
  const lastRecord = Math.min(firstRecord + sizePerPage - 1, recordsTotal);

  return (
    <div className="fw-table__pagination-info">
      Showing {firstRecord} to {lastRecord} of {recordsTotal} entries
    </div>
  );
})

const TablePaginator = (props) => {
  if (props.pagination.recordsTotal < PAGINATION.SIZES[0]) {
    return null;
  }

  return (
    <div className="fw-table__paginator">
      <div>
        <PaginationInfo {...props} />
        {!props.hidePaginationChanger && (
          <PaginationSize {...props} />
        )}
      </div>
      <div>
        <PaginationButtons {...props} />
      </div>
    </div>
  );
};

const PaginationSize = ({ pagination, onPaginationChange, draggable, }) => [
  (
    <label className="control-select" key="select-label">
      <select name="table1_length"
        className="form-control input-sm"
        value={pagination.sizePerPage}
        onChange={({ target }) => onPaginationChange({ page: 1, sizePerPage: Number(target.value) })}
      >
        {PAGINATION.SIZES.map(item => (
          <option key={item} value={item}>{item}</option>
        ))}
        {!!pagination.recordsTotal && !!draggable && (<option value={pagination.recordsTotal}>All ({pagination.recordsTotal})</option>)}
      </select>
      <i className="fa fa-angle-down" aria-hidden="true"></i>
    </label>
  ),
  (<span key="select-notation">&nbsp;entries per page</span>)
];


export default TablePaginator;
