import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextEditor from 'Components/TextEditor';
import Button from 'Components/Button';
import Comment from './Comment';
import API from 'Helpers/api';
import cleanPastedHTML from 'Helpers/cleanPastedHTML';

export default class Comments extends Component {
  static propTypes = {
    commentableId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    commentableType: PropTypes.oneOf(['Incident', 'Representative']).isRequired,
    url: PropTypes.string.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      newComment: '',
      users: this.props.mention_users.map((user) => {
        const {id, email, first_name, last_name} = user;
        return {
          id,
          email,
          value: `${first_name} ${last_name}`
        }
      }),
      isBtnDisabled: false
    }
  }

  changeNewComment = (value) => {
    this.setState({ newComment: value })
  }

  getMentionedUsers = () => {
    const regexp = /data-id="(.+?)"/g;
    const matches = [...this.state.newComment.matchAll(regexp)];
    let uniqueUserIds = new Set();

    for (let match of matches) {
      uniqueUserIds.add(match[1]);
    }

    uniqueUserIds = [...uniqueUserIds];

    return this.state.users.filter((user) => uniqueUserIds.includes(`${user.id}`));
  }

  createComment = async () => {
    const { newComment } = this.state;
    const { url, commentableId, commentableType, onAddComment } = this.props;

    if (newComment === '') {
      return;
    }

    // Check if editor content is empty
    const parser = new DOMParser();
    const doc = parser.parseFromString(newComment, "text/html");
    const text = doc.body.innerText;

    if(text.trim() === ''){
      return;
    }

    this.setState({
      isBtnDisabled: true
    });

    const mentionedUsers = this.getMentionedUsers();

    const body = cleanPastedHTML(newComment);
    const { data } = await API.post(this.props.xssProtectionUrl, {
      body: {
        body
      }
    });

    API.post(url, {
      body: {
        comment: {
          body: data,
          commentable_id: commentableId,
          commentable_type: commentableType,
          users: mentionedUsers
        }
      }
    }).then((res) => {
      if(Array.isArray(res.comment) && res.comment.length>0){
        onAddComment(res.comment[0]);
        this.setState({ newComment: '', isBtnDisabled: false });
      }
    });
  }

  render() {
    const { comments, disabled, xssProtectionUrl } = this.props;
    const { newComment, users, isBtnDisabled } = this.state;
    return (
      <div className="comments">
        {!!comments && comments.map(comment => (
          <Comment {...comment} key={comment.id} />
        ))}
        <TextEditor value={newComment} disabled={disabled}
          xssProtectionUrl={xssProtectionUrl}
          onChange={this.changeNewComment} withMentions={true} userList={users}/>
        <div className="ta-r mt-10">
          <Button size="small" status="black" disabled={disabled || isBtnDisabled}
            onClick={this.createComment}>+ Add</Button>
        </div>
      </div>
    );
  }
}
