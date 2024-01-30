import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'Components/Tooltip';
import { observer } from 'mobx-react';
import { LIFETIMERANKS, ALTERNATE_RANKS} from 'Constants/LifeTimeRanksIds';
import { store } from 'rfx-core';
/**
 * RepresentativePreview is component for displaying representative preview on
 * incident form
 */
const RepresentativePreview = observer(
  ({
    representative,
    countries,
    rep_ranks,
    additional_rep_rank,
    rep_statuses,
    states,
    rep_groups,
    rep_languages = []
  }) => {
    let country, rank, status, state, groups, language;
    if (!!representative.country) {
      country = countries.filter(
        ({ id }) => id == representative.country.id
      )[0];
    } else if (!!representative.country_id) {
      country = countries.filter(
        ({ id }) => id == representative.country_id
      )[0];
    }

    if(!!representative.rep_language_id){
      language = rep_languages.find(language => language.id === representative.rep_language_id);
    }

    if (!!representative.rep_rank) {
      rank = representative.rep_rank
        ? rep_ranks.filter(({ id }) => id == representative.rep_rank.id)[0]
        : {};
    } else if (!!representative.rep_rank_id) {
      rank = rep_ranks.filter(({ id }) => id == representative.rep_rank_id)[0];
    }

    if (!!representative.additional_rep_rank) {
      additional_rep_rank = representative.additional_rep_rank
        ? rep_ranks.filter(({ id }) => id == representative.additional_rep_rank.id)[0]
        : {};
    } else if (!!representative.additional_rep_rank_id) {
      additional_rep_rank = rep_ranks.filter(({ id }) => id == representative.additional_rep_rank_id)[0];
    }

    if (!!representative.rep_status) {
      status = representative.rep_status
        ? rep_statuses.filter(({ id }) => id == representative.rep_status.id)[0]
        : {};
    } else if (!!representative.rep_status_id) {
      status = rep_statuses.filter(
        ({ id }) => id == representative.rep_status_id
      )[0];
    }

    if (!!representative.us_state_id) {
      state = states.filter(({ id }) => representative.us_state_id === id)[0];
    }

    if (!!representative.groups && !!representative.groups.length) {
      groups = representative.groups
        .map((id) => {
          return rep_groups.find((gr) => gr.id === id).name;
        })
        .join(', ');
    }
    const isLifetimRankId = (representative.client_id && LIFETIMERANKS.LIFETIMERANKSIDS.includes(representative.client_id) || store.$stores.IncidentState.item.client_id 
                             && LIFETIMERANKS.LIFETIMERANKSIDS.includes(store.$stores.IncidentState.item.client_id))
    const isAlternateRankId = (representative.client_id && ALTERNATE_RANKS.ALTERNATE_RANK_IDS.includes(representative.client_id) || store.$stores.IncidentState.item.client_id && 
                              ALTERNATE_RANKS.ALTERNATE_RANK_IDS.includes(store.$stores.IncidentState.item.client_id))
    return (
      <div className="item-preview grid">
        <div className="grid__row">
          <div className="grid__col grid__col--4 item-preview__label">
            Name:
          </div>
          <div className="grid__col grid__col--8 item-preview__value">
            <strong>
              {representative.first_name} {representative.last_name}
            </strong>
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--4 item-preview__label">ID:</div>
          <div className="grid__col grid__col--8 item-preview__value">
            <strong>{representative.rep_id}</strong>
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--4 item-preview__label">
            Email:
          </div>
          <div className="grid__col grid__col--8 item-preview__value">
            <strong>{representative.email}</strong>
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--4 item-preview__label">
            Company:
          </div>
          <div className="grid__col grid__col--8 item-preview__value">
            {representative.company_name}
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--4 item-preview__label">
            Join Date:
          </div>
          <div className="grid__col grid__col--8 item-preview__value">
            {representative.join_date}
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--4 item-preview__label">
            Replicated Site:
          </div>
          <div className="grid__col grid__col--8 item-preview__value">
            <Tooltip body={representative.replicated_site_url}>
              <span                
                className="item-preview__rep-site"
              >
                {representative.replicated_site_url}
              </span>
            </Tooltip>
          </div>
        </div>

        <div className="grid__row">
          <div className="grid__col grid__col--4 item-preview__label">
            Web Presence :
          </div>
          <div className="grid__col grid__col--8 item-preview__value">
            <Tooltip body={representative.web_presence}>
              <span
                className="item-preview__rep-site"
              >
                {representative.web_presence}
              </span>
            </Tooltip>
          </div>
        </div>

        <div className="grid__row">
          <div className="grid__col grid__col--4 item-preview__label">
            Cell Phone:
          </div>
          <div className="grid__col grid__col--8 item-preview__value">
            {representative.phone}
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--4 item-preview__label">
            Alternate Phone:
          </div>
          <div className="grid__col grid__col--8 item-preview__value">
            {representative.alternate_phone}
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--4 item-preview__label">
            Country:
          </div>
          <div className="grid__col grid__col--8 item-preview__value">
            {country ? country.name : ''}
          </div>
        </div>
        {!!state && (
          <div className="grid__row">
            <div className="grid__col grid__col--4 item-preview__label">
              State:
            </div>
            <div className="grid__col grid__col--8 item-preview__value">
              {state.name}
            </div>
          </div>
        )}
        <div className="grid__row">
          <div className="grid__col grid__col--4 item-preview__label">
            Preferred Language:
          </div>
          <div className="grid__col grid__col--8 item-preview__value">
            {language ? language.name : ''}
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--4 item-preview__label">
            Rank:
          </div>
          <div className="grid__col grid__col--8 item-preview__value">
            {rank ? rank.name : ''}
          </div>
        </div>
        {(isLifetimRankId || isAlternateRankId) && 
        <div className="grid__row">
          <div className="grid__col grid__col--4 item-preview__label">
            {isLifetimRankId? 'Lifetime Rank:': 'Alternate Rank:'}
          </div>
          <div className="grid__col grid__col--8 item-preview__value">
            {additional_rep_rank ? additional_rep_rank.name : ''}
          </div>
        </div>
       }
        <div className="grid__row">
          <div className="grid__col grid__col--4 item-preview__label">
            Status:
          </div>
          <div className="grid__col grid__col--8 item-preview__value">
            {status ? status.name : ''}
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--4 representative-preview__label">
            Sponsor:
          </div>
          <div className="grid__col grid__col--8 representative-preview__value">
            {representative.sponsor_rep_id &&
              `${representative.sponsor_full_name} (${representative.sponsor_rep_id})`}
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--4 representative-preview__label">
            Sponsor Email:
          </div>
          <div className="grid__col grid__col--8 representative-preview__value">
            <strong>{representative.sponser_rep_email}</strong>
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--4 item-preview__label">
            Additional Notes:
          </div>
          <div className="grid__col grid__col--8 item-preview__value">
            {representative.additional_notes}
          </div>
        </div>
        {
          <div className="grid__row">
            <div className="grid__col grid__col--4 item-preview__label">
              Rep Groups:
            </div>
            <div className="grid__col grid__col--8 item-preview__value">
              {groups}
            </div>
          </div>
        }
      </div>
    );
  }
);

RepresentativePreview.propTypes = {
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ),
  rep_ranks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ),
  rep_statuses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ),
  representative: PropTypes.shape({
    country_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rep_rank_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rep_status_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    rep_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    email: PropTypes.string,
    company_name: PropTypes.string,
    join_date: PropTypes.string,
    replicated_status_url: PropTypes.string,
    phone: PropTypes.string,
    alternate_phone: PropTypes.string,
    sponsor_rep_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    additional_notes: PropTypes.string,
    sponser_rep_email: PropTypes.string,
  }),
};

export default RepresentativePreview;
