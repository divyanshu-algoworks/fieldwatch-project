import React, { Fragment } from "react";

export const FieldSummaryInfo = ({ summaryInfo }) => {
  if (!Object.keys(summaryInfo).length) {
    return null;
  }

  const {
    categories,
    incidents_count,
    rep_ranks,
    representative_emails,
    trainings,
  } = summaryInfo;
  return (
    <div className="actions-panel__summary-container instruction-pannel">
      <dl>
        {incidents_count !== undefined && (
          <Fragment>
            <dt className="actions-panel__summary-termin">
              Incidents Count: {incidents_count}
            </dt>
            <dd></dd>
          </Fragment>
        )}
        {!!categories && !!categories.length && (
          <Fragment>
            <dt className="actions-panel__summary-termin">Categories</dt>
            <dd className="actions-panel__summary-definition">
              {categories.map((category) => (
                <div key={category}>{category}</div>
              ))}
            </dd>
          </Fragment>
        )}
        {!!rep_ranks && !!rep_ranks.length && (
          <Fragment>
            <dt className="actions-panel__summary-termin">
              Representative Ranks
            </dt>
            <dd className="actions-panel__summary-definition">
              {rep_ranks.map((rank) => (
                <div key={rank}>{rank}</div>
              ))}
            </dd>
          </Fragment>
        )}
        {!!representative_emails && !!representative_emails.length && (
          <Fragment>
            <dt className="actions-panel__summary-termin">
              Representative Emails
            </dt>
            <dd className="actions-panel__summary-definition">
              {representative_emails.map(({ name, emails_count }) => (
                <div key={name}>
                  {name} <strong>({emails_count})</strong>
                </div>
              ))}
            </dd>
          </Fragment>
        )}
        {!!trainings && !!trainings.length && (
          <Fragment>
            <dt className="actions-panel__summary-termin">Trainings</dt>
            <dd className="actions-panel__summary-definition">
              {trainings.map(({ name, trainings_count }) => (
                <div key={name}>
                  {name} <strong>({trainings_count})</strong>
                </div>
              ))}
            </dd>
          </Fragment>
        )}
      </dl>
    </div>
  );
};
