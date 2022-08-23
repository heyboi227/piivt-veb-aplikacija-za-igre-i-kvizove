import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import { IAnswerModel } from "../../../models/IAnswer.model";

export interface IAdminAnswerEditUrlParams
  extends Record<string, string | undefined> {
  aid: string;
}

interface IEditAnswerFormState {
  gameId: number;
  answerValue: string;
}

type TSetGameId = { type: "editAnswerForm/setGameId"; value: number };
type TSetAnswerValue = { type: "editAnswerForm/setAnswerValue"; value: string };

type EditAnswerFormAction = TSetGameId | TSetAnswerValue;

function EditAnswerFormReducer(
  oldState: IEditAnswerFormState,
  action: EditAnswerFormAction
): IEditAnswerFormState {
  switch (action.type) {
    case "editAnswerForm/setGameId": {
      return {
        ...oldState,
        // This changes:
        gameId: action.value,
      };
    }

    case "editAnswerForm/setAnswerValue": {
      return {
        ...oldState,
        // This changes:
        answerValue: action.value,
      };
    }

    default:
      return oldState;
  }
}

export default function AdminAnswerEdit() {
  const params = useParams<IAdminAnswerEditUrlParams>();
  const answerId = +(params.aid ?? "");

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [answer, setAnswer] = useState<IAnswerModel>();

  const navigate = useNavigate();

  const [formState, dispatchFormStateAction] = useReducer(
    EditAnswerFormReducer,
    {
      gameId: 1,
      answerValue: "",
    }
  );

  const loadAnswer = () => {
    api("get", "/api/answer/" + answerId, "administrator")
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error("Could not load this answer!");
        }

        return res.data;
      })
      .then((answer) => {
        setAnswer(answer);
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  const doEditAnswer = () => {
    api("put", "/api/answer/" + answerId, "administrator", formState)
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not edit this answer! Reason: " +
              res?.data
                ?.map(
                  (error: any) => error?.instancePath + " " + error?.message
                )
                .join(", ")
          );
        }

        return res.data;
      })
      .then((answer) => {
        if (!answer?.answerId) {
          throw new Error("Could not fetch the edited answer data!");
        }
      })
      .then(() => {
        navigate("/admin/dashboard/answer/list", {
          replace: true,
        });
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  useEffect(() => {
    setErrorMessage("");
    loadAnswer();
  }, [params.aid]);

  useEffect(() => {
    dispatchFormStateAction({
      type: "editAnswerForm/setGameId",
      value: answer?.gameId ?? 1,
    });
    dispatchFormStateAction({
      type: "editAnswerForm/setAnswerValue",
      value: answer?.answerValue ?? "",
    });
  }, [answer]);

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="card-answerValue">
            <h1 className="h5">Edit answer</h1>
          </div>
          <div className="card-text">
            {errorMessage && (
              <div className="alert alert-danger mb-3">{errorMessage}</div>
            )}

            <div className="row">
              <div className="col col-12 col-lg-7 mb-3 mb-lg-0">
                <h2 className="h6">Manage answer data</h2>

                <div className="form-group mb-3">
                  <label>Game ID</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      min={1}
                      max={4}
                      value={formState.gameId}
                      onChange={(e) =>
                        dispatchFormStateAction({
                          type: "editAnswerForm/setGameId",
                          value: +e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label>AnswerValue</label>
                  <div className="input-group">
                    <textarea
                      className="form-control form-control-sm"
                      rows={5}
                      value={formState.answerValue}
                      onChange={(e) =>
                        dispatchFormStateAction({
                          type: "editAnswerForm/setAnswerValue",
                          value: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-froup mb-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => doEditAnswer()}
                  >
                    Edit answer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
