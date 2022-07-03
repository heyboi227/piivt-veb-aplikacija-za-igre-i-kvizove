/* eslint-disable no-throw-literal */
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import './AdminQuestionAnswerList.sass';
import IQuestion from '../../../models/IQuestion.model';
import IQuestionAnswer from "../../../models/IQuestionAnswer.model";

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
    const [showAddNewQuestionAnswer, setShowAddNewQuestionAnswer] = useState<boolean>(false);

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

                setShowAddNewQuestionAnswer(false);
            })
    }

    function AdminQuestionAnswerListRow(props: IAdminQuestionAnswerListRowProperties) {
        const [answerValue] = useState<string>(props.questionAnswer.answer.answerValue);
        const [deleteRequested, setDeleteRequested] = useState<boolean>(false);

        const correctSideClass = props.questionAnswer.isCorrect ? " btn-primary" : " btn-light";
        const incorrectSideClass = !props.questionAnswer.isCorrect ? " btn-primary" : " btn-light";

        function doToggleQuestionAnswerCorrectState() {
            api("put", "/api/question/" + params.qid + "/answer/" + props.questionAnswer.answer.answerId, "administrator", {
                isCorrect: !props.questionAnswer.isCorrect,
            })
                .then(res => {
                    if (res.status === "error") {
                        return setErrorMessage(res.data + "");
                    }

                    loadQuestionData(+(params.qid ?? 0));
                })
        }

        const doDeleteQuestionAnswer = (e: any) => {
            api("delete", "/api/question/" + params.qid + "/answer/" + props.questionAnswer.answer.answerId, "administrator")
                .then(res => {
                    if (res.status === "error") {
                        return setErrorMessage("Could not delete this answer from current question!");
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
                            readOnly={true}
                            value={answerValue} />
                    </div>
                </td>
                <td>
                    <div className="btn-group" onClick={() => doToggleQuestionAnswerCorrectState()}>
                        <div className={"btn btn-sm" + correctSideClass}>
                            Correct
                        </div>
                        <div className={"btn btn-sm" + incorrectSideClass}>
                            Incorrect
                        </div>
                    </div>
                </td>
                <td>
                    <button className="btn btn-danger btn-sm" onClick={e => doDeleteQuestionAnswer(e)}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    }

    function AdminQuestionAnswerAddRow() {
        const [answerValue, setAnswerValue] = useState<string>("");

        const answerValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setAnswerValue(e.target.value);
        }

        const doAddQuestionAnswer = (e: any) => {
            console.log(answerValue);

            api("get", "/api/answer/answer-value/" + answerValue, "administrator")
                .then(res => {
                    if (res.status === 'error') {
                        throw {
                            message: "The answer does not exist! Reason: " + res.data
                        }
                    }

                    return res.data.answerId as number;
                })
                .then(answerId => {
                    console.log(answerId);
                    api("post", "/api/question/" + params.qid + "/answer", "administrator", { answerId })
                        .then(res => {
                            if (res.status === 'error') {
                                throw {
                                    message: "Could not add this answer for current question! Reason: " + res.data
                                }
                            }

                            loadQuestionData(+(params.qid ?? 0));

                            setAnswerValue("");
                            setShowAddNewQuestionAnswer(false);
                        })
                        .catch(error => {
                            setErrorMessage(error?.message ?? "Could not add this answer for current question!");

                            setTimeout(() => {
                                setErrorMessage("");
                            }, 3500);
                        });
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
                    {answerValue.trim().length >= 2 && answerValue.trim().length <= 128
                        ? <button className="btn btn-primary btn-sm" onClick={e => doAddQuestionAnswer(e)}>
                            Save
                        </button>
                        : ''
                    }
                    <button className="btn btn-danger btn-sm" onClick={() => {
                        setShowAddNewQuestionAnswer(false);
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
                    <button className="btn btn-primary btn-sm" onClick={() => { setShowAddNewQuestionAnswer(true) }}>Add new answer</button>
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
                        {showAddNewQuestionAnswer && <AdminQuestionAnswerAddRow />}

                        {question.answers?.map(answer => <AdminQuestionAnswerListRow key={"answer-" + answer.answer.answerId} questionAnswer={answer} />)}
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
