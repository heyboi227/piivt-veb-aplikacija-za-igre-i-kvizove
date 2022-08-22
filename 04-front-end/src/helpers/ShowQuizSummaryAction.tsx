import { Button, Modal } from "react-bootstrap";

export interface IShowQuizSummaryActionProperties {
    title: string;
    pointsMessage: () => string;
    onSubmit: () => void;
}

export default function ShowQuizSummaryAction(props: IShowQuizSummaryActionProperties) {

    return (
        <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={true}>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{props.pointsMessage()}</p>
                <p>Press the button to proceed to home page.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn btn-lg btn-success" onClick={props.onSubmit}>Home</Button>
            </Modal.Footer>
        </Modal>
    );
}