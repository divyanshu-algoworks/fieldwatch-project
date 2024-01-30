import React, { Component } from 'react';
import MagnifierOverlay from './MagnifierOverlay';
import { autobind } from 'core-decorators';
import { MAX_SIZE } from '../../constants/Magnifier';

export default class Magnifier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      zoom: 0,
      marginTop: 0,
      marginLeft: 0
    };
  }

  componentDidMount() {
    const { naturalHeight, naturalWidth } = this.img;
      const isPortret = naturalHeight > naturalWidth;
      const zoom = MAX_SIZE / (isPortret ? naturalHeight : naturalWidth);
      this.setState({ zoom, height: naturalHeight * zoom, width: naturalWidth * zoom });
  }

  @autobind handleMouseEnter() {
    const { zoom } = this.state;
    if (zoom === 1) {
      return;
    }
    this.img.classList.remove('magnifier__img--thumbnail');
  }

  @autobind handleMouseLeave() {
    const { zoom } = this.state;
    if (zoom === 1) {
      return;
    }
    this.setState({ marginLeft: '0px', marginTop: '0px' });
    this.img.classList.add('magnifier__img--thumbnail');
  }

  @autobind handleMouseMove({ clientX, clientY }) {
    const { zoom } = this.state;
    if (zoom === 1) {
      return;
    }
    const { left, top, height, width } = this.container.getBoundingClientRect();
    this.setState({
      marginLeft: `${(left - clientX) / (zoom)}px`,
      marginTop: `${(top - clientY) / (zoom)}px`,
      height:height,
      width:width
    });
  }

  render() {
    const { src, onClose } = this.props;
    const { height, width, marginLeft, marginTop } = this.state;
    return (
      <MagnifierOverlay isOpen={!!src} onClose={onClose}>
        <div className="magnifier" style={{ width: `70vw`, height: `100vh`,"overflow":"scroll" }}
         ref={div => this.container = div}>
          <img src={src}
            style={{ marginLeft, marginTop,"min-width":"100%","min-height":"100%" }}
            ref={(img => this.img = img)} />
        </div>
      </MagnifierOverlay>
    );
  }
}
