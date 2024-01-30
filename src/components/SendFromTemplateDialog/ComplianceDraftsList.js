import React, { useState, Fragment } from "react";
import Input from "Components/Input";
import Button from "Components/Button";

const Draft = ({ draft, onEdit, onSend, onDelete }) => (
  <li className="send-items-list__item">
    <div>{draft.title || draft.name}</div>
    <div className="d-f">
      {!!onDelete && (
        <Button size="small" status="red" onClick={() => onDelete(draft.id)}>
          Delete
        </Button>
      )}
      {!!onEdit && (
        <Button
          size="small"
          status="black"
          onClick={() => {
            onEdit(draft, true);
          }}
        >
          Edit
        </Button>
      )}
      {!!onSend && (
        <Button size="small" onClick={() => onSend(draft)}>
          Send
        </Button>
      )}
    </div>
  </li>
);

const ComplianceDraftsList = (props) => {
  const [search, setSearch] = useState("");
  const regExp = new RegExp(search.toLowerCase());

  const filterEmptyDrafts =
    props.drafts && props.drafts.filter(({ name }) => name !== null);
  const draftsToDisplay =
    filterEmptyDrafts &&
    filterEmptyDrafts.filter(({ title, name }) =>
      regExp.test(title ? title.toLowerCase() : name.toLowerCase())
    );
  return (
    <Fragment>
      <div className="ta-r mb-10" key="search-block">
        <Input
          type="search"
          value={search}
          onChange={({ target }) => setSearch(target.value)}
        />
        {/* {!!props.onCreate && (
          <Button
            state="black"
            className="ml-10"
            status="black"
            onClick={() => props.onCreate()}
          >
            New
          </Button>
        )} */}
      </div>
      <ul className="send-items-list">
        {draftsToDisplay &&
          draftsToDisplay.map((draft) => (
            <Draft
              key={draft.id}
              draft={draft}
              onSend={props.onSend}
              onEdit={props.onEdit}
              onDelete={props.onDelete}
            />
          ))}
      </ul>
    </Fragment>
  );
};

export default ComplianceDraftsList;
