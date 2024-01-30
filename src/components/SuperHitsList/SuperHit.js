import React, { Component } from 'react';
import classnames from 'classnames';

export default class SuperHit extends Component {
  getSuperQueryEditUrl({ client_id, super_query_id }) {
    return `/clients/${client_id}/super_queries/${super_query_id}/edit`;
  }

  render() {
    const { item } = this.props;

    const query = item.super_query_name ? `Query: ${item.super_query_name}` : null;

    const source = item.source ? `Source: ${item.source}` : null;

    const separator = (!!query && !!source) ? ' / ' : '';

    return (
      <div className='hit'>
        {!!item.is_new && (
          <div className="hit__new-label"></div>
        )}
        <div className={classnames('hitsource-icon', 'hit__icon', item.url_logo)}></div>
        <div className={classnames('hit__body', {'hit__body--with-image': !!item.image})}>
          <a href={item.url} target="_blank" className="hit__link ellipsis">
            {item.url}
          </a>
          <div
            className="hit__description"
            dangerouslySetInnerHTML={{
              __html: item.html_snippet || item.snippet || 'Preview not available.'
            }}
          />
          <div className="hit__addition-info">
            <a href={`${this.getSuperQueryEditUrl(item)}`} className="hit__query-link">
              {query}
            </a>
            {separator}
            {source}
            &nbsp;/ Hit created:&nbsp;
            {item.created_at}
          </div>
        </div>
      </div>
    )
  }
}