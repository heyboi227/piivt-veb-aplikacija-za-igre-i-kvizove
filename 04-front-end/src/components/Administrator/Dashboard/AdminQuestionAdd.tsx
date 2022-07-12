import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import { IAnswerModel } from "../../../models/IAnswer.model";

interface IAddQuestionFormState {
    gameId: number;
    title: string;
    answers: {
        answerId: number;
        isCorrect: boolean;
    }[];
};

type TSetGameId = { type: "addQuestionForm/setGameId", value: number };
type TSetTitle = { type: "addQuestionForm/setTitle", value: string };
type TAddAnswer = { type: "addQuestionForm/addAnswer", value: number };
type TRemoveAnswer = { type: "addQuestionForm/removeAnswer", value: number };
type TSetAnswerIsCorrect = { type: "addQuestionForm/setAnswerIsCorrect", value: { answerId: number, isCorrect: boolean } };

type AddQuestionFormAction = TSetGameId
    | TSetTitle
    | TAddAnswer
    | TRemoveAnswer
    | TSetAnswerIsCorrect;

function AddQuestionFormReducer(oldState: IAddQuestionFormState, action: AddQuestionFormAction): IAddQuestionFormState {
    switch (action.type) {
        case "addQuestionForm/setGameId": {
            return {
                ...oldState,
                answers: [...oldState.answers.map(answer => { return { ...answer } })],
                // This changes:
                gameId: action.value,
            }
        }

        case "addQuestionForm/setTitle": {
            return {
                ...oldState,
                answers: [...oldState.answers.map(answer => { return { ...answer } })],
                // This changes:
                title: action.value,
            }
        }

        case "addQuestionForm/addAnswer": {
            if (oldState.answers.find(answer => answer.answerId === action.value)) {
                return oldState;
            }

            return {
                ...oldState,
                // This changes:
                answers: [...oldState.answers.map(answer => { return { ...answer } }), { answerId: action.value, isCorrect: true }],
            }
        }

        case "addQuestionForm/removeAnswer": {
            if (!oldState.answers.find(answer => answer.answerId === action.value)) {
                return oldState;
            }

            return {
                ...oldState,
                // This changes:
                answers: [...oldState.answers.map(answer => { return { ...answer } }).filter(answer => answer.answerId !== action.value)],
            }
        }

        case "addQuestionForm/setAnswerIsCorrect": {
            if (!oldState.answers.find(answer => answer.answerId === action.value.answerId)) {
                return oldState;
            }

            return {
                ...oldState,
                // This changes:
                answers: [...oldState.answers.map(answer => {
                    if (action.value.answerId !== answer.answerId) {
                        return { ...answer }
                    }

                    return {
                        ...answer,
                        isCorrect: action.value.isCorrect
                    }
                })],
            }
        }

        default: return oldState;
    }
}

export default function AdminQuestionAdd() {

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [answers, setAnswers] = useState<IAnswerModel[]>([]);

    const navigate = useNavigate();

    const [formState, dispatchFormStateAction] = useReducer(AddQuestionFormReducer, {
        gameId: 1,
        title: "",
        answers: [],
    });

    const doAddQuestion = () => {
        api("post", "/api/question", "administrator", formState)
            .then(res => {
                if (res.status !== "ok") {
                    throw new Error("Could not add this item! Reason: " + res?.data?.map((error: any) => error?.instancePath + " " + error?.message).join(", "));
                }

                return res.data;
            })
            .then(question => {
                if (!question?.questionId) {
                    throw new Error("Could not fetch new question data!");
                }

                return question;
            })
            .then(() => {
                navigate("/admin/dashboard/question/list", {
                    replace: true,
                });
            })
            .catch(error => {
                setErrorMessage(error?.message ?? "Unknown error!");
            });
    };

    useEffect(() => {
        api("get", "/api/answer/game/" + formState.gameId, "administrator")
            .then(res => {
                if (res.status !== "ok") {
                    throw new Error("Could not load answer information!");
                }

                return res.data;
            })
            .then(answers => {
                setAnswers(answers);
            })
            .catch(error => {
                setErrorMessage(error?.message ?? "Unknown error!");
            });
    }, [formState.gameId]);

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <div className="card-title">
                        <h1 className="h5">Add new question</h1>
                    </div>
                    <div className="card-text">
                        {errorMessage && <div className="alert alert-danger mb-3">{errorMessage}</div>}

                        <div className="form-group mb-3">
                            <label>Game ID</label>
                            <div className="input-group">
                                <input type="number" min={1} max={4} className="form-control form-control-sm"
                                    value={formState.gameId}
                                    onChange={e => dispatchFormStateAction({ type: "addQuestionForm/setGameId", value: +e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label>Title</label>
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm"
                                    value={formState.title}
                                    placeholder="Enter the question title"
                                    onChange={e => dispatchFormStateAction({ type: "addQuestionForm/setTitle", value: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label>Answers</label>

                            {answers?.map(answer => {
                                const answerData = formState.answers.find(s => s.answerId === answer.answerId);

                                return (
                                    <div className="row" key={"answer-" + answer.answerId}>
                                        <div className="col col-3">
                                            {
                                                answerData
                                                    ? <FontAwesomeIcon onClick={() => dispatchFormStateAction({ type: "addQuestionForm/removeAnswer", value: answer.answerId })} icon={faCheckSquare} />
                                                    : <FontAwesomeIcon onClick={() => dispatchFormStateAction({ type: "addQuestionForm/addAnswer", value: answer.answerId })} icon={faSquare} />
                                            } {answer.answerValue}
                                        </div>

                                        {
                                            answerData && (
                                                <>
                                                    <div className="col col-2">
                                                        <div className="input-group input-group-sm">
                                                            <select onChange={e => dispatchFormStateAction({ type: "addQuestionForm/setAnswerIsCorrect", value: { answerId: answer.answerId, isCorrect: e.target.value === "correct" ? true : false } })} defaultValue={"default"}>
                                                                <option value={"default"}>Choose if answer is correct:</option>
                                                                <option value={"correct"}>Correct</option>
                                                                <option value={"incorrect"}>Incorrect</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                );
                            })}
                        </div>

                        <div className="form-group mb-3">
                            <button className="btn btn-primary" onClick={() => doAddQuestion()}>
                                Add question
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
