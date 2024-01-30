import React, { Component } from 'react';
import Dialog from '../../components/Dialog';
import Preloader from '../../components/Preloader';

export default class PageTextDialog extends Component {
  state = {
    isOpen: false,
    link: '',
    text: '',
  }

  open = () => this.setState({ isOpen: true });
  change = (link, text) => this.setState({ link, text });
  close = () => this.setState({ isOpen: false, link: '', text: '' });

  render() {
    return (
      <Dialog isOpen={this.state.isOpen} onClose={this.close}>
        <Dialog.Header onClose={this.close}>
          <div className="d-f">
            <div>
              Extracted page text from
            </div>
            &nbsp;
            <a
              target="_blank"
              className="d-ib ellipsis"
              style={{ maxWidth: '300px' }}
              href={this.state.link}
            >
              {this.state.link}
            </a>
          </div>
        </Dialog.Header>
        <Dialog.Body>
          {!!this.props.submitted && (<Preloader className="results__loader" />)}
          <div dangerouslySetInnerHTML={{ __html: this.state.text }}></div>
        </Dialog.Body>
      </Dialog>
    );
  }
}
