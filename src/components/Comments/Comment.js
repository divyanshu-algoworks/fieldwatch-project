import React from 'react';
import PropTypes from 'prop-types';

const Comment = ({ user_avatar_url, user_name, date, body }) => (
  <div className="comment">
    <div className="comment__avatar-container">
      <img className="comment__avatar-img" src={user_avatar_url} />
    </div>
    <div className="comment__body">
      <div>
        <strong className="comment__user-name">{user_name}</strong>
        <span className="comment__date">{date}</span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: body }}></div>
    </div>
  </div>
);

Comment.propTypes = {
  user_avatar_url: PropTypes.string,
  user_name: PropTypes.string,
  date: PropTypes.string,
  body: PropTypes.string,
}

export default Comment;
