import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../api/api";
import IQuestion from "../../../models/IQuestion.model";
import './AdminQuestionList.sass';

interface IAdminQuestionListRowProperties {
    question: IQuestion,
}

export default function AdminQuestionList() {
    const [questions, setQuestions] = useState<IQuestion[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    function AdminQuestionListRow(props: IAdminQuestionListRowProperties) {
        const [gameId, setGameId] = useState<number>(props.question.gameId);
        const [title, setTitle] = useState<string>(props.question.title);

        const gameIdChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setGameId(+e.target.value);
        }

        const titleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setTitle(e.target.value);
        }

        const doEditQuestion = (e: any) => {
            api("put", "/api/question/" + props.question.questionId, "administrator", { gameId, title })
                .then(res => {
                    if (res.status === 'error') {
                        return setErrorMessage("Could not edit this question!");
                    }

                    loadQuestions();
                })
        }

        const doDeleteQuestion = (e: any) => {
            api("delete", "/api/question/" + props.question.questionId, "administrator")
                .then(res => {
                    if (res.status === 'error') {
                        return setErrorMessage("Could not delete this question!");
                    }

                    loadQuestions();
                })
        }

        return (
            <tr>
                <td>{props.question.questionId}</td>
                <td>
                    <div className="input-group">
                        <input className="form-control form-control-sm"
                            type="number"
                            min={1}
                            max={4}
                            onChange={e => gameIdChanged(e)}
                            value={gameId} />
                        {props.question.gameId !== gameId
                            ? <button className="btn btn-primary btn-sm" onClick={e => doEditQuestion(e)}>
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
                            onChange={e => titleChanged(e)}
                            value={title} />
                        {props.question.title !== title
                            ? <button className="btn btn-primary btn-sm" onClick={e => doEditQuestion(e)}>
                                Save
                            </button>
                            : ''
                        }
                    </div>
                </td>
                <td>
                    <Link className="btn btn-primary btn-sm" to={"/admin/dashboard/question/" + props.question.questionId + "/answers/list"}>
                        List answers
                    </Link>

                    &nbsp;&nbsp;

                    <Link className="btn btn-primary btn-sm" to={"/admin/dashboard/question/" + props.question.questionId + "/answers/add"}>
                        Add answer
                    </Link>

                    &nbsp;&nbsp;

                    <button className="btn btn-danger btn-sm" onClick={e => doDeleteQuestion(e)}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    }

    const loadQuestions = () => {
        api("get", "/api/question", "administrator")
            .then(apiResponse => {

                if (apiResponse.status === 'ok') {
                    return setQuestions(apiResponse.data);
                }

                throw new Error("Unknown error while loading questions...");
            })
            .catch(error => {
                setErrorMessage(error?.message ?? 'Unknown error while loading questions...');
            });
    }

    useEffect(() => {
        loadQuestions();
    }, []);

    return (
        <div>
            {errorMessage && <p>Error: {errorMessage}</p>}
            {!errorMessage &&
                <div>
                    <Link className="btn btn-sm btn-primary" to={"/admin/dashboard/question/add"}>
                        <FontAwesomeIcon icon={faPlusSquare} /> Add new question
                    </Link>

                    <table className="table table-bordered table-striped table-hover table-sm mt-3">
                        <thead>
                            <tr>
                                <th className="question-row-id">ID</th>
                                <th>Game ID</th>
                                <th>Title</th>
                                <th className="question-row-options">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map(question => <AdminQuestionListRow key={"question-row-" + question.questionId} question={question} />)}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
}
