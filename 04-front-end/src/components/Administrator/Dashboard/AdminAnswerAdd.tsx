import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";

interface IAddAnswerFormState {
    gameId: number;
    answerValue: string;
};

type TSetGameId = { type: "addAnswerForm/setGameId", value: number };
type TSetAnswerValue = { type: "addAnswerForm/setAnswerValue", value: string };

type AddAnswerFormAction = TSetGameId
    | TSetAnswerValue;

function AddAnswerFormReducer(oldState: IAddAnswerFormState, action: AddAnswerFormAction): IAddAnswerFormState {
    switch (action.type) {
        case "addAnswerForm/setGameId": {
            return {
                ...oldState,
                // This changes:
                gameId: action.value,
            }
        }

        case "addAnswerForm/setAnswerValue": {
            return {
                ...oldState,
                // This changes:
                answerValue: action.value,
            }
        }

        default: return oldState;
    }
}

export default function AdminAnswerAdd() {

    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate();

    const [formState, dispatchFormStateAction] = useReducer(AddAnswerFormReducer, {
        gameId: 1,
        answerValue: "",
    });

    const doAddAnswer = () => {
        api("post", "/api/answer", "administrator", formState)
            .then(res => {
                if (res.status !== "ok") {
                    throw new Error("Could not add this item! Reason: " + res?.data?.map((error: any) => error?.instancePath + " " + error?.message).join(", "));
                }

                return res.data;
            })
            .then(answer => {
                if (!answer?.answerId) {
                    throw new Error("Could not fetch new answer data!");
                }

                return answer;
            })
            .then(() => {
                navigate("/admin/dashboard/answer/list", {
                    replace: true,
                });
            })
            .catch(error => {
                setErrorMessage(error?.message ?? "Unknown error!");
            });
    };

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <div className="card-answerValue">
                        <h1 className="h5">Add new answer</h1>
                    </div>
                    <div className="card-text">
                        {errorMessage && <div className="alert alert-danger mb-3">{errorMessage}</div>}

                        <div className="form-group mb-3">
                            <label>Game ID</label>
                            <div className="input-group">
                                <input type="number" min={1} max={4} className="form-control form-control-sm"
                                    value={formState.gameId}
                                    onChange={e => dispatchFormStateAction({ type: "addAnswerForm/setGameId", value: +e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label>Answer value</label>
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm"
                                    value={formState.answerValue}
                                    placeholder="Enter the answer value"
                                    onChange={e => dispatchFormStateAction({ type: "addAnswerForm/setAnswerValue", value: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <button className="btn btn-primary" onClick={() => doAddAnswer()}>
                                Add answer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
