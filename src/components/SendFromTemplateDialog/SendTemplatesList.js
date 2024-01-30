import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import Input from 'Components/Input';
import Button from 'Components/Button';
import GAEvents from '../../constants/GAEvents'
const Template = ({ tmp, onEdit, onPreview, onSend ,analytics_key,current_user_role}) => (
  <li className="send-items-list__item">
    <div>{tmp.title}</div>
    <div className="d-f">
      {!!onPreview && (
        <Button size="small" onClick={() => {
          GAEvents.PreviewEmail(analytics_key)
          onPreview(tmp)}}>
          preview
        </Button>
      )}
      {!!onEdit && (
        <Button size="small" status="black" onClick={() => onEdit(tmp)}>
          edit
        </Button>
      )}
      {!!onSend && (
        <Button size="small" onClick={() => {
         // GAEvents.actions("Trainings",analytics_key,current_user_role.id,"Training Email")
          onSend(tmp)}}>
          send
        </Button>
      )}
    </div>
  </li>
);

const sendTemplatesList = (props) => {
  const {items = []} = props;
  const [search, changeSearch] = useState('');
  const regExp = new RegExp(search.toLowerCase());
  const itemsToDisplay = items.filter(({ title }) => regExp.test(title.toLowerCase()));
  return (
    <Fragment>
      <div className="ta-r mb-10" key="search-block">
        <Input type="search" value={search} onChange={({ target }) => changeSearch(target.value)} />
        {!!props.onCreate && (
          <Button state="black" className="ml-10" status="black" onClick={() => props.onCreate()}>New</Button>
        )}
      </div>
      <ul className="send-items-list">
        {itemsToDisplay.map(item => (
          <Template key={item.id} tmp={item} onSend={props.onSend} onEdit={props.onEdit}
            onPreview={props.onPreview}
            analytics_key={props.analytics_key}
            current_user_role={props.current_user_role}
            />
        ))}
      </ul>
    </Fragment>
  );
}

sendTemplatesList.propTypes = {
  emails: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any,
    title: PropTypes.string,
  })),
  onCreate: PropTypes.func,
  onSend: PropTypes.func,
  onPreview: PropTypes.any,
};

export default sendTemplatesList;
