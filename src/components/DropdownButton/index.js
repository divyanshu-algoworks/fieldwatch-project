import React, { Component } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import classnames from "classnames";
import Button from "Components/Button";

/**
 * DropdownButton used mostly for insert merge fields.
 */
export default class DropdownButton extends Component {
  static propTypes = {
    listAlign: PropTypes.oneOf(["left", "right"]),
    options: PropTypes.arrayOf(
      PropTypes.shape({
        /** options value */
        id: PropTypes.any,
        /** Name of option, that will be displayed in options list */
        name: PropTypes.string.isRequired,
      })
    ),
    /** select option handler, which get option id as value */
    onOptionSelect: PropTypes.func,
    /** trigger button text */
    children: PropTypes.any,
  };

  static defaultProps = {
    optionComponent: ({ id, name, onOptionSelect }) => (
      <li
        className="dropdown-button__list-item"
        onClick={() => onOptionSelect(id)}
        key={id}
      >
        {name}
      </li>
    ),
    listAlign: "left",
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  handleOpen() {
    this.setState({ isOpen: true, overflow: false });
    document.addEventListener("click", this.handleClose);
  }

  handleClose() {
    this.setState({ isOpen: false, overflow: false });
    document.removeEventListener("click", this.handleClose);
  }

  handleOptionSelect(optionId) {
    const { onOptionSelect } = this.props;
    onOptionSelect(optionId);
  }

  get triggerPosition() {
    if (!this.trigger) {
      return;
    }

    const rect = this.trigger.getBoundingClientRect();
    const { left, height } = rect;
    const top = window.scrollY + rect.top + height;
    if (this.props.listAlign === "left") {
      return { left, top };
    }
    const right = window.innerWidth - rect.right;
    return { top, right };
  }
  componentDidUpdate() {
    if (
      !!document.querySelector(".dropdown-button__list") &&
      !this.state.overflow
    ) {
      const { top, height, left } = document
        .querySelector(".dropdown-button__list")
        .getBoundingClientRect();
      if (top + height > window.innerHeight) {
        let newTop = top - (top + height - window.innerHeight);
        this.setState({ overflow: true, top: newTop, left: left });
      }
    }
  }

  render() {
    const {
      options,
      onOptionSelect,
      children,
      className,
      optionComponent,
      listAlign,
      ...buttonProps
    } = this.props;
    const { isOpen, overflow, top, left } = this.state;

    return (
      <React.Fragment>
        <select
          style={{
            maxWidth: `${
              children.length > 5 ? children.length + 0.5 : children.length + 2
            }rem`,
            fontSize: "12px",
            outline: "none",
            padding: "0.25rem",
            background: "#464547",
            color: "white",
            textAlign: "left",
            fontWeight: "bold",
          }}
          id="mySelect"
          onChange={(event) => {
            onOptionSelect(event.target.value);

            for (let i of document.querySelectorAll("#mySelect")) {
              i.value = "";
            }
          }}
        >
          <option value="" selected disabled hidden>
            {children}
          </option>
          {options.map((item, i) => {
            let el = optionComponent({ ...this.props, ...item });

            return children === "Subject" &&
              item.id === "training_module_link" ? null : (
              <option
                value={el.key}
                key={i}
                style={{ background: "white", color: "#464547" }}
              >
                {el.props.children}
              </option>
            );
          })}
        </select>

        {/* <div className="dropdown-button">


        <Button ref={(btn) => { if (!!btn) { this.trigger = btn.dom } }}
          {...buttonProps} className={classnames(className, 'button--dropdown')} onClick={this.handleOpen}>
          {children}
        </Button>
       
        {isOpen && createPortal((
          <ul className="dropdown-button__list"
          ref={(el)=>{if (!!el) { this.list = el}}}
           style={overflow?{top,left}:this.triggerPosition}>
            {options.map((item) => optionComponent({...this.props, ...item,}))}
          </ul>
        ), document.getElementById('portal-container'))}
      </div> */}
      </React.Fragment>
    );
  }
}
