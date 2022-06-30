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
    const [showAddNewQuestion, setShowAddNewQuestion] = useState<boolean>(false);

    function AdminQuestionListRow(props: IAdminQuestionListRowProperties) {
        const [title, setTitle] = useState<string>(props.question.title);

        const titleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setTitle(e.target.value);
        }

        const doEditQuestion = (e: any) => {
            api("put", "/api/question/" + props.question.questionId, "administrator", { title })
                .then(res => {
                    if (res.status === 'error') {
                        return setErrorMessage("Could not edit this question!");
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
                </td>
            </tr>
        );
    }

    function AdminQuestionAddRow() {
        const [title, setTitle] = useState<string>("");

        const titleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            setTitle(e.target.value);
        }

        const doAddQuestion = (e: any) => {
            api("post", "/api/question/", "administrator", { title })
                .then(res => {
                    if (res.status === 'error') {
                        return setErrorMessage("Could not add this question!");
                    }

                    loadQuestions();

                    setTitle("");
                    setShowAddNewQuestion(false);
                });
        }

        return (
            <tr>
                <td> </td>
                <td>
                    <div className="input-group">
                        <input className="form-control form-control-sm"
                            type="text"
                            onChange={e => titleChanged(e)}
                            value={title} />
                        {title.trim().length >= 4 && title.trim().length <= 32
                            ? <button className="btn btn-primary btn-sm" onClick={e => doAddQuestion(e)}>
                                Save
                            </button>
                            : ''
                        }
                    </div>
                </td>
                <td>
                    <button className="btn btn-danger btn-sm" onClick={() => {
                        setShowAddNewQuestion(false);
                        setTitle("");
                    }}>
                        Cancel
                    </button>
                </td>
            </tr>
        );
    }

    const loadQuestions = () => {
        api("get", "/api/question", "administrator")
            .then(apiResponse => {
                console.log("GET questions response: ", apiResponse);

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
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddNewQuestion(true)}>Add new question</button>

                    <table className="table table-bordered table-striped table-hover table-sm mt-3">
                        <thead>
                            <tr>
                                <th className="question-row-id">ID</th>
                                <th>Title</th>
                                <th className="question-row-options">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showAddNewQuestion && <AdminQuestionAddRow />}
                            {questions.map(question => <AdminQuestionListRow key={"question-row-" + question.questionId} question={question} />)}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
}
