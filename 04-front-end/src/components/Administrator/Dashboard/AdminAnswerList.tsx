import React, { useEffect, useState } from "react";
import { api } from "../../../api/api";
import IAnswer from "../../../models/IAnswer.model";
import './AdminAnswerList.sass';

export interface IAdminAnswerListRowProperties {
    answer: IAnswer,
}

export default function AdminAnswerList() {
    const [answers, setAnswers] = useState<IAnswer[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showAddNewAnswer, setShowAddNewAnswer] = useState<boolean>(false);

    function AdminAnswerListRow(props: IAdminAnswerListRowProperties) {
        const [gameId, setGameId] = useState<number>(props.answer.gameId);
        const [answerValue, setAnswerValue] = useState<string>(props.answer.answerValue);

        const gameIdChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setGameId(+e.target.value);
        }

        const answerValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setAnswerValue(e.target.value);
        }

        const doEditAnswer = (e: any) => {
            api("put", "/api/answer/" + props.answer.answerId, "administrator", { gameId, answerValue })
                .then(res => {
                    if (res.status === 'error') {
                        return setErrorMessage("Could not edit this answer!");
                    }

                    loadAnswers();
                })
        }

        const doDeleteAnswer = (e: any) => {
            api("delete", "/api/answer/" + props.answer.answerId, "administrator")
                .then(res => {
                    if (res.status === "error") {
                        return setErrorMessage("Could not delete this answer!");
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
                            type="number"
                            min={1}
                            max={4}
                            onChange={e => gameIdChanged(e)}
                            value={gameId} />
                        {props.answer.gameId !== gameId
                            ? <button className="btn btn-primary btn-sm" onClick={e => doEditAnswer(e)}>
                                Save
                            </button>
                            : ''
                        }
                    </div>
                </td>
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
                    <button className="btn btn-danger btn-sm" onClick={e => doDeleteAnswer(e)}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    }

    function AdminAnswerListAddRow() {
        const [gameId, setGameId] = useState<number>(1);
        const [answerValue, setAnswerValue] = useState<string>("");

        const gameIdChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setGameId(+e.target.value);
        }

        const answerValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setAnswerValue(e.target.value);
        }

        const doAddAnswer = (e: any) => {
            api("post", "/api/answer", "administrator", { gameId, answerValue })
                .then(res => {
                    if (res.status === 'error') {
                        return setErrorMessage("Could not add this answer!");
                    }

                    loadAnswers();

                    setGameId(1);
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
                            type="number"
                            min={1}
                            max={4}
                            onChange={e => gameIdChanged(e)}
                            value={gameId} />
                    </div>
                </td>
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
                        && gameId >= 1 && gameId <= 4
                        ? <button className="btn btn-primary btn-sm" onClick={e => doAddAnswer(e)}>
                            Save
                        </button>
                        : ''
                    }
                    <button className="btn btn-danger btn-sm" onClick={() => {
                        setShowAddNewAnswer(false);
                        setGameId(1);
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
                                <th>Game ID</th>
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
