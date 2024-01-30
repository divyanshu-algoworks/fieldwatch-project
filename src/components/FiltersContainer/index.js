import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import Button from 'Components/Button';

export default class FiltersContainer extends Component {
  state = {
    isOpen: false
  }

  @autobind toggleOpenFilters() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const { children, onClear } = this.props;
    const { isOpen } = this.state;
    return (
      <div className="filters-container grid">
        <div className="grid__row">
          <div className="grid__col grid__col--12">
            <Button onClick={this.toggleOpenFilters} size="small">
              Additional Filters
            </Button>
          </div>
        </div>
        {!!isOpen && (
          <div className="filters-container__body">
            <div className="grid__row">
              <div className="grid__col grid__col--12">
                <Button status="black" size="small" onClick={onClear}>
                  Clear All
                </Button>
              </div>
            </div>
            <div className="grid__row">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  }
}
