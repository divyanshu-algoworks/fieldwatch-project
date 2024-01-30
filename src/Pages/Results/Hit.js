import React, { Component } from 'react';
import classnames from 'classnames';
import { DragSource } from 'react-dnd';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { HIT_RESULT } from '../../constants/ItemTypes';
import {youtube_Text,instagram_Text,instagram_Image_Text} from '../../constants/Transcript'
const hitSource = {
  beginDrag(props, monitor, component) {
    return {};
  },

  canDrag(props, monitor) {
    return props.checked;
  }
};

function collectDragSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview()
  }
}

function getEditQueryUrl({ source, client_id, query_id, }) {
  const modelName = source == 'single_site_search' ? 'single_url_queries' : 'queries'
  return `/clients/${client_id}/${modelName}/${query_id}/edit`;
}

class AdditionInfo extends Component {
  render() {
    const {
      query_name,
      source,
      client_id,
      query_id,
      created_at,
      found_keywords_cnt,
      found_keywords_uniq_cnt,
      deleted_at,
      userRole
    } = this.props;

    const queryStr = query_name ? `Query: ${query_name}` : 'Query: Not Active';
    const sourceStr = source ? `Source: ${source}` : null;
    const separator = (!!queryStr && !!sourceStr) ? ' / ' : '';

    if(["client_admin", "client_specialist"].includes(userRole)){
      return null;
    }

    return (
      <div className="hit__addition-info">
        <a href={!!query_name ? getEditQueryUrl({ source, client_id, query_id, }) : '#'}
          className="hit__query-link" ref={a => this.link = a}>
          {queryStr}
        </a>
       
      {userRole!=null && !userRole.includes("client")  && <React.Fragment>
      {separator}
        {sourceStr}
        &nbsp;/ Last Appeared: {created_at}
        &nbsp;/ Keywords: {found_keywords_uniq_cnt}
        &nbsp;/ Total Matches: {found_keywords_cnt}
        {deleted_at && <span>&nbsp;/<span className="orange"> Deleted: {deleted_at}</span></span>}
        </React.Fragment> }
      </div>
    );
  }
}

class Hit extends Component {
  componentDidMount() {
    const preview = new Image();
    preview.src = this.props.dragPreviewImage;
    preview.onload = () => this.props.connectDragPreview(preview);
  };

  handleClickContainer = (e) => {
    if (e.target === this.link || e.target === this.addonInfo.link || e.target === this.img) {
      return false;
    } else {
      e.preventDefault();
    }
    this.props.onCheck(this.props.item, !this.props.checked);
  }

  handleClickImage = (e) => {
    e.preventDefault();
    this.props.onImgClick(this.props.item.image);
  }

  handleFullTextBtnClick = (e) => {
    e.stopPropagation();
    this.props.onPageTextShow(this.props.item);
  }

  handleTranscriptTextBtnClick =(e,type)=>{
    e.stopPropagation();
    this.props.onTranscriptTextShow(this.props.item,type);
  }

  render() {
    const { item, checked, connectDragSource,userRole } = this.props;

    return connectDragSource(
      <div className={classnames('hit', { 'hit--checked': !!checked })}
        ref={div => this.container = div}
        onClick={this.handleClickContainer}>
        {!!item.violation && (<div className="hit__violation-label"></div>)}
        {!!item.non_violation && (<div className="hit__non-violation-label"></div>)}
        {!!item.is_new && (
          <div className="hit__new-label"></div>
        )}
        <label className={classnames('hit__check', { 'hit__check--checked': !!checked })}>
          <Input type="checkbox" className="hit__checkbox" size="small"
            checked={!!checked} onChange={() => { }} />
        </label>
        <div className={classnames('hitsource-icon', 'hit__icon', item.url_logo)}></div>
        <div className={classnames('hit__body', { 'hit__body--with-image': !!item.image })}>
          <a href={item.url_full} target="_blank" className="hit__link ellipsis"
            ref={a => this.link = a}>
            {item.url}
          </a>
          <div className="hit__description" dangerouslySetInnerHTML={{
            __html: item.html_snippet || item.snippet || 'Preview not available.',
          }}></div>
          <span>
          {!!item.is_page_text && !item.is_youtube_transcript && (
            <Button status="link" className="d-if" onClick={this.handleFullTextBtnClick}>
               <img className="show-text-transcript"/>
            </Button>
          )}
          {!!item.is_youtube_title_description && (
            <Button status="link" className=" mr-10 d-if" onClick={(e)=>{this.handleTranscriptTextBtnClick(e,youtube_Text)}}>
               <img className="show-text-transcript"/>
            </Button>
          )}
          {!!item.is_youtube_transcript && !item.is_page_text && (
            <Button status="link" className="d-if" onClick={this.handleTranscriptTextBtnClick}>
              Show Video Transcript 
            </Button>
          )}
          {!!item.is_youtube_transcript && !!item.is_page_text && (
            <React.Fragment>
              <Button status="link" className="d-if" onClick={this.handleFullTextBtnClick}>
               <img className="show-text-transcript"/>
            </Button>
            <Button status="link" className="d-if" onClick={this.handleTranscriptTextBtnClick}>
              Show Video Transcript 
            </Button>
            </React.Fragment>
          )}
         {(!!item.is_instagram_title || !!item.is_instagram_description) && (
            <Button status="link" className=" mr-10 d-if" onClick={(e)=>{this.handleTranscriptTextBtnClick(e,instagram_Text)}}>
             <img className="show-text-transcript"/>
            </Button>
          )}
          {false && (
            <Button status="link" className="mr-10 d-if" onClick={this.handleTranscriptTextBtnClick}>
              Show <img className="show-video-transcript"/> Transcript 
            </Button>
          )}
          {false && (
            <Button status="link" className=" mr-10 d-if" onClick={(e)=>{this.handleTranscriptTextBtnClick(e,instagram_Image_Text)}}>
              Show <img className="show-image-transcript"/> Text 
            </Button>
          )}

          </span>
          <div>
            <AdditionInfo {...item} 
            userRole={userRole}
            ref={additionInfo => this.addonInfo = additionInfo} />
          </div>
        </div>
        {!!item.image && (
          <div className="hit__image-container">
            <img className="hit__image" src={item.image} onClick={this.handleClickImage}
              ref={img => this.img = img} />
          </div>
        )}
      </div>
    )
  }
}

export default DragSource(HIT_RESULT, hitSource, collectDragSource)(Hit);
