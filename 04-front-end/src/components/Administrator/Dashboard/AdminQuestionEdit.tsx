import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import { IAnswerModel } from "../../../models/IAnswer.model";
import IQuestion from "../../../models/IQuestion.model";

export interface IAdminQuestionEditUrlParams
  extends Record<string, string | undefined> {
  qid: string;
}

interface IEditQuestionFormState {
  gameId: number;
  title: string;
  answers: {
    answerId: number;
    isCorrect: boolean;
  }[];
}

type TSetGameId = { type: "editQuestionForm/setGameId"; value: number };
type TSetTitle = { type: "editQuestionForm/setTitle"; value: string };
type TAddAnswer = { type: "editQuestionForm/addAnswer"; value: number };
type TAddAnswerFull = {
  type: "editQuestionForm/addAnswerFull";
  value: { answerId: number; isCorrect: boolean };
};
type TRemoveAnswer = { type: "editQuestionForm/removeAnswer"; value: number };
type TSetAnswerIsCorrect = {
  type: "editQuestionForm/setAnswerIsCorrect";
  value: { answerId: number; isCorrect: boolean };
};

type EditQuestionFormAction =
  | TSetGameId
  | TSetTitle
  | TAddAnswer
  | TAddAnswerFull
  | TRemoveAnswer
  | TSetAnswerIsCorrect;

function EditQuestionFormReducer(
  oldState: IEditQuestionFormState,
  action: EditQuestionFormAction
): IEditQuestionFormState {
  switch (action.type) {
    case "editQuestionForm/setGameId": {
      return {
        ...oldState,
        answers: [
          ...oldState.answers.map((answer) => {
            return { ...answer };
          }),
        ],
        // This changes:
        gameId: action.value,
      };
    }

    case "editQuestionForm/setTitle": {
      return {
        ...oldState,
        answers: [
          ...oldState.answers.map((answer) => {
            return { ...answer };
          }),
        ],
        // This changes:
        title: action.value,
      };
    }

    case "editQuestionForm/addAnswer": {
      if (oldState.answers.find((answer) => answer.answerId === action.value)) {
        return oldState;
      }

      return {
        ...oldState,
        // This changes:
        answers: [
          ...oldState.answers.map((answer) => {
            return { ...answer };
          }),
          { answerId: action.value, isCorrect: false },
        ],
      };
    }

    case "editQuestionForm/addAnswerFull": {
      if (
        oldState.answers.find(
          (answer) => answer.answerId === action.value.answerId
        )
      ) {
        return oldState;
      }

      return {
        ...oldState,
        // This changes:
        answers: [
          ...oldState.answers.map((answer) => {
            return { ...answer };
          }),
          {
            answerId: action.value.answerId,
            isCorrect: action.value.isCorrect,
          },
        ],
      };
    }

    case "editQuestionForm/removeAnswer": {
      if (
        !oldState.answers.find((answer) => answer.answerId === action.value)
      ) {
        return oldState;
      }

      return {
        ...oldState,
        // This changes:
        answers: [
          ...oldState.answers
            .map((answer) => {
              return { ...answer };
            })
            .filter((answer) => answer.answerId !== action.value),
        ],
      };
    }

    case "editQuestionForm/setAnswerIsCorrect": {
      if (
        !oldState.answers.find(
          (answer) => answer.answerId === action.value.answerId
        )
      ) {
        return oldState;
      }

      return {
        ...oldState,
        // This changes:
        answers: [
          ...oldState.answers.map((answer) => {
            if (action.value.answerId !== answer.answerId) {
              return { ...answer };
            }

            return {
              ...answer,
              isCorrect: action.value.isCorrect,
            };
          }),
        ],
      };
    }

    default:
      return oldState;
  }
}

