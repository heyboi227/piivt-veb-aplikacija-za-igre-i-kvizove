import { Button, Modal } from "react-bootstrap";

export interface IReportWrongQuestionActionProperties {
  title: string;
  incorrectMessageReason: string;
  setIncorrectMessageReason: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ReportWrongQuestionAction(
  props: IReportWrongQuestionActionProperties
) {
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={true}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group mb-3">
          <div className="input-group">
            <textarea
              className="form-control"
              placeholder="State the reason why is the question wrong here"
              value={props.incorrectMessageReason}
              onChange={(e) => props.setIncorrectMessageReason(e.target.value)}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-lg btn-success" onClick={props.onSubmit}>
          Submit
        </Button>
        <Button className="btn btn-lg btn-danger" onClick={props.onCancel}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
