import React, { Component } from 'react';
import Dialog from '../../components/Dialog';
import Preloader from '../../components/Preloader';
import {youtube_Text,instagram_Text,instagram_Image_Text} from '../../constants/Transcript'
export default class TranscriptDialog extends Component {
    state = {
        type: null,
        isOpen: false,
        link: '',
        text: '',
        title: '',
        description: '',
        transcript: ''
    }

    open = () => this.setState({ isOpen: true });
    change = (link, hit, type) => {
      //  console.log(type,"typeChange");
        if (!!type) {
            this.setState({
                link, hit, type, title: hit.bolded_youtube_transcript_title,
                description: hit.bolded_youtube_transcript_description, text: hit.bolded_page_text
            });
        }
        if (!type) {
            this.setState({
                transcript: hit.bolded_youtube_transcript_transcript,type
            });
        }
        if(!!type && type==instagram_Text){
            this.setState({
                link, hit, type,
                transcript:hit.bolded_instagram_description
            });
        }
    }
    close = () => this.setState({
        isOpen: false, link: '',
        text: '',
        title: '',
        description: '',
        transcript: ''
    });

    render() {
     //   console.log(this.state,"type41");
        return (
            <Dialog isOpen={this.state.isOpen} onClose={this.close}>
                <Dialog.Header onClose={this.close}>
                    {!this.state.type && <div className="d-f">
                        <div>
                            Extracted Transcript
            </div>
                        &nbsp;
          </div>}
          {!!this.state.type && this.state.type==instagram_Image_Text && <div className="d-f">
                        <div>
                            Image Text
            </div>
                    </div>}
                    {!!this.state.type && this.state.type!=instagram_Image_Text &&<div className="d-f">
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
                    </div>}
                </Dialog.Header>
                <Dialog.Body>
                    {!!this.props.submitted && (<Preloader className="results__loader" />)}
                    {
                        this.state.transcript &&
                        <React.Fragment>
                            <div dangerouslySetInnerHTML={{ __html: this.state.transcript }}></div>
                            
                        </React.Fragment>
                    }
                    {this.state.title &&
                        <span><p style={{ "margin": "0px" }}><b>Title:</b></p>
                            <div dangerouslySetInnerHTML={{ __html: this.state.title }}></div>
                        </span>
                    }
                    <br />{
                        this.state.description &&
                        <React.Fragment>
                            <p style={{ "margin": "0px" }} ><b>Description:</b></p>
                            <div dangerouslySetInnerHTML={{ __html: this.state.description }}></div>
                        </React.Fragment>
                    }
                    <br />
                    {
                        this.state.text &&
                        <React.Fragment>
                            <p style={{ "margin": "0px" }}><b>Page Text:</b></p>
                            <div dangerouslySetInnerHTML={{ __html: this.state.text }}></div>
                        </React.Fragment>
                    }
                </Dialog.Body>
            </Dialog>
        );
    }
}
