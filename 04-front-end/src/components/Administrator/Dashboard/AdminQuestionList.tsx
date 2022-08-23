import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../api/api";
import IQuestion from "../../../models/IQuestion.model";
import "./AdminQuestionList.sass";

interface IAdminQuestionListRowProperties {
  question: IQuestion;
}

export default function AdminQuestionList() {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function AdminQuestionListRow(props: IAdminQuestionListRowProperties) {
    const [gameId] = useState<number>(props.question.gameId);
    const [title] = useState<string>(props.question.title);

    const doDeleteQuestion = (e: any) => {
      api(
        "delete",
        "/api/question/" + props.question.questionId,
        "administrator"
      ).then((res) => {
        if (res.status === "error") {
          return setErrorMessage("Could not delete this question!");
        }

        loadQuestions();
      });
    };

    return (
      <tr>
        <td>{props.question.questionId}</td>
        <td>
          <p>{gameId}</p>
        </td>
        <td>
          <p>{title}</p>
        </td>
        <td>
          <Link
            className="btn btn-primary btn-sm"
            to={
              "/admin/dashboard/question/" +
              props.question.questionId +
              "/answers/list"
            }
          >
            List answers
          </Link>
          &nbsp;&nbsp;
          <Link
            className="btn btn-primary btn-sm"
            to={
              "/admin/dashboard/question/" + props.question.questionId + "/edit"
            }
          >
            Edit
          </Link>
          &nbsp;&nbsp;
          <button
            className="btn btn-danger btn-sm"
            onClick={(e) => doDeleteQuestion(e)}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  }

  const loadQuestions = () => {
    api("get", "/api/question", "administrator")
      .then((apiResponse) => {
        if (apiResponse.status === "ok") {
          return setQuestions(apiResponse.data);
        }

        throw new Error("Unknown error while loading questions...");
      })
      .catch((error) => {
        setErrorMessage(
          error?.message ?? "Unknown error while loading questions..."
        );
      });
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  return (
    <div>
      {errorMessage && <p>Error: {errorMessage}</p>}
      {!errorMessage && (
        <div>
          <Link
            className="btn btn-sm btn-primary"
            to={"/admin/dashboard/question/add"}
          >
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
              {questions.map((question) => (
                <AdminQuestionListRow
                  key={"question-row-" + question.questionId}
                  question={question}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
