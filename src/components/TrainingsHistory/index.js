import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'Components/Button';
import Table from 'Components/Table';
import Dialog from 'Components/Dialog';

const ActionColumn = ({ item, onClick }) => {
  const iconClassName = classnames('icon', {
    's7-back': item.action === 'link_sent',
    's7-mail-open-file': item.action === 'started_quiz',
    's7-note2': item.action === 'finished_quiz',
  });

  const actionTitle = classnames({
    'Training was sent': item.action === 'link_sent',
    'Representative received quiz': item.action === 'started_quiz',
    'Quiz results': item.action === 'finished_quiz',
  });

  if(item.action === 'finished_quiz') {
    return (
      <Button status="link" onClick={() => onClick(item.training_data)}>
        <i className={iconClassName}></i> {actionTitle}
      </Button>
    );
  }

  return (
    <div>
      <i className={iconClassName}></i> {actionTitle}
    </div>
  );
}

export default class TrainingsHistory extends Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      training_name: PropTypes.string,
      from: PropTypes.string,
      send_date: PropTypes.string,
      received_date: PropTypes.string,
      completed_date: PropTypes.string,
    })),
    visibleColumns: PropTypes.arrayOf(
      PropTypes.oneOf(
        ['action', 'training_name', 'from', 'send_date', 'received_date', 'completed_date']
      )
    ),
  }

  static defaultProps = {
    visibleColumns: ['action', 'training_name', 'from', 'send_date', 'received_date', 'completed_date'],
  }

  state = {
    dialogData: [],
  }

  handleOpenDialog = (dialogData) => {
    this.setState({ dialogData, });
  }

  handleCloseDialog = () => {
    this.setState({ dialogData: [], });
  }

  get tableConfig() {
    const { visibleColumns } = this.props;
    return [
      {
        title: 'Status',
        accessor: 'action',
        componentFn: ({item}) => (
          <ActionColumn item={item} onClick={this.handleOpenDialog} />
        ),
      },
      {
        title: 'Training Name',
        accessor: 'training_name',
      },
      {
        title: 'From',
        accessor: 'from',
      },
      {
        title: 'Send Date',
        accessor: 'send_date',
      },
      {
        title: 'Received Date',
        accessor: 'received_date',
      },
      {
        title: 'Completed Date',
        accessor: 'completed_date',
      },
    ].filter(({accessor}) => visibleColumns.indexOf(accessor) > -1);
  }

  get questionsList() {
    const { dialogData } = this.state;
    return dialogData.map(({question, answer, correct}, index) => {
      const iconClass = correct ? 'fa fa-check c-green' : 'fa fa-times c-red';
      return (
        <div key={index}>
          <p>{index + 1}. {question}</p>
          <i className={iconClass} aria-hidden="true"></i>
          &nbsp;
          {answer}
        </div>
      );
    })
  }

  render() {
    const { actions } = this.props;
    const { dialogData } = this.state;
    const correctAnswers = dialogData.filter(({correct}) => !!correct);
    const correctAnswerPercentage = Math.round(correctAnswers.length / dialogData.length * 100);

    return [
      (
        <Table key="actions-table" data={actions} config={this.tableConfig} />
      ),
      (
        <Dialog key="actions-dialog" isOpen={!!dialogData.length} onClose={this.handleCloseDialog}>
          <Dialog.Header onClose={this.handleCloseDialog}>Quiz Results</Dialog.Header>
          <Dialog.Body>
            <p>Total % of right answers: {correctAnswerPercentage}%</p>
            <p>All Questions:</p>
            {this.questionsList}
          </Dialog.Body>
        </Dialog>
      )
    ];
  }
}
