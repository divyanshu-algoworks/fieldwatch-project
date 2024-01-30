import React from 'react';
import classnames from 'classnames';
const chatList = ({ messages }) => (
  <div className="chat-list">
    {messages.map((item, index) => (
      <div className={classnames('mb-20', item.is_incoming ? 'ta-l' : 'ta-r')} key={item.id || index}>
        <div className={`chat-list__message chat-list__message--${item.is_incoming ? 'incoming' :'outgoing'}`}>
          {item.body}
        </div>
        <small className="chat-list__message-date">{item.created_at}</small>
      </div>
    ))}
  </div>
);

export default chatList;