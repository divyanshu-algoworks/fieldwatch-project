import React from 'react';
import Paper from 'Components/Paper';

const TrainingVideoPortalFunctionality = ({ title, videos }) => {
  return (
    <Paper>
      <Paper.Header>
        <Paper.Title>{title}</Paper.Title>
      </Paper.Header>
      <Paper.Body>
        {videos.filter(({ video_url }) => !!video_url).map(({ title, video_url, main_points }) => (
          <div key={title} className="portal-functionality">
            <div className="portal-functionality__body">
              <div className="portal-functionality__description">
                <h3 className="portal-functionality__title">{title}</h3>
                <ul className="portal-functionality__main-points">
                  {!!main_points && main_points.map(point => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              <div className="portal-functionality__video">
                <iframe src={video_url} allowFullScreen width="550px" height="315px" />
              </div>
            </div>
          </div>
        ))}
      </Paper.Body>
    </Paper>
  )
};

export default TrainingVideoPortalFunctionality;
