import { Button, Modal } from "react-bootstrap";

export interface IShowFirstGameSummaryActionProperties {
    title: string;
    givenWord: string;
    targetWord: string;
    pointsMessage: () => string;
    onSubmit: () => void;
}

export default function ShowFirstGameSummaryAction(props: IShowFirstGameSummaryActionProperties) {

    return (
        <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={true}>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>The word you have entered was: {props.givenWord}</p>
                <p>The target word was: {props.targetWord}</p>
                <p>{props.pointsMessage()}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn btn-lg btn-success" onClick={props.onSubmit}>Next game</Button>
            </Modal.Footer>
        </Modal>
    );
}