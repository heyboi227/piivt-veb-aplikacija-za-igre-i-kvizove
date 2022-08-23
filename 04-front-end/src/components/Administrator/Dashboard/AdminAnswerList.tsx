import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../api/api";
import { IAnswerModel } from "../../../models/IAnswer.model";
import "./AdminAnswerList.sass";

export interface IAdminAnswerListRowProperties {
  answer: IAnswerModel;
}

export default function AdminAnswerList() {
  const [answers, setAnswers] = useState<IAnswerModel[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function AdminAnswerListRow(props: IAdminAnswerListRowProperties) {
    const [gameId, setGameId] = useState<number>(props.answer.gameId);
    const [answerValue, setAnswerValue] = useState<string>(
      props.answer.answerValue
    );

    const gameIdChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setGameId(+e.target.value);
    };

    const answerValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAnswerValue(e.target.value);
    };

    const doEditAnswer = (e: any) => {
      api("put", "/api/answer/" + props.answer.answerId, "administrator", {
        gameId,
        answerValue,
      }).then((res) => {
        if (res.status === "error") {
          return setErrorMessage("Could not edit this answer!");
        }

        loadAnswers();
      });
    };

    const doDeleteAnswer = (e: any) => {
      api(
        "delete",
        "/api/answer/" + props.answer.answerId,
        "administrator"
      ).then((res) => {
        if (res.status === "error") {
          return setErrorMessage("Could not delete this answer!");
        }

        loadAnswers();
      });
    };

    return (
      <tr>
        <td>{props.answer.answerId}</td>
        <td>
          <div className="input-group">
            <input
              className="form-control form-control-sm"
              type="number"
              min={1}
              max={4}
              onChange={(e) => gameIdChanged(e)}
              value={gameId}
            />
            {props.answer.gameId !== gameId ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={(e) => doEditAnswer(e)}
              >
                Save
              </button>
            ) : (
              ""
            )}
          </div>
        </td>
        <td>
          <div className="input-group">
            <input
              className="form-control form-control-sm"
              type="text"
              onChange={(e) => answerValueChanged(e)}
              value={answerValue}
            />
            {props.answer.answerValue !== answerValue ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={(e) => doEditAnswer(e)}
              >
                Save
              </button>
            ) : (
              ""
            )}
          </div>
        </td>
        <td>
          <Link
            className="btn btn-primary btn-sm"
            to={"/admin/dashboard/answer/" + props.answer.answerId + "/edit"}
          >
            Edit
          </Link>
          &nbsp;&nbsp;
          <button
            className="btn btn-danger btn-sm"
            onClick={(e) => doDeleteAnswer(e)}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  }

  const loadAnswers = () => {
    api("get", "/api/answer", "administrator")
      .then((apiResponse) => {
        if (apiResponse.status === "ok") {
          return setAnswers(apiResponse.data);
        }

        throw new Error("Unknown error while loading answers...");
      })
      .catch((error) => {
        setErrorMessage(
          error?.message ?? "Unknown error while loading answers..."
        );
      });
  };

  useEffect(() => {
    loadAnswers();
  }, []);

  return (
    <div>
      {errorMessage && <p>Error: {errorMessage}</p>}
      {!errorMessage && (
        <div>
          <Link
            className="btn btn-sm btn-primary"
            to={"/admin/dashboard/answer/add"}
          >
            <FontAwesomeIcon icon={faPlusSquare} /> Add new answer
          </Link>

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
              {answers.map((answer) => (
                <AdminAnswerListRow
                  key={"answer-row-" + answer.answerId}
                  answer={answer}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
