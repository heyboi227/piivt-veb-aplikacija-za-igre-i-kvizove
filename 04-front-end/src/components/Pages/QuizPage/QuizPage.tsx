import { useEffect, useState } from "react";
import IGame from "../../../models/IGame.model";
import IQuestion from "../../../models/IQuestion.model";
import { api } from "../../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import FirstGameSummaryAction from "../../../helpers/FirstGameSummaryAction";
import { useNavigate } from "react-router-dom";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./QuizPage.sass";
import IAnswer from "../../../models/IAnswer.model";
import { CountdownTimer } from "../../CountdownTimer/CountdownTimer";
import GameSummaryAction from "../../../helpers/GameSummaryAction";
import QuizSummaryAction from "../../../helpers/QuizSummaryAction";
import AppStore from "../../../stores/AppStore";
import RegisterUserAction from "../../../helpers/RegisterUserAction";
import ConfirmAction from "../../../helpers/ConfirmAction";
import ReportWrongQuestionAction from "../../../helpers/ReportWrongQuestionAction";

export default function QuizPage() {
  const role = AppStore.getState().auth.role;

  const [showRegisterUserDialog, setShowRegisterUserDialog] =
    useState<boolean>(false);

  const [game, setGame] = useState<IGame>();
  const [gameId, setGameId] = useState<number>(1);

  const [points, setPoints] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);

  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<IQuestion[]>();

  // Interaction hooks
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [incorrectMessageReason, setIncorrectMessageReason] =
    useState<string>("");

  const [showConfirmExitDialog, setShowConfirmExitDialog] =
    useState<boolean>(false);

  const [showGameSummaryDialog, setShowGameSummaryDialog] =
    useState<boolean>(false);

  const [showQuizSummaryDialog, setShowQuizSummaryDialog] =
    useState<boolean>(false);

  const [showReportWrongQuestionDialog, setShowReportWrongQuestionDialog] =
    useState<boolean>(false);

  const [showReportWrongQuestionButton, setShowReportWrongQuestionButton] =
    useState<boolean>(false);

  // First game hooks
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState<string>("");
  const [givenWord, setGivenWord] = useState<
    { letter: string; index: number }[]
  >([]);
  const [doesGivenWordExist, setDoesGivenWordExist] = useState<boolean>(false);
  const [doesWordExistMessage, setDoesWordExistMessage] = useState<string>("");
  const [showFirstGameSummaryDialog, setShowFirstGameSummaryDialog] =
    useState<boolean>(false);

  // Second game hooks
  const [givenCountryName, setGivenCountryName] = useState<string>("");
  const [isCountryNameCorrect, setIsCountryNameCorrect] =
    useState<boolean>(false);
  const [
    isCountryNameCorrectMessageVisible,
    setIsCountryNameCorrectMessageVisible,
  ] = useState<boolean>(false);

  // Third game hooks
  const [isCountryFlagCorrect, setIsCountryFlagCorrect] =
    useState<boolean>(false);
  const [isCountryFlagCorrectMessage, setIsCountryFlagCorrectMessage] =
    useState<string>("");
  const [
    isCountryFlagCorrectMessageVisible,
    setIsCountryFlagCorrectMessageVisible,
  ] = useState<boolean>(false);

  // Fourth game hooks
  const [isExpressionResultCorrect, setIsExpressionResultCorrect] =
    useState<boolean>(false);
  const [
    isExpressionResultCorrectMessageVisible,
    setIsExpressionResultCorrectMessageVisible,
  ] = useState<boolean>(false);

  // Navigation hooks
  const navigate = useNavigate();

  function checkIfWordExists(word: string) {
    axios({
      method: "GET",
      url: "https://wordsapiv1.p.rapidapi.com/words/" + word,
      headers: {
        "X-RapidAPI-Key": "6d9da25073msheeafa7b7195d868p1e35e8jsnda1f1df455a5",
        "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
      },
      validateStatus: () => true,
    })
      .then((res) => {
        if ((res?.status < 200 || res?.status >= 300) && targetWord !== word) {
          setDoesGivenWordExist(false);
          setDoesWordExistMessage("The word does not exist!");
          setTimeout(() => setDoesWordExistMessage(""), 3000);
          return;
        }

        setDoesGivenWordExist(true);
        setDoesWordExistMessage("The word exists!");
        setTimeout(() => setDoesWordExistMessage(""), 3000);
      })
      .catch((err) => {
        setErrorMessage(err + "");
      });
  }

  function resetBeforeNextGame() {
    setPoints(0);
    setGameId(gameId + 1);
    setQuestionIndex(0);
    setLoading(true);
  }

  function endQuiz() {
    setPoints(0);
    setGameId(1);
    setQuestionIndex(0);
    setLoading(true);
    setShowReportWrongQuestionButton(false);
    navigate("/", { replace: true });
  }

  function checkFlagAnswer(question: IQuestion) {
    setIsCountryNameCorrectMessageVisible(true);

    if (
      question.answers[0].answer.answerValue
        .toLowerCase()
        .includes(givenCountryName.toLowerCase())
    ) {
      setIsCountryNameCorrect(true);
      setPoints(points + 1);
      setTotalPoints(totalPoints + 1);
    } else {
      setIsCountryNameCorrect(false);
    }
  }

  function checkResultForMultipleAnswers(answer: IAnswer, gameId: number) {
    setIsClicked(true);
    if (gameId === 3) {
      setIsCountryFlagCorrectMessageVisible(true);
      if (answer.isCorrect) {
        setIsCountryFlagCorrect(true);
        setPoints(points + 1);
        setTotalPoints(totalPoints + 1);
      } else {
        setIsCountryFlagCorrect(false);
        setIsCountryFlagCorrectMessage(
          "You have selected the flag of " +
            answer.answer.answerValue.substring(
              4,
              answer.answer.answerValue.length - 1
            )
        );
      }
    } else if (gameId === 4) {
      setIsExpressionResultCorrectMessageVisible(true);
      if (answer.isCorrect) {
        setIsExpressionResultCorrect(true);
        setPoints(points + 2);
        setTotalPoints(totalPoints + 2);
      } else {
        setIsExpressionResultCorrect(false);
      }
    }
  }

  function loadGameData() {
    api("get", "/api/game/" + gameId, "user").then((res) => {
      if (res.status === "error") {
        setErrorMessage(res.data + "");
        return setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }

      setGame(res.data);
    });
  }

  function loadQuestionsForGame() {
    api("get", "/api/question/game/" + gameId, "user").then((res) => {
      if (res.status === "error") {
        setErrorMessage(res.data + "");
        return setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }

      setQuestions(res.data);

      if (gameId === 1) {
        setTargetWord(res.data[0].answers[0].answer.answerValue);
      }

      setLoading(false);
    });
  }

  const doAddScore = () => {
    api("post", "/api/score", "activeUser", {
      userId: AppStore.getState().auth.id,
      value: totalPoints,
    })
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not add this item! Reason: " +
              res?.data
                ?.map(
                  (error: any) => error?.instancePath + " " + error?.message
                )
                .join(", ")
          );
        }
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  const doEditQuestion = () => {
    api(
      "put",
      "/api/question/" + questions![questionIndex].questionId,
      "activeUser",
      {
        isCorrect: false,
        incorrectMessageReason: incorrectMessageReason,
      }
    )
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not edit this item! Reason: " +
              res?.data
                ?.map(
                  (error: any) => error?.instancePath + " " + error?.message
                )
                .join(", ")
          );
        }
        console.log(res);
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  useEffect(() => {
    loadGameData();
    loadQuestionsForGame();
  }, [gameId]);

  useEffect(() => {
    setShuffledLetters(
      shuffleWordLetters(
        questions ? questions[0].answers[0].answer.answerValue.split("") : []
      )
    );
  }, [questions]);

  function shuffleWordLetters(letterArray: string[]) {
    let currentIndex = letterArray.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [letterArray[currentIndex], letterArray[randomIndex]] = [
        letterArray[randomIndex],
        letterArray[currentIndex],
      ];
    }

    return letterArray;
  }

  function randomElement(array: string[]) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function RenderQuestionInfo(question: IQuestion) {
    if (gameId === 1) {
      const characters = "abcdefghijklmnopqrstuvwxyz".split("");

      while (shuffledLetters.length < 10) {
        shuffledLetters.push(randomElement(characters));
      }

      return (
        <>
          <div>
            <>
              <h1>{question.title}</h1>
              <div className="row">
                <>
                  {shuffledLetters.map((letter, index) => {
                    return (
                      <div
                        className="col-3 col-lg-2 col-md-3 col-xl-1"
                        key={"answer-letter-" + letter + "-" + index}
                      >
                        <div
                          className="card"
                          onClick={(e) => {
                            setGivenWord((givenWord) => [
                              ...givenWord,
                              { letter, index },
                            ]);
                            document
                              .querySelectorAll(".card")
                              [index].classList.add("bg-secondary");
                            document
                              .querySelectorAll(".card")
                              [index].classList.add("disable-click");
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.classList.add("bg-primary");
                            e.currentTarget.classList.add("pointer");
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.classList.remove("bg-primary");
                            e.currentTarget.classList.remove("pointer");
                          }}
                        >
                          <div className="card-body">
                            <div className="card-title m-auto d-flex justify-content-center align-items-center">
                              <h1>{letter.toUpperCase()}</h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="form-group d-flex flex-row align-items-center justify-content-center">
                    <div className="input-group mt-3 me-2">
                      <input
                        className="form-control form-control-sm"
                        type="text"
                        placeholder="Enter your word here"
                        defaultValue={givenWord
                          .map((word) => word.letter)
                          .join("")}
                      />
                    </div>
                    {givenWord.length > 0 && (
                      <button
                        title="Delete previous"
                        className="btn btn-sm btn-danger mt-3 me-2"
                        onClick={() => {
                          document
                            .querySelectorAll(".card")
                            [
                              givenWord[givenWord.length - 1].index
                            ].classList.remove("bg-secondary");
                          document
                            .querySelectorAll(".card")
                            [
                              givenWord[givenWord.length - 1].index
                            ].classList.remove("disable-click");

                          setGivenWord(
                            givenWord.slice(0, givenWord.length - 1)
                          );
                        }}
                      >
                        <FontAwesomeIcon icon={faDeleteLeft}></FontAwesomeIcon>
                      </button>
                    )}

                    {givenWord.length > 0 && (
                      <button
                        className="btn btn-sm btn-danger mt-3"
                        style={{ fontSize: ".80rem", width: "70px" }}
                        onClick={() => {
                          document
                            .querySelectorAll(".card")
                            .forEach((card) =>
                              card.classList.remove("bg-secondary")
                            );
                          document
                            .querySelectorAll(".card")
                            .forEach((card) =>
                              card.classList.remove("disable-click")
                            );

                          setGivenWord([]);
                        }}
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div>
                    {givenWord.length > 0 && (
                      <>
                        <button
                          className="btn btn-sm btn-success mt-3"
                          onClick={() => {
                            checkIfWordExists(
                              givenWord.map((word) => word.letter).join("")
                            );
                          }}
                        >
                          Check availability
                        </button>
                        <button
                          className="btn btn-sm btn-primary mt-3 ms-3"
                          onClick={() => {
                            setShowFirstGameSummaryDialog(true);
                            setPoints(points + givenWord.length);
                            setTotalPoints(points + givenWord.length);
                          }}
                        >
                          Submit
                        </button>

                        {showFirstGameSummaryDialog && (
                          <FirstGameSummaryAction
                            title="Find the longest word summary"
                            onSubmit={() => {
                              setShowFirstGameSummaryDialog(false);
                              resetBeforeNextGame();
                              setGivenWord([]);
                              setShuffledLetters([]);
                            }}
                            givenWord={
                              givenWord.map((word) => word.letter).join("") !==
                              ""
                                ? givenWord.map((word) => word.letter).join("")
                                : "Nothing entered"
                            }
                            targetWord={question.answers[0].answer.answerValue}
                            pointsMessage={() => {
                              if (
                                doesGivenWordExist ||
                                givenWord
                                  .map((word) => word.letter)
                                  .join("") ===
                                  question.answers[0].answer.answerValue
                              ) {
                                return "You have won " + points + " points!";
                              } else {
                                return "Unfortunately, you have won no points as the word does not exist.";
                              }
                            }}
                            onReport={() =>
                              setShowReportWrongQuestionDialog(true)
                            }
                          />
                        )}
                      </>
                    )}
                    {givenWord.length === 0 && (
                      <button
                        className="btn btn-sm btn-primary"
                        disabled={true}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                  <div>
                    {doesWordExistMessage && doesGivenWordExist && (
                      <p className="alert alert-success mb-3">
                        {doesWordExistMessage}
                      </p>
                    )}
                    {doesWordExistMessage && !doesGivenWordExist && (
                      <p className="alert alert-danger mb-3">
                        {doesWordExistMessage}
                      </p>
                    )}
                  </div>
                </>
              </div>
            </>
          </div>
        </>
      );
    } else if (gameId === 2) {
      return (
        <>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <>
              <h1>{question.title}</h1>
              <div className="row">
                <>
                  {question.answers.map((answer) => {
                    return (
                      <div
                        className="col-6 col-lg-2 col-md-3 col-xl-2 p-3 d-flex flex-column justify-content-center align-items-center"
                        style={{
                          marginLeft: "50%",
                          transform: "translateX(-50%)",
                        }}
                        key={"answer-" + answer.answer.answerId}
                      >
                        <div className="card">
                          <div className="card-body">
                            <div className="card-title m-auto">
                              <img
                                src={
                                  "https://flagcdn.com/h120/" +
                                  answer.answer.answerValue.substring(0, 2) +
                                  ".png"
                                }
                                srcSet={
                                  "https://flagcdn.com/h240/" +
                                  answer.answer.answerValue.substring(0, 2) +
                                  ".png 2x"
                                }
                                height="120"
                                alt={answer.answer.answerValue}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              </div>
              <div className="input-group w-25">
                <input
                  className="form-control form-control-sm"
                  type="text"
                  value={givenCountryName}
                  placeholder="Guess the flag"
                  onChange={(e) => setGivenCountryName(e.target.value)}
                  onKeyUp={(e) =>
                    e.key === "Enter" &&
                    (checkFlagAnswer(question),
                    setShowReportWrongQuestionButton(true))
                  }
                />
              </div>
              {isCountryNameCorrect && isCountryNameCorrectMessageVisible && (
                <div className="correct mt-3">
                  <h1>
                    <FontAwesomeIcon icon={faCircleCheck}></FontAwesomeIcon>{" "}
                    Correct!
                  </h1>
                </div>
              )}
              {!isCountryNameCorrect && isCountryNameCorrectMessageVisible && (
                <>
                  <div className="d-flex justify-content-center align-items-center flex-column mt-3">
                    <h1 className="incorrect">
                      <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>{" "}
                      Incorrect!
                    </h1>
                    <h2>
                      The correct answer is:{" "}
                      {question.answers[0].answer.answerValue.substring(
                        4,
                        question.answers[0].answer.answerValue.length - 1
                      )}
                    </h2>
                  </div>
                </>
              )}
              {showGameSummaryDialog && (
                <GameSummaryAction
                  title={"Guess the country name summary"}
                  pointsMessage={() => {
                    return "You have won " + points + " points!";
                  }}
                  onSubmit={() => {
                    setShowGameSummaryDialog(false);
                    resetBeforeNextGame();
                  }}
                />
              )}
              <div>
                {!isCountryNameCorrectMessageVisible && (
                  <button
                    className="btn btn-sm btn-primary mt-3"
                    onClick={() => checkFlagAnswer(question)}
                  >
                    Submit
                  </button>
                )}
                {isCountryNameCorrectMessageVisible &&
                  questionIndex !==
                    (questions !== undefined ? questions?.length - 1 : 0) && (
                    <button
                      className="btn btn-sm btn-success mt-3 ms-3"
                      onClick={() => {
                        setQuestionIndex(questionIndex + 1);
                        setGivenCountryName("");
                        setIsCountryNameCorrectMessageVisible(false);
                        setShowReportWrongQuestionButton(false);
                      }}
                    >
                      Next question
                    </button>
                  )}
                {isCountryNameCorrectMessageVisible &&
                  questionIndex ===
                    (questions !== undefined ? questions?.length - 1 : 0) && (
                    <button
                      className="btn btn-sm btn-success mt-3 ms-3"
                      onClick={() => {
                        setShowGameSummaryDialog(true);
                        setIsCountryNameCorrectMessageVisible(false);
                        setShowReportWrongQuestionButton(false);
                      }}
                    >
                      Summary
                    </button>
                  )}
              </div>
            </>
          </div>
        </>
      );
    } else if (gameId === 3) {
      return (
        <>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <>
              <div>
                <h1>{game?.name}</h1>
              </div>
              <h1>{question.title}</h1>
              <div className="row">
                <>
                  {question.answers.map((answer) => {
                    return (
                      <div
                        className="col-6 col-md-4 col-lg-4 col-xl-4 p-3 d-flex justify-content-center align-items-center"
                        key={"answer-" + answer.answer.answerId}
                      >
                        <div
                          className={
                            !isClicked
                              ? "card"
                              : "card" +
                                (answer.isCorrect
                                  ? " border border-3 border-success"
                                  : " border border-3 border-danger")
                          }
                          onClick={() => {
                            checkResultForMultipleAnswers(answer, 3);
                            setShowReportWrongQuestionButton(true);
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.classList.add("pointer");
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.classList.remove("pointer");
                          }}
                        >
                          <div className="card-body">
                            <div className="card-title m-auto">
                              <img
                                src={
                                  "https://flagcdn.com/120x90/" +
                                  answer.answer.answerValue.substring(0, 2) +
                                  ".png"
                                }
                                srcSet={
                                  "https://flagcdn.com/240x180/" +
                                  answer.answer.answerValue.substring(0, 2) +
                                  ".png 2x"
                                }
                                width="120"
                                height="90"
                                alt={answer.answer.answerValue}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              </div>
              {isCountryFlagCorrect && isCountryFlagCorrectMessageVisible && (
                <div className="correct mt-3">
                  <h1>
                    <FontAwesomeIcon icon={faCircleCheck}></FontAwesomeIcon>{" "}
                    Correct!
                  </h1>
                </div>
              )}
              {!isCountryFlagCorrect && isCountryFlagCorrectMessageVisible && (
                <>
                  <div className="d-flex justify-content-center align-items-center flex-column mt-3">
                    <h1 className="incorrect">
                      <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>{" "}
                      Incorrect!
                    </h1>
                    {isCountryFlagCorrectMessage && (
                      <h2>{isCountryFlagCorrectMessage}</h2>
                    )}
                  </div>
                </>
              )}
              {showGameSummaryDialog && (
                <GameSummaryAction
                  title={"Guess the country flag summary"}
                  pointsMessage={() => {
                    return "You have won " + points + " points!";
                  }}
                  onSubmit={() => {
                    setShowGameSummaryDialog(false);
                    resetBeforeNextGame();
                  }}
                />
              )}
              <div>
                {isCountryFlagCorrectMessageVisible &&
                  questionIndex <
                    (questions !== undefined ? questions?.length - 1 : 0) && (
                    <button
                      className="btn btn-sm btn-success mt-3"
                      onClick={() => {
                        setQuestionIndex(questionIndex + 1);
                        setIsClicked(false);
                        setIsCountryFlagCorrectMessageVisible(false);
                        setShowReportWrongQuestionButton(false);
                      }}
                    >
                      Next question
                    </button>
                  )}
                {isCountryFlagCorrectMessageVisible &&
                  questionIndex ===
                    (questions !== undefined ? questions?.length - 1 : 0) && (
                    <button
                      className="btn btn-sm btn-success mt-3"
                      onClick={() => {
                        setShowGameSummaryDialog(true);
                        setIsClicked(false);
                        setIsCountryFlagCorrectMessageVisible(false);
                        setShowReportWrongQuestionButton(false);
                      }}
                    >
                      Summary
                    </button>
                  )}
              </div>
            </>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <>
              <div>
                <h1>{game?.name}</h1>
              </div>
              <h1>{question.title}</h1>
              <div className="row">
                <>
                  {question.answers.map((answer) => {
                    return (
                      <div
                        className="col-6 col-md-4 col-lg-4 col-xl-4 p-3 d-flex justify-content-center align-items-center"
                        style={{ width: "150px" }}
                        key={"answer-" + answer.answer.answerId}
                      >
                        <div
                          className={
                            !isClicked
                              ? "card w-100 d-flex justify-content-center align-items-center"
                              : "card w-100 d-flex justify-content-center align-items-center" +
                                (answer.isCorrect
                                  ? " border border-3 border-success"
                                  : " border border-3 border-danger")
                          }
                          onClick={() => {
                            checkResultForMultipleAnswers(answer, 4);
                            setShowReportWrongQuestionButton(true);
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.classList.add("pointer");
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.classList.remove("pointer");
                          }}
                        >
                          <div className="card-body">
                            <div className="card-title m-auto">
                              <h1>{answer.answer.answerValue}</h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              </div>
              {isExpressionResultCorrect &&
                isExpressionResultCorrectMessageVisible && (
                  <div className="correct mt-3">
                    <h1>
                      <FontAwesomeIcon icon={faCircleCheck}></FontAwesomeIcon>{" "}
                      Correct!
                    </h1>
                  </div>
                )}
              {!isExpressionResultCorrect &&
                isExpressionResultCorrectMessageVisible && (
                  <div className="incorrect mt-3">
                    <h1>
                      <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>{" "}
                      Incorrect!
                    </h1>
                  </div>
                )}
              {showQuizSummaryDialog && (
                <QuizSummaryAction
                  title={"Guess the expression result summary"}
                  pointsMessage={() => {
                    return (
                      "The quiz has been finished. In the last game, you have won " +
                      points +
                      " points. In total, you have won " +
                      totalPoints +
                      " points!"
                    );
                  }}
                  onSubmit={() => {
                    if (role === "user") {
                      setShowQuizSummaryDialog(false);
                      setShowRegisterUserDialog(true);
                      return;
                    }

                    setShowQuizSummaryDialog(false);
                    doAddScore();
                    endQuiz();
                    setShowReportWrongQuestionButton(false);
                    navigate("/", { replace: true });
                  }}
                />
              )}
              {showRegisterUserDialog && (
                <RegisterUserAction
                  title={"Registration required"}
                  message={
                    "Thank you for playing our quiz. If you wish to play again and store your results, please register your account on the following page."
                  }
                  onSubmit={() => {
                    setShowRegisterUserDialog(false);
                    endQuiz();
                    navigate("/auth/user/register", { replace: true });
                  }}
                />
              )}
              <div>
                {isExpressionResultCorrectMessageVisible &&
                  questionIndex !==
                    (questions !== undefined ? questions?.length - 1 : 0) && (
                    <button
                      className="btn btn-sm btn-success mt-3"
                      onClick={() => {
                        setQuestionIndex(questionIndex + 1);
                        setIsClicked(false);
                        setIsExpressionResultCorrectMessageVisible(false);
                      }}
                    >
                      Next question
                    </button>
                  )}
                {isExpressionResultCorrectMessageVisible &&
                  questionIndex ===
                    (questions !== undefined ? questions?.length - 1 : 0) && (
                    <button
                      className="btn btn-sm btn-success mt-3"
                      onClick={() => {
                        setShowQuizSummaryDialog(true);
                        setIsClicked(false);
                        setIsExpressionResultCorrectMessageVisible(false);
                      }}
                    >
                      Summary
                    </button>
                  )}
              </div>
            </>
          </div>
        </>
      );
    }
  }

  return (
    <div>
      {errorMessage && (
        <p className="alert alert-danger mb-3">{errorMessage}</p>
      )}

      <button
        className="btn btn-sm btn-danger"
        onClick={() => setShowConfirmExitDialog(true)}
      >
        Exit quiz
      </button>

      {showReportWrongQuestionButton && (
        <button
          className="btn btn-sm btn-danger"
          onClick={() => setShowReportWrongQuestionDialog(true)}
        >
          Report question
        </button>
      )}

      {showReportWrongQuestionDialog && (
        <ReportWrongQuestionAction
          title={"Report incorrect question"}
          incorrectMessageReason={incorrectMessageReason}
          setIncorrectMessageReason={setIncorrectMessageReason}
          onSubmit={() => {
            doEditQuestion();
            endQuiz();
            setShowReportWrongQuestionDialog(false);
            if (gameId >= 2 && gameId <= 3) {
              setShowGameSummaryDialog(false);
            } else if (gameId === 1) {
              setShowFirstGameSummaryDialog(false);
            } else {
              setShowQuizSummaryDialog(false);
            }
          }}
          onCancel={() => setShowReportWrongQuestionDialog(false)}
        />
      )}

      {showConfirmExitDialog && (
        <ConfirmAction
          title={"The quiz is in progress."}
          message={
            "Are you sure you want to exit? You will lose all the results previously made."
          }
          onYes={() => {
            setShowConfirmExitDialog(false);
            navigate("/", { replace: true });
          }}
          onNo={() => setShowConfirmExitDialog(false)}
        />
      )}

      {(showFirstGameSummaryDialog ||
        showGameSummaryDialog ||
        showQuizSummaryDialog) && (
        <CountdownTimer delay={0} onComplete={() => {}} />
      )}

      {gameId === 1 && !loading && !showFirstGameSummaryDialog && (
        <CountdownTimer
          delay={60000}
          onComplete={() => {
            setShowFirstGameSummaryDialog(true);
          }}
        />
      )}

      {(gameId === 2 || gameId === 3) && !loading && !showGameSummaryDialog && (
        <CountdownTimer
          delay={questions ? questions.length * 10000 : 10000}
          onComplete={() => {
            setShowGameSummaryDialog(true);
          }}
        />
      )}

      {gameId === 4 && !loading && !showQuizSummaryDialog && (
        <CountdownTimer
          delay={questions ? questions.length * 30000 : 30000}
          onComplete={() => {
            setShowQuizSummaryDialog(true);
          }}
        />
      )}

      {questions && RenderQuestionInfo(questions[questionIndex])}
    </div>
  );
}
