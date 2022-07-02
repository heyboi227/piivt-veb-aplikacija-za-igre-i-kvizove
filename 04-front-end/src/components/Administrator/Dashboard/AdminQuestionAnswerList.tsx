import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import './AdminQuestionAnswerList.sass';
import IQuestion from '../../../models/IQuestion.model';
import IQuestionAnswer from "../../../models/IQuestionAnswer.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faSquareCheck } from "@fortawesome/free-regular-svg-icons";

interface IAdminQuestionAnswerListRowProperties {
    questionAnswer: IQuestionAnswer,
}

export interface IAdminQuestionAnswerListUrlParams extends Record<string, string | undefined> {
    qid: string;
}

export default function AdminQuestionAnswerList() {
    const params = useParams<IAdminQuestionAnswerListUrlParams>();

    const [question, setQuestion] = useState<IQuestion>();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showAddNewAnswer, setShowAddNewAnswer] = useState<boolean>(false);

    useEffect(() => {
        loadQuestionData(+(params.qid ?? 0));
    }, [params.qid]);

    function loadQuestionData(questionId: number) {
        if (!questionId) {
            return;
        }

        api("get", "/api/question/" + questionId, "administrator")
            .then(res => {
                if (res.status === "error") {
                    return setErrorMessage(res.data + "");
                }

                setQuestion(res.data);

                setShowAddNewAnswer(false);
            })
    }

    function AdminAnswerListRow(props: IAdminQuestionAnswerListRowProperties) {
        const [answerValue, setAnswerValue] = useState<string>(props.questionAnswer.answer.answerValue);
        const [deleteRequested, setDeleteRequested] = useState<boolean>(false);

        const correctSideClass = props.questionAnswer.isCorrect ? " btn-primary" : " btn-light";
        const incorrectSideClass = !props.questionAnswer.isCorrect ? " btn-primary" : " btn-light";

        const answerValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setAnswerValue(e.target.value);
        }

        const doEditAnswer = (e: any) => {
            api("put", "/api/answer/" + props.questionAnswer.answer.answerId, "administrator", { answerValue })
                .then(res => {
                    if (res.status === 'error') {
                        return setErrorMessage("Could not edit this answer!");
                    }

                    loadQuestionData(+(params.qid ?? 0));
                })
        }

        const doDeleteAnswer = (e: any) => {
            api("delete", "/api/answer/" + props.questionAnswer.answer.answerId, "administrator")
                .then(res => {
                    if (res.status === "error") {
                        return setErrorMessage("Could not delete this answer!");
                    }

                    loadQuestionData(+(params.qid ?? 0));
                })
        }

        return (
            <tr>
                <td>{props.questionAnswer.answer.answerId}</td>
                <td>
                    <div className="input-group">
                        <input className="form-control form-control-sm"
                            type="text"
                            onChange={e => answerValueChanged(e)}
                            value={answerValue} />
                        {props.questionAnswer.answer.answerValue !== answerValue
                            ? <button className="btn btn-primary btn-sm" onClick={e => doEditAnswer(e)}>
                                Save
                            </button>
                            : ''
                        }
                    </div>
                </td>
                <td>
                    <div className="btn-group">
                        <div className={"btn btn-sm" + correctSideClass}>
                            <FontAwesomeIcon icon={faSquareCheck} />
                        </div>
                        <div className={"btn btn-sm" + incorrectSideClass}>
                            <FontAwesomeIcon icon={faSquare} />
                        </div>
                    </div>
                </td>
                <td>
                    <button className="btn btn-danger btn-sm" onClick={e => doDeleteAnswer(e)}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    }

    function AdminAnswerAddRow() {
        const [answerValue, setAnswerValue] = useState<string>("");

        const answerValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setAnswerValue(e.target.value);
        }

        const doAddAnswer = (e: any) => {
            api("post", "/api/answer", "administrator", { answerValue })
                .then(res => {
                    if (res.status === 'error') {
                        return setErrorMessage("Could not add this answer!");
                    }

                    loadQuestionData(+(params.qid ?? 0));

                    setAnswerValue("");
                    setShowAddNewAnswer(false);
                });
        }

        return (
            <tr>
                <td> </td>
                <td>
                    <div className="input-group">
                        <input className="form-control form-control-sm"
                            type="text"
                            onChange={e => answerValueChanged(e)}
                            value={answerValue} />
                    </div>
                </td>
                <td>
                    {answerValue.trim().length >= 4 && answerValue.trim().length <= 32
                        ? <button className="btn btn-primary btn-sm" onClick={e => doAddAnswer(e)}>
                            Save
                        </button>
                        : ''
                    }
                    <button className="btn btn-danger btn-sm" onClick={() => {
                        setShowAddNewAnswer(false);
                        setAnswerValue("");
                    }}>
                        Cancel
                    </button>
                </td>
            </tr>
        );
    }

    function renderAnswerTable(question: IQuestion) {
        return (
            <div>
                <div className="btn-group">
                    <Link className="btn btn-secondary btn-sm" to="/admin/dashboard/question/list">
                        &laquo; Back to question &quot;{question.title}&quot;
                    </Link>
                    <button className="btn btn-primary btn-sm" onClick={() => { setShowAddNewAnswer(true) }}>Add new answer</button>
                </div>

                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Answer value</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showAddNewAnswer && <AdminAnswerAddRow />}

                        {question.answers?.map(answer => <AdminAnswerListRow key={"answer-" + answer.answer.answerId} questionAnswer={answer} />)}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div>
            {errorMessage && <p className="alert alert-danger mb-3">{errorMessage}</p>}
            {question && renderAnswerTable(question)}
        </div>
    );
}