export default function AdminQuestionEdit() {
  const params = useParams<IAdminQuestionEditUrlParams>();
  const questionId = +(params.qid ?? "");

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [question, setQuestion] = useState<IQuestion>();
  const [answers, setAnswers] = useState<IAnswerModel[]>([]);

  const navigate = useNavigate();

  const [formState, dispatchFormStateAction] = useReducer(
    EditQuestionFormReducer,
    {
      gameId: 1,
      title: "",
      answers: [],
    }
  );

  const loadQuestion = () => {
    api("get", "/api/question/" + questionId, "administrator")
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error("Could not load this question!");
        }

        return res.data;
      })
      .then((question) => {
        setQuestion(question);
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  const loadAnswers = () => {
    api("get", "/api/answer/game/" + formState.gameId, "administrator")
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error("Could not load answer information!");
        }

        return res.data;
      })
      .then((answers) => {
        setAnswers(answers);
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  const doEditQuestion = () => {
    api("put", "/api/question/" + questionId, "administrator", formState)
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not edit this question! Reason: " +
              res?.data
                ?.map(
                  (error: any) => error?.instancePath + " " + error?.message
                )
                .join(", ")
          );
        }

        return res.data;
      })
      .then((question) => {
        if (!question?.questionId) {
          throw new Error("Could not fetch the edited question data!");
        }
      })
      .then(() => {
        navigate("/admin/dashboard/question/list", {
          replace: true,
        });
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  useEffect(() => {
    setErrorMessage("");
    loadQuestion();
  }, [params.qid]);

  useEffect(() => {
    loadAnswers();
  }, [formState.gameId]);

  useEffect(() => {
    dispatchFormStateAction({
      type: "editQuestionForm/setGameId",
      value: question?.gameId ?? 1,
    });
    dispatchFormStateAction({
      type: "editQuestionForm/setTitle",
      value: question?.title ?? "",
    });

    for (let answer of question?.answers ?? []) {
      dispatchFormStateAction({
        type: "editQuestionForm/addAnswerFull",
        value: {
          answerId: answer.answer.answerId,
          isCorrect: answer.isCorrect,
        },
      });
    }
  }, [question]);

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="card-title">
            <h1 className="h5">Edit question</h1>
          </div>
          <div className="card-text">
            {errorMessage && (
              <div className="alert alert-danger mb-3">{errorMessage}</div>
            )}

            <div className="row">
              <div className="col col-12 col-lg-7 mb-3 mb-lg-0">
                <h2 className="h6">Manage question data</h2>

                <div className="form-group mb-3">
                  <label>Game ID</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      min={1}
                      max={4}
                      value={formState.gameId}
                      onChange={(e) =>
                        dispatchFormStateAction({
                          type: "editQuestionForm/setGameId",
                          value: +e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label>Title</label>
                  <div className="input-group">
                    <textarea
                      className="form-control form-control-sm"
                      rows={5}
                      value={formState.title}
                      onChange={(e) =>
                        dispatchFormStateAction({
                          type: "editQuestionForm/setTitle",
                          value: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-froup mb-3">
                  <label>Answers</label>

                  {answers?.map((answer) => {
                    const answerData = formState.answers.find(
                      (s) => s.answerId === answer.answerId
                    );

                    return (
                      <div className="row" key={"answer-" + answer.answerId}>
                        <div className="col col-3">
                          {answerData ? (
                            <FontAwesomeIcon
                              onClick={() =>
                                dispatchFormStateAction({
                                  type: "editQuestionForm/removeAnswer",
                                  value: answer.answerId,
                                })
                              }
                              icon={faCheckSquare}
                            />
                          ) : (
                            <FontAwesomeIcon
                              onClick={() =>
                                dispatchFormStateAction({
                                  type: "editQuestionForm/addAnswer",
                                  value: answer.answerId,
                                })
                              }
                              icon={faSquare}
                            />
                          )}{" "}
                          {answer.answerValue}
                        </div>

                        {answerData && (
                          <>
                            <div className="col col-2">
                              <div className="input-group input-group-sm">
                                <select
                                  onChange={(e) =>
                                    dispatchFormStateAction({
                                      type: "editQuestionForm/setAnswerIsCorrect",
                                      value: {
                                        answerId: answer.answerId,
                                        isCorrect:
                                          e.target.value === "correct"
                                            ? true
                                            : false,
                                      },
                                    })
                                  }
                                  defaultValue={
                                    answerData.isCorrect
                                      ? "correct"
                                      : "incorrect"
                                  }
                                >
                                  <option value={"correct"}>Correct</option>
                                  <option value={"incorrect"}>Incorrect</option>
                                </select>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="form-froup mb-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => doEditQuestion()}
                  >
                    Edit question
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
