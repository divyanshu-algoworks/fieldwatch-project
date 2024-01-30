import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import ReactQuill, { Quill } from "react-quill";
import { DEFAULT_CONFIG, SIGNATURE_CONFIG } from "Constants/TextEditorSettings";
import cleanPastedHTML from "Helpers/cleanPastedHTML";
import API from "Helpers/api";
import QuillMention from "quill-mention";

var Block = Quill.import("blots/block");
Block.tagName = "DIV";
Quill.register(Block, true);
Quill.register("modules/mentions", QuillMention);
/**
 * TextEditor is wrapper for ReactQuill text editor.
 */
export default class TextEditor extends Component {
  static propTypes = {
    /** editor toolbar configuration */
    config: PropTypes.object,
    /** is component disabled */
    disabled: PropTypes.bool,
    /* Url for check data on tags existing */
    xssProtectionUrl: PropTypes.string,
  };

  static defaultProps = {
    config: DEFAULT_CONFIG,
    disabled: false,
  };

  constructor(props) {
    super(props);

    const { userList } = props;

    this.state = {
      mentionModule: {
        allowedChars: /^[A-Za-z\s]*$/,
        mentionDenotationChars: ["@"],
        source: function (searchTerm, renderList) {
          if (searchTerm.length === 0) {
            renderList(userList, searchTerm);
          } else {
            const matches = [];
            for (let i = 0; i < userList.length; i++) {
              if (
                ~userList[i].value
                  .toLowerCase()
                  .indexOf(searchTerm.toLowerCase())
              ) {
                matches.push(userList[i]);
              }
            }
            renderList(matches, searchTerm);
          }
        },
      },
    };
  }

  handleInsert = (val, insert) => {
    const body = cleanPastedHTML(val);
    console.log('body', body);
    const { onChange, xssProtectionUrl } = this.props;
    API.post(xssProtectionUrl, {
      body: {
        body,
      },
    }).then(({ data }) => {
      console.log('onChangeData', data);
      onChange(data);
    });
  };

  handleChange = (val, { ops }) => {
    const insert = !!ops[1] && !!ops[1].insert ? ops[1].insert : ops[0].insert;
    if (!!insert && insert.length > 1 && !!this.props.xssProtectionUrl) {
      this.handleInsert(val, insert);
      return;
    }
    if (!this.editor) {
      this.props.onChange(val);
      return;
    }
    const editorText = this.editor.editor.getText();
    if (editorText === "\n" || !editorText.length) {
      this.props.onChange("");
    } else {
      this.props.onChange(val);
    }
  };

  handleChangeMentions = (val) => {
    this.props.onChange(val);
  };

  render() {
    const {
      value,
      config,
      disabled,
      invalid,
      signature,
      withMentions,
      editorHeight,
    } = this.props;
    if (withMentions) {
      return (
        <ReactQuill
          {...config}
          className={classnames(
            "fw-text-editor",
            { "fw-text-editor--invalid": invalid },
            "notranslate"
          )}
          onChange={this.handleChangeMentions}
          modules={{
            mention: this.state.mentionModule,
          }}
          value={value}
        />
      );
    }

    return (
      <React.Fragment>
        {!signature && (
          <ReactQuill
            value={value}
            {...config}
            readOnly={disabled}
            preserveWhitespace={false}
            className={classnames(
              "fw-text-editor",
              { "fw-text-editor--invalid": invalid },
              "notranslate",
              editorHeight && "ql-height"
            )}
            style={{}}
            onChange={this.handleChange}
            ref={(editor) => {
              if (!this.editor && !!editor) {
                this.editor = editor;
              }
            }}
          />
        )}
        {!!signature && (
          <ReactQuill
            value={value}
            {...SIGNATURE_CONFIG}
            readOnly={disabled}
            className={classnames(
              "fw-text-editor",
              {
                "fw-text-editor--invalid": invalid,
              },
              "notranslate"
            )}
            onChange={this.handleChange}
            ref={(editor) => {
              if (!this.editor && !!editor) {
                this.editor = editor;
              }
            }}
          />
        )}
      </React.Fragment>
    );
  }
}
