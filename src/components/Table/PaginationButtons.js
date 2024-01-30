import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Button from '../Button';
import PAGINATION from '../../constants/Pagination';


const PaginationButtons = ({ pagination, onPaginationChange }) => {
  const { page, sizePerPage, recordsTotal } = pagination;

  const pagesTotal = Math.ceil(recordsTotal / sizePerPage);
  if (pagesTotal <= 1) {
    return null;
  }
  let minPage = Math.max(page - Math.floor(PAGINATION.MAX_PAGES / 2), 1);
  let maxPage = minPage + PAGINATION.MAX_PAGES - 1;
  if (maxPage > pagesTotal) {
    maxPage = pagesTotal;
    minPage = Math.max(pagesTotal - PAGINATION.MAX_PAGES, 1);
  }
  const buttons = Array.apply(null, { length: maxPage - minPage + 1 }).map((value, i) => {
    const index = minPage + i;
    const isCurrent = index === page;
    const btnClassName = classnames('fw-table__pagination-button', {
      'fw-table__pagination-button--active': isCurrent
    });
    return (
      <Button key={`pagination-button-${index}`}
        className={btnClassName}
        disabled={isCurrent}
        onClick={() => onPaginationChange({ page: index })}>
        {index}
      </Button>
    );
  });

  return [
    (
      <Button key="pagination-button-first"
        className="fw-table__pagination-button"
        disabled={page === 1}
        onClick={() => onPaginationChange({ page: 1 })}>
        <div className="arrows">
          <i className="glyphicon glyphicon-menu-left"></i>
          <i className="glyphicon glyphicon-menu-left"></i>
        </div>
      </Button>
    ),
    buttons,
    (
      <Button key="pagination-button-last"
        className="fw-table__pagination-button"
        disabled={page === pagesTotal}
        onClick={() => onPaginationChange({ page: pagesTotal })}>
        <div className="arrows arrows--right">
          <i className="glyphicon glyphicon-menu-right"></i>
          <i className="glyphicon glyphicon-menu-right"></i>
        </div>
      </Button>
    )
  ];
}

PaginationButtons.propTypes = {
  onPaginationChange: PropTypes.func,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    sizePerPage: PropTypes.number,
    recordsTotal: PropTypes.number,
  }),
};

export default PaginationButtons;
