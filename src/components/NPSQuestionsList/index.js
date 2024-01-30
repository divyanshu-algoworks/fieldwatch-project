import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaitingInput from 'Components/RaitingInput';
import renderComponent from 'Helpers/renderComponent';
import API from 'Helpers/api';

/**
 * NPSQuestion is component for NPS question
 */
const NPSQuestion = ({ id, text, onHide, onQuestionRate, iconPath, }) => (
  <div role="alert" className="nps-question nps-question--info">
    <div className="nps-question__main">
      <div className="nps-question__logo"></div>
      <div className="nps-question__content" dangerouslySetInnerHTML={{ __html: text }}></div>
      <button type="button" className="nps-question__close" onClick={() => onHide(id)}>
        <i className="pe-7s-close nps-question__close-icon"></i>
      </button>
    </div>
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <RaitingInput onChange={({target}) => onQuestionRate(id, target.value)} maxValue={10} />
    </div>
  </div>
);

NPSQuestion.propTypes = {
  /** NPSQuestion's id */
  id: PropTypes.any,
  /** NPSQuestion's text(Can contains HTML inside) */
  text: PropTypes.string,
  /** Close NPSQuestion handler */
  onHide: PropTypes.func,
  onQuestionRate: PropTypes.func,
};

export default class NPSQuestionsList extends Component {
  static propTypes = {
    url: PropTypes.string,
    nps_questions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      shown: PropTypes.bool,
      text: PropTypes.string,
    })),
  }

  constructor(props) {
    super(props);
    this.state = { npsQuestions: props.nps_questions, hoveredIndex: 0 }
  }

  componentDidMount() {
    this.state.npsQuestions
      .filter(({shown}) => !shown)
      .forEach(({id}) => {
        API.put(`${location.origin}${this.props.url}/${id}/view`)
      });
  }

  removeQuestion = (id) => {
    const { npsQuestions } = this.state;
    const index = npsQuestions.findIndex(question => question.id === id);
    this.setState({ npsQuestions: [].concat(
      npsQuestions.slice(0, index),
      npsQuestions.slice(index + 1)
    )});
  }

  handleHide = (id) => {
    API.put(`${location.origin}${this.props.url}/${id}/close`).then(() => {
      this.removeQuestion(id);
    })
  }

  handleRate = (id, score) => {
    const { url } = this.props;
    API.put(`${location.origin}${url}/${id}/set_score`, {
      body: {score},
    }).then(({flash_type}) => {
      if(flash_type === 'success') {
        this.removeQuestion(id);
      }
    });
  }

  render() {
    const { npsQuestions } = this.state;

    return (
      <div className="fw-nps-questions-list">
        {npsQuestions.map(question => (
          <NPSQuestion key={question.id} {...question} onHide={this.handleHide}
            onQuestionRate={this.handleRate} />
        ))}
      </div>
    );
  }
}

// document.addEventListener('DOMContentLoaded', () => {
//   renderComponent(NPSQuestionsList, 'react-nps-questions-root');
// });
