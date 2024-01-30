import React, { useState } from 'react';
import PropTypes from 'prop-types';
import API from 'Helpers/api';

const Notice = ({ id, text, close_url, onHide }) => (
  <div role="alert" className="fw-notice fw-notice__warning">
    <i className="pe-7s-pin fw-notice__info-icon"></i>
    &nbsp;
      <div className="fw-notice__content" dangerouslySetInnerHTML={{ __html: text }}></div>
    <button type="button" className="fw-notice__close" id ='fw-notice-close'onClick={() => onHide(id, close_url)}>
      <i className="pe-7s-close-circle fw-notice__close-icon"></i>
    </button>
  </div>
);

Notice.propTypes = {
  /** Notice's id */
  id: PropTypes.any,
  /** Notice's text(Can contains HTML inside) */
  text: PropTypes.string,
  /** Close notice handler */
  onHide: PropTypes.func
};

const NoticesList = (props) => {
  const [ notices, setNotices ] = useState(props.notices);
  const hideNotice = (id, url) => {
    API.put(url).then(() => {
      const index = notices.findIndex((notice) => notice.id === id);
      setNotices([].concat(notices.slice(0, index), notices.slice(index + 1)));
    });
  }
  return (
    <div className="fw-notices-list" id='notice-list'>
      {notices.map(notice => (
        <Notice key={notice.id} {...notice} onHide={hideNotice} />
      ))}
    </div>
  );
}

NoticesList.propTypes = {
  notices: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string,
  }))
};

export default NoticesList;
