import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import "./AdminQuestionAnswerList.sass";
import IQuestion from "../../../models/IQuestion.model";
import IAnswer from "../../../models/IAnswer.model";

interface IAdminQuestionAnswerListRowProperties {
  questionAnswer: IAnswer;
}

export interface IAdminQuestionAnswerListUrlParams
  extends Record<string, string | undefined> {
  qid: string;
}

export default function AdminQuestionAnswerList() {
  const params = useParams<IAdminQuestionAnswerListUrlParams>();

  const [question, setQuestion] = useState<IQuestion>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    loadQuestionData(+(params.qid ?? 0));
  }, [params.qid]);

  function loadQuestionData(questionId: number) {
    if (!questionId) {
      return;
    }

    api("get", "/api/question/" + questionId, "administrator").then((res) => {
      if (res.status === "error") {
        return setErrorMessage(res.data + "");
      }

      setQuestion(res.data);
    });
  }

  function AdminQuestionAnswerListRow(
    props: IAdminQuestionAnswerListRowProperties
  ) {
    const [answerValue] = useState<string>(
      props.questionAnswer.answer.answerValue
    );

    const correctSideClass = props.questionAnswer.isCorrect
      ? " btn-primary"
      : " btn-light";
    const incorrectSideClass = !props.questionAnswer.isCorrect
      ? " btn-primary"
      : " btn-light";

    return (
      <tr>
        <td>{props.questionAnswer.answer.answerId}</td>
        <td>
          <div className="input-group">
            <input
              className="form-control form-control-sm"
              type="text"
              readOnly={true}
              value={answerValue}
            />
          </div>
        </td>
        <td>
          <div className="btn-group">
            <div className={"btn btn-sm" + correctSideClass}>Correct</div>
            <div className={"btn btn-sm" + incorrectSideClass}>Incorrect</div>
          </div>
        </td>
      </tr>
    );
  }

  function renderAnswerTable(question: IQuestion) {
    return (
      <div>
        <div className="btn-group">
          <Link
            className="btn btn-secondary btn-sm"
            to="/admin/dashboard/question/list"
          >
            &laquo; Back to question &quot;{question.title}&quot;
          </Link>
        </div>

        <table className="table table-sm table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Answer value</th>
              <th>Is correct</th>
            </tr>
          </thead>
          <tbody>
            {question.answers?.map((answer) => (
              <AdminQuestionAnswerListRow
                key={"answer-" + answer.answer.answerId}
                questionAnswer={answer}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      {errorMessage && (
        <p className="alert alert-danger mb-3">{errorMessage}</p>
      )}
      {question && renderAnswerTable(question)}
    </div>
  );
}
