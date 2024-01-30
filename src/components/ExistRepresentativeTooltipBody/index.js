import React from 'react';
import Button from 'Components/Button';

const ExistRepresentativeTooltipBody = ({ representative, onApply, onCancel, }) => (
  <div className="exist-representative">
    <div className="exist-representative__info grid">
      <div className="grid__row">
        <div className="grid__col grid__col--12 ta-c">
          We found record with the same ID <b>({representative.rep_id})</b>.
      </div>
      </div>
      <div className="grid__row">
        <div className="grid__col grid__col--4 ta-r">
          First Name:
        </div>
        <div className="grid__col grid__col--8 ellipsis">
          {representative.first_name}
        </div>
      </div>
      <div className="grid__row">
        <div className="grid__col grid__col--4 ta-r">
          Last Name:
        </div>
        <div className="grid__col grid__col--8 ellipsis">
          {representative.last_name}
        </div>
      </div>
      <div className="grid__row">
        <div className="grid__col grid__col--4 ta-r">
          Join Date:
        </div>
        <div className="grid__col grid__col--8 ellipsis">
          {representative.join_date}
        </div>
      </div>
      <div className="grid__row">
        <div className="grid__col grid__col--4 ta-r">
          Email:
        </div>
        <div className="grid__col grid__col--8 ellipsis">
          {representative.email}
        </div>
      </div>
      <div className="grid__row">
        <div className="grid__col grid__col--4 ta-r">
          Replicated Site :
        </div>
        <div className="grid__col grid__col--8 ellipsis">
          <a target="_blank" href={representative.replicated_site_url}
            className="exist-representative__link">
            {representative.replicated_site_url}
          </a>
        </div>
      </div>
      <div className="grid__row">
        <div className="grid__col grid__col--12">
          Do you want to use it?
      </div>
      </div>
    </div>
    <div className="ta-r">
      <Button size="small" className="exist-representative__apply-btn"
        onClick={onCancel}>
        No
      </Button>
      <Button size="small" className="exist-representative__apply-btn"
        onClick={onApply}>
        Yes
      </Button>
    </div>
  </div>
);

export default ExistRepresentativeTooltipBody;
