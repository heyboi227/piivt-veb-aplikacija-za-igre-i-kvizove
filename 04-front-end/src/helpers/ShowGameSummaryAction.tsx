import { Button, Modal } from "react-bootstrap";

export interface IShowGameSummaryActionProperties {
    title: string;
    pointsMessage: () => string;
    onSubmit: () => void;
}

export default function ShowGameSummaryAction(props: IShowGameSummaryActionProperties) {

    return (
        <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={true}>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{props.pointsMessage()}</p>
                <p>You may now proceed to the next game.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn btn-lg btn-success" onClick={props.onSubmit}>Next game</Button>
            </Modal.Footer>
        </Modal>
    );
}