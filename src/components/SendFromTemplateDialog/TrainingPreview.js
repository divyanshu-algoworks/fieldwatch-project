import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from 'Components/Button';
const trainingPreview = ({preview, onBack}) => {
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

export default trainingPreview;