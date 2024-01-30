import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import QuestionMark from 'Components/QuestionMark';

function getActionIconClass({ data, action_type }) {
  if (['receive_compliance_email', 'send_compliance_email'].indexOf(action_type) > -1) {
    const { state, direction } = data;
    return classnames({
      'pe-7s-paper-plane': direction == 'out' && state === 'new',
      'pe-7s-mail orange': direction == 'in' && state == 'new',
      'pe-7s-mail-open': direction == 'in' && state == 'viewed',
    });
  }

  if(action_type === 'send_training_email'){
    return 'icon s7-back';
  }

  if(action_type === 'started_quiz'){
    return 'icon s7-mail-open-file';
  }

  if(action_type === 'finished_quiz'){
    return 'icon s7-note2';
  }

  if (action_type === 'send_representative_sms') {
    return 'pe-7s-phone';
  }
  if (action_type === 'add_compliance_action') {
    return 'pe-7s-gleam';
  }
  if (action_type === 'add_comment') {
    return 'pe-7s-comment';
  }
  if (action_type === 'receive_representative_sms') {
    return 'pe-7s-repeat';
  }

  if (['add_file', 'delete_file', 'add_screenshot', 'remove_screenshot'].indexOf(action_type) > -1) {
    return 'pe-7s-paperclip';
  }
  return 'pe-7s-info';
}

/**
 * ActionsHistoryActionColumn is component for displaying common info about
 * compliance action in actions history table
 */
const ActionColumn = ({ item }) => {
  let actionItemTitle = item.action_text;
  if(item.action_text === 'Send Training Email'){
    actionItemTitle = 'Training was sent';
  } else if(item.action_text === 'started_quiz'){
    actionItemTitle = 'Representative received quiz';
  } else if(item.action_text === 'finished_quiz'){
    actionItemTitle = 'Quiz Results';
  } else if(item.action_text === 'marked_as_edge_case'){
    actionItemTitle = 'Marked as Edge Case';
  } else if(item.action_text === 'unmarked_as_edge_case'){
    actionItemTitle = 'Unmarked as Edge Case';
  }

  if(item.data && item.data.open_time) {
    const time = item.data.open_time.slice(-1)[0];
    if (time) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      const date = new Date(time);
      const dateAndTime = `<span class='opened_by_recipient_label'> Open time: ${date.toLocaleString(
        "en-US",
        options
      )} </span>`;
      actionItemTitle += dateAndTime;
    }
  }
  
 const showFailureTxt = item.action_type === 'send_compliance_email' && item.data.status === 'failed';
  return (
    <span>
      <i className={getActionIconClass(item)}></i>
      &nbsp;
    <span dangerouslySetInnerHTML={{ __html: actionItemTitle }}></span>
      &nbsp;
    {showFailureTxt && (
      <React.Fragment>
        <i className="c-red">Failed</i>  &nbsp;
        <QuestionMark tooltip={item.data.message}/>
      </React.Fragment>
    )
    }
    {item.data.open_time && item.data.open_time instanceof Array && item.data.open_time.length > 1 &&
     <i className='pe-7s-exapnd2 cursor-pointer' onClick={(e) =>  localStorage.setItem('openTimePopUp', true)}/>
    }
    </span>
  );
}

ActionColumn.propTypes = {
  item: PropTypes.shape({
    /** Text, that will display after icon in actions history table */
    action_text: PropTypes.string,
    data: PropTypes.shape({
      /** (for compliance emails) Was action viewed */
      state: PropTypes.oneOf(['new', 'viewed']),
      /** (for compliance emails) Action's direction */
      direction: PropTypes.oneOf(['in', 'out'])
    }),
    /** Type of action */
    action_type: PropTypes.oneOf(['create_incident', 'add_compliance_action',
      'add_image', 'delete_image', 'add_file', 'delete_file', 'change_status',
      'change_owner', 'receive_compliance_email', 'send_compliance_email',
      'add_comment', 'add_file', 'delete_file', 'add_screenshot', 'merged',
      'remove_screenshot', 'assigned_to_incident', 'send_training_email', 'move_hit',
      'hit_to_incident', 'send_representative_sms', 'receive_representative_sms', 'started_quiz', 'finished_quiz', 'marked_as_edge_case', 'unmarked_as_edge_case', 'added_screenshots_shared_by_field_member', 'added_files_shared_by_field_member']),
  })
}

export default ActionColumn;
