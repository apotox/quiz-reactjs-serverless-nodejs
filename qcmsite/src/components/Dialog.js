import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";


import { useDispatch, useSelector } from "react-redux";
import { CLOSE_DIALOG } from "../actions/dialog.actions";

function Dialog() {
  const { show, content, actions,className ,title,noCancel} = useSelector(
    (state) => state.dialogReducer
  );
  const dispatch = useDispatch();
  const close = () => {
    dispatch(CLOSE_DIALOG());
  };
  return (
    <Modal isOpen={show} toggle={close} className="custom-modal">
      <ModalHeader toggle={close}  className={className}>{title}</ModalHeader>
      <ModalBody>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </ModalBody>
      <ModalFooter>
        
        {!noCancel && <Button color="#ccc" size="sm" onClick={close}>
          Annuler
        </Button>}

        {actions.map((act,index) => (
          <Button color="success" size="sm" key={`btn-${index}`} color="primary" onClick={()=>{
            act.fn()
            close()
          }}>
            {act.label}
          </Button>
        ))}


      </ModalFooter>
    </Modal>
  );
}

export default Dialog;
