import React from 'react';
import classnames from 'classnames';
import Button from 'Components/Button';
import Tooltip from 'Components/Tooltip';

const ActionsColumn = ({
  children, getEditItemUrlFn, getArchiveUrlFn,showArchiveIcon, showUnArchiveIcon, getSubQueryLogURLFn, onDestroy, onRepublish,
  onUnlinkIncident, onSearchResultsShow, onArchive, item, client_type
}) => {
  return (
    <div className={`table-actions ${['fc'].includes(client_type) ? 'disabled_element' : ''}`}>
      {children ? children : null}
      {!!onArchive && item.can_archive && (
        <Tooltip body="Archive" className="table-actions__tooltip-container">
          <Button className="table-actions__button" status="link" onClick={() => onArchive(item)}>
            <i className={classnames('pe-7s-box1 icon icon--bold icon--button', { 'c-blue': !!item.archived })} />
          </Button>
        </Tooltip>
      )}
      {!!onSearchResultsShow && (
        <Tooltip body="Search Results" className="table-actions__tooltip-container">
          <Button className="table-actions__button" status="link"
            onClick={() => onSearchResultsShow(item)}>
            <i className="pe-7s-note2 icon icon--bold icon--button"></i>
          </Button>
        </Tooltip>
      )}
      {!!getSubQueryLogURLFn && (
        <Tooltip body="Sub Query Log" className="table-actions__tooltip-container">
          <Button className="table-actions__button" type="link" status="link"
            href={getSubQueryLogURLFn(item)}>
            <i className="pe-7s-folder icon icon--bold icon--button"></i>
          </Button>
        </Tooltip>
      )}
      {!!getEditItemUrlFn && (
        <Tooltip body="Edit Record" className="table-actions__tooltip-container">
          <Button className='table-actions__button' type="link" status="link"
            href={getEditItemUrlFn(item)}>
            <i className="pe-7s-note icon icon--bold icon--button"></i>
          </Button>
        </Tooltip>
      )}
      {!!getArchiveUrlFn && (showArchiveIcon || showUnArchiveIcon) &&(
         <Tooltip body={showArchiveIcon ? "Archive Record": "Unarchive Record"} className="table-actions__tooltip-container">
         <Button className='table-actions__button' type="button" status="link"
           onClick={() => getArchiveUrlFn(item)}>
            {showArchiveIcon?
              <i className="pe-7s-box1 icon icon--bold icon--button"></i>
               :
              <i className="pe-7s-box1 icon icon--bold icon--button"></i>
            }
         </Button>
       </Tooltip>
      )}
      {!!onRepublish && (
        <Tooltip body="Republish" className="table-actions__tooltip-container">
          <Button className="table-actions__button" status="link"
            onClick={() => onRepublish(item)}>
            <i className="pe-7s-back-2 icon icon--bold icon--button"></i>
          </Button>
        </Tooltip>
      )}
      {
        !!onDestroy && (
          <Tooltip body="Destroy Record" className="table-actions__tooltip-container">
            <Button className='table-actions__button' status="link"
              onClick={() => onDestroy(item)}>
              <i className="pe-7s-close-circle icon icon--bold icon--button"></i>
            </Button>
          </Tooltip>
        )
      }
      {
        !!onUnlinkIncident && (
          <Tooltip body="Unlink Incident" className="table-actions__tooltip-container">
            <Button className="table-actions__button" status="link"
              onClick={() => onUnlinkIncident(item)}>
              <i className="pe-7s-link icon icon--bold icon--button"></i>
            </Button>
          </Tooltip>
        )
      }
    </div>
  );
}

export default ActionsColumn;
