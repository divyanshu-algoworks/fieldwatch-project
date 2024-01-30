import React from 'react';
import Button from '../../components/Button';

export const FiltersTrigger = ({ filters, className = 'mb-10', text = 'Additional Filters', disable = false }) => {
  function handleClick() {
    filters.current.toggleFiltersVisibility();
  }

  return (
    <Button size="small" disabled={disable} onClick={handleClick} className={className}>
      {text}
    </Button>
  );
}
