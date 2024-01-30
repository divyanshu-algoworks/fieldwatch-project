import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from 'Components/Button';
import Preloader from 'Components/Preloader';
import API from 'Helpers/api';

/**
 * TrainingPreview is component to show training preview from training emails
 * list
 */
export default class TrainingPreview extends Component {
  static propTypes = {
    trainingsUrl: PropTypes.string,
    item: PropTypes.shape({
      questions: PropTypes.arrayOf(PropTypes.shape({

      })),
      training: PropTypes.shape({
        /** training name */
        name: PropTypes.string,
        /** training video thubnail url */
        video_screenshot: PropTypes.string,
        /** training additional text */
        additional_text: PropTypes.string,
      })
    }),
    /** Handler click on "back to list" button */
    onBack: PropTypes.func,
  }

  state = {
    preview: null,
  };

  /**
   * When component start mount, then we will send ajax request to get preview
   * of training.
   */
  componentWillMount() {
    const { trainingsUrl, item } = this.props;
    API.get(`${trainingsUrl}/${item.id}/show_training_preview`).then(({ data }) => {
      this.setState({ preview: data });
    });
  }

  render() {
    const { preview } = this.state;
    const { onBack } = this.props;
    if (!preview) {
      return (<Preloader />);
    }
    const { name, video_screenshot, additional_text } = preview.training;
    return (
      <div>
        <h4 className="f-l">Training Module Preview</h4>
        <div className="f-r">
          <Button size="small" status="black" onClick={onBack}>back to list</Button>
        </div>
        <div className="grid clearfix">
          {!!name && (<div className="grid__row">
            <div className="grid__col grid__col--3"><strong>Name</strong></div>
            <div className="grid__col grid__col--9">{name}</div>
          </div>)}
          {!!video_screenshot && (<div className="grid__row">
            <div className="grid__col grid__col--3"><strong>Video</strong></div>
            <div className="grid__col grid__col--9">
              <img src={video_screenshot} />
            </div>
          </div>)}
          {!!additional_text && (<div className="grid__row">
            <div className="grid__col grid__col--3"><strong>Additional text</strong></div>
            <div className="grid__col grid__col--9">{additional_text}</div>
          </div>)}
          <div className="grid__row">
            <div className="grid__col grid__col--3"><strong>Quiz</strong></div>
            <div className="grid__col grid__col--9">
              <ol className="training-questions">
                {preview.questions.map(question => (
                  <li className="training-questions__question training-question" key={question.id}>
                    <div className="training-question__title">
                      <b>{question.title}</b>
                    </div>
                    <ol className="training-question__answers">
                      {question.answers_attributes.map(answer => (
                        <li className={classnames(
                          'training-question__answer',
                          { 'training-question__answer--correct': answer.correct }
                        )} key={answer.id}>
                          {answer.title}
                        </li>
                      ))}
                    </ol>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
