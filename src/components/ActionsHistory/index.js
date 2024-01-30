import React, { useRef, Fragment, useState } from "react";
import ActionColumn from "./ActionColumn";
import ActionBodyDialog from "./ActionBodyDialog";
import Dialog from "Components/Dialog";
import Table from "Components/Table";
import API from "Helpers/api";

const actionsHistoryTableConfig = [
  {
    title: "Action",
    componentFn: ({ item }) => <ActionColumn item={item} />,
  },
  {
    title: "User",
    accessor: "user_full_name",
    style: {
      width: "220px",
    },
  },
  {
    title: "Date & Time",
    accessor: "created_at",
    style: {
      width: "220px",
    },
    componentFn: ({ item }) => {
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric"	
        }
        const date = new Date(item.created_at)
        return (date.toLocaleString('en-US', options));
  },
}
];

const ActionsHistory = (props) => {
  const bodyDialog = useRef();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [timestamps, setTimestamps] = useState([]);

  function handleRowClick(action) {
    if (localStorage.getItem('openTimePopUp')) {
      setIsDialogOpen(true);
      setTimestamps(action.data.open_time);
      localStorage.removeItem("openTimePopUp");
      return;
    }
    if (!action.clickable) {
      return;
    }
    const { incidentUrl, onUpdateAction } = props;
    if (
      [
        "receive_compliance_email",
        "send_compliance_email",
        "send_training_email",
        "finished_quiz",
      ].indexOf(action.action_type) > -1
    ) {
      API.get(`${incidentUrl}/user_activities/${action.id}.json`).then(
        (data) => {
          if (!!onUpdateAction) {
            onUpdateAction(data);
          }
          bodyDialog.current.open(data);
        }
      );
    } else {
      bodyDialog.current.open(action);
    }
  }
  const {
    disabled,
    onReply,
    representative,
    updateScreenshotsList,
    updateFilesList,
    ...tableProps
  } = props;
  return (
    <Fragment>
      <Table
        {...tableProps}
        loading={props.loading}
        config={actionsHistoryTableConfig}
        pagination={tableProps.pagination || false}
        onRowClick={!disabled && handleRowClick}
        key="table"
        rowClassFn={({ clickable }) =>
          !disabled && clickable ? "pointer" : ""
        }
      />
      <ActionBodyDialog
        ref={bodyDialog}
        representative={representative}
        key="dialog"
        onReply={onReply}
        updateScreenshotsList={updateScreenshotsList}
        updateFilesList={updateFilesList}
      />
      <Dialog isOpen={isDialogOpen} setMarginTop={true}>
        <Dialog.Header onClose={() => setIsDialogOpen(false)}>
          <h4 className="dialog__title ">Open Timestamps</h4>
        </Dialog.Header>
        <Dialog.Body>
        <ul>
          {timestamps && timestamps.map((time) => {
            return <li style={{color: '#3ea1d2'}}>{moment(time).format('MMMM DD, YYYY h:mm A')}</li>
          })}
        </ul>
        </Dialog.Body>
      </Dialog>
    </Fragment>
  );
};

export default ActionsHistory;
