import React from "react";
import { Modal as BoostrapModal } from "../components/Modal";


export const Modal = ({open, handleClose, onExit, title, children, footer}) => {
  handleClose = handleClose || (() => {})
  onExit = onExit || (() => {})

  return <BoostrapModal show={open} onHide={handleClose} animation 
    onExited={onExit}
    onExit={() => setSelection(null)}
  >
    <BoostrapModal.Header closeButton>
      <BoostrapModal.Title>{title}</BoostrapModal.Title>
    </BoostrapModal.Header>
    <BoostrapModal.Body>
      {children}
    </BoostrapModal.Body>
    <BoostrapModal.Footer>
      {footer}
    </BoostrapModal.Footer>
  </BoostrapModal>
}
