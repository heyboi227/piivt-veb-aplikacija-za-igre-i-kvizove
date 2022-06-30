import React, { useEffect, useState } from "react";
import { api } from "../../../api/api";
import IAnswer from "../../../models/IAnswer.model";
import './AdminAnswerList.sass';

interface IAdminAnswerListRowProperties {
    answer: IAnswer,
}

export default function AdminAnswerList() {
    const [answers, setAnswers] = useState<IAnswer[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showAddNewAnswer, setShowAddNewAnswer] = useState<boolean>(false);

    function AdminAnswerListRow(props: IAdminAnswerListRowProperties) {
        const [answerValue, setAnswerValue] = useState<string>(props.answer.answerValue);

        const answerValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setAnswerValue(e.target.value);
        }

        const doEditAnswer = (e: any) => {
            api("put", "/api/answer/" + props.answer.answerId, "administrator", { answerValue })
                .then(res => {
                    if (res.status === 'error') {
                        return setErrorMessage("Could not edit this answer!");
                    }

                    loadAnswers();
                })
        }

        return (
            <tr>
                <td>{props.answer.answerId}</td>
                <td>
                    <div className="input-group">
                        <input className="form-control form-control-sm"
                            type="text"
                            onChange={e => answerValueChanged(e)}
                            value={answerValue} />
                        {props.answer.answerValue !== answerValue
                            ? <button className="btn btn-primary btn-sm" onClick={e => doEditAnswer(e)}>
                                Save
                            </button>
                            : ''
                        }
                    </div>
                </td>
                <td>

                </td>
            </tr>
        );
    }

    function AdminAnswerListAddRow() {
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

                    loadAnswers();

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
                        {answerValue.trim().length >= 4 && answerValue.trim().length <= 32
                            ? <button className="btn btn-primary btn-sm" onClick={e => doAddAnswer(e)}>
                                Save
                            </button>
                            : ''
                        }
                    </div>
                </td>
                <td>
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

    const loadAnswers = () => {
        api("get", "/api/answer", "administrator")
            .then(apiResponse => {
                if (apiResponse.status === 'ok') {
                    return setAnswers(apiResponse.data);
                }

                throw new Error('Unknown error while loading answers...');
            })
            .catch(error => {
                setErrorMessage(error?.message ?? 'Unknown error while loading answers...');
            });
    }

    useEffect(() => {
        loadAnswers();
    }, []);

    return (
        <div>
            {errorMessage && <p>Error: {errorMessage}</p>}
            {!errorMessage &&
                <div>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddNewAnswer(true)}>Add new answer</button>

                    <table className="table table-bordered table-striped table-hover table-sm mt-3">
                        <thead>
                            <tr>
                                <th className="answer-row-id">ID</th>
                                <th>Answer value</th>
                                <th className="answer-row-options">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showAddNewAnswer && <AdminAnswerListAddRow />}
                            {answers.map(answer => <AdminAnswerListRow key={"answer-row-" + answer.answerId} answer={answer} />)}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
}
