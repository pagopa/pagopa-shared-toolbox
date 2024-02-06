import React from "react";
import { Modal, Button } from 'react-bootstrap';

interface IProps {
    show: boolean;
    handleClose: Function;
    children?: React.ReactNode;
}

interface IState {}

export default class ConfirmationModal extends React.Component<IProps, IState> {

    render(): React.ReactNode {
        return (
            <Modal show={this.props.show} onHide={() => this.props.handleClose("ko")}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.children}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.props.handleClose("ko")}>
                        Dismiss
                    </Button>
                    <Button variant="primary" onClick={() => this.props.handleClose("ok")}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
