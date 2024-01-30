import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import PaperHeader from './PaperHeader';
import PaperTitle from './PaperTitle';
import PaperBody from './PaperBody';
import PaperGroup from './PaperGroup';
import PaperGroupHeader from './PaperGroupHeader';
import PaperGroupTitle from './PaperGroupTitle';
import PaperGroupBody from './PaperGroupBody';

/**
 * Paper component is box for content (Like twitter Bootstrap panel)
 * @param {object} param0 component props
 */
const Paper = ({ children, className, style }) => {
  // console.log(children,'children >>>> ',window.location.pathname.split('/')[3])
  let ifRep = window.location.pathname.split('/')[3]
  return(
  <section className={classnames('paper', className)} style={style} style={ (ifRep==='rep_imports') ?{width:'max-content'}:{width:''}}>{children}</section>
);}
Paper.Header = PaperHeader;
Paper.Title = PaperTitle;
Paper.Body = PaperBody;
Paper.Group = PaperGroup;
Paper.GroupHeader = PaperGroupHeader;
Paper.GroupTitle = PaperGroupTitle;
Paper.GroupBody = PaperGroupBody;

export default Paper;
