import React from "react";
import PropTypes from "prop-types";
import Button from "../Button";

const DialogHeader = ({ onClose, instructionStyle, children }) => (
  <div
    className={`dialog__header ${
      instructionStyle ? "instruction-padding" : ""
    }`}
  >
    <h4
      className={`dialog__title ${
        instructionStyle ? "instruction-margin" : ""
      }`}
    >
      {children}
    </h4>
    {!!onClose && (
      <Button status="link" className="dialog__button-close" onClick={onClose}>
        <i className="pe-7s-close-circle"></i>
      </Button>
    )}
  </div>
);

DialogHeader.propTypes = {
  onClose: PropTypes.func,
};

export default DialogHeader;
