import React from 'react';

const Comment = ({ body, date, user_name, user_avatar_url }) => (
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

export default Comment;
