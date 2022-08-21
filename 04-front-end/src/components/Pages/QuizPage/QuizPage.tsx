import { useEffect, useState } from "react";
import IGame from "../../../models/IGame.model"
import IQuestion from '../../../models/IQuestion.model';
import { api } from '../../../api/api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ShowFirstGameSummaryAction from "../../../helpers/ShowFirstGameSummaryAction";
import { useNavigate } from "react-router-dom";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./QuizPage.sass";
import IAnswer from "../../../models/IAnswer.model";
import { CountdownTimer } from "../../CountdownTimer/CountdownTimer";

export default function QuizPage() {
    const [game, setGame] = useState<IGame>();
    const [gameId, setGameId] = useState<number>(1);

    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [questions, setQuestions] = useState<IQuestion[]>();

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isClicked, setIsClicked] = useState<boolean>(false);

    // First game hooks
    const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
    const [givenWord, setGivenWord] = useState<string>("");
    const [doesGivenWordExist, setDoesGivenWordExist] = useState<boolean>(false);
    const [doesWordExistMessage, setDoesWordExistMessage] = useState<string>("");
    const [showFirstGameSummaryDialog, setShowFirstGameSummaryDialog] = useState<boolean>(false);

    // Second game hooks
    const [givenCountryName, setGivenCountryName] = useState<string>("");
    const [isCountryNameCorrect, setIsCountryNameCorrect] = useState<boolean>(false);
    const [isCountryNameCorrectMessageVisible, setIsCountryNameCorrectMessageVisible] = useState<boolean>(false);

    // Third game hooks
    const [isCountryFlagCorrect, setIsCountryFlagCorrect] = useState<boolean>(false);
    const [isCountryFlagCorrectMessage, setIsCountryFlagCorrectMessage] = useState<string>("");
    const [isCountryFlagCorrectMessageVisible, setIsCountryFlagCorrectMessageVisible] = useState<boolean>(false);

    // Fourth game hooks
    const [isExpressionResultCorrect, setIsExpressionResultCorrect] = useState<boolean>(false);
    const [isExpressionResultCorrectMessageVisible, setIsExpressionResultCorrectMessageVisible] = useState<boolean>(false);

    const navigate = useNavigate();

    function handleClick(answer: IAnswer, gameId: number) {
        setIsClicked(true);
        if (gameId === 3) {
            setIsCountryFlagCorrectMessageVisible(true);
            if (answer.isCorrect) {
                setIsCountryFlagCorrect(true);
            } else {
                setIsCountryFlagCorrect(false);
                setIsCountryFlagCorrectMessage("You have selected the flag of " + answer.answer.answerValue.substring(4, answer.answer.answerValue.length - 1));
            }
        } else if (gameId === 4) {
            setIsExpressionResultCorrectMessageVisible(true);
            if (answer.isCorrect) {
                setIsExpressionResultCorrect(true);
            } else {
                setIsExpressionResultCorrect(false);
            }
        }
    }

    function loadGameData() {
        api("get", "/api/game/" + gameId, "user")
            .then(res => {
                if (res.status === "error") {
                    setErrorMessage(res.data + "");
                    return setTimeout(() => { setErrorMessage("") }, 3000);
                }

                setGame(res.data);
            })
    }

    function loadQuestionsForGame() {
        api("get", "/api/question/game/" + gameId, "user")
            .then(res => {
                if (res.status === "error") {
                    setErrorMessage(res.data + "");
                    return setTimeout(() => { setErrorMessage("") }, 3000);
                }

                setQuestions(res.data);
            })
    }

    function checkIfWordExists(word: string) {
        axios({
            method: 'GET',
            url: 'https://wordsapiv1.p.rapidapi.com/words/' + word,
            headers: {
                'X-RapidAPI-Key': '6d9da25073msheeafa7b7195d868p1e35e8jsnda1f1df455a5',
                'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
            },
            validateStatus: () => true
        })
            .then(res => {
                if ((res?.status < 200 || res?.status >= 300) && word === givenWord) {
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

    useEffect(() => {
        loadGameData();
        loadQuestionsForGame();
    }, [gameId]);

    useEffect(() => {
        setShuffledLetters(shuffleWordLetters(questions ? questions[0].answers[0].answer.answerValue.split("") : []));
    }, [questions]);

    function shuffleWordLetters(letterArray: string[]) {
        let currentIndex = letterArray.length, randomIndex;

        while (currentIndex !== 0) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [letterArray[currentIndex], letterArray[randomIndex]] = [
                letterArray[randomIndex], letterArray[currentIndex]];
        }

        return letterArray;
    }

    function randomElement(array: string[]) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function checkFlagAnswer(question: IQuestion) {
        setIsCountryNameCorrectMessageVisible(true);

        if (question.answers[0].answer.answerValue.toLowerCase().includes(givenCountryName.toLowerCase())) {
            setIsCountryNameCorrect(true);
        } else {
            setIsCountryNameCorrect(false);
        }
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
                                        return (<div className="col-3 col-lg-2 col-md-3 col-xl-1" key={"answer-letter-" + letter + "-" + index} onClick={() => setGivenWord(givenWord + letter)}>
                                            <div className="card" onMouseEnter={(e) => e.currentTarget.classList.add("bg-primary")} onMouseLeave={(e) => e.currentTarget.classList.remove("bg-primary")}>
                                                <div className="card-body">
                                                    <div className="card-title m-auto d-flex justify-content-center align-items-center">
                                                        <h1>{letter.toUpperCase()}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>);
                                    })}
                                    <div className="form-group d-flex flex-row align-items-center justify-content-center">
                                        <div className="input-group mt-3 me-2">
                                            <input className="form-control form-control-sm"
                                                type="text"
                                                value={givenWord}
                                                placeholder="Enter your word here"
                                                onChange={(e) => setGivenWord(e.target.value)} />
                                        </div>
                                        {givenWord.length > 0 && <button className="btn btn-sm btn-danger mt-3 me-2" onClick={() => setGivenWord(givenWord.slice(0, givenWord.length - 1))}><FontAwesomeIcon icon={faDeleteLeft}></FontAwesomeIcon></button>}
                                        {givenWord.length > 0 && <button className="btn btn-sm btn-danger mt-3" style={{ fontSize: ".80rem", width: "70px" }} onClick={() => setGivenWord("")}>Clear all</button>}
                                    </div>
                                    <div>
                                        {givenWord.length > 0 && <>
                                            <button className="btn btn-sm btn-success" onClick={() => checkIfWordExists(givenWord)}>Check availability</button>
                                            <button className="btn btn-sm btn-primary" onClick={() => setShowFirstGameSummaryDialog(true)}>Submit</button>

                                            {showFirstGameSummaryDialog && <ShowFirstGameSummaryAction
                                                title="Find the longest word summary"
                                                onSubmit={() => {
                                                    setShowFirstGameSummaryDialog(false);
                                                    setGivenWord("");
                                                    setShuffledLetters([]);
                                                    setGameId(2);
                                                    setQuestionIndex(0);
                                                }}
                                                givenWord={givenWord !== "" ? givenWord : "Nothing entered"}
                                                targetWord={question.answers[0].answer.answerValue}
                                                pointsMessage={() => {
                                                    if (doesGivenWordExist || givenWord === question.answers[0].answer.answerValue) {
                                                        return "You have won " + givenWord.length + " points!";
                                                    } else {
                                                        return "Unfortunately, you have won no points as the word does not exist.";
                                                    }
                                                }} />}
                                        </>}
                                        {givenWord.length === 0 && <button className="btn btn-sm btn-primary" disabled={true}>Submit</button>}
                                    </div>
                                    <div>
                                        {doesWordExistMessage && doesGivenWordExist && <p className="alert alert-success mb-3">{doesWordExistMessage}</p>}
                                        {doesWordExistMessage && !doesGivenWordExist && <p className="alert alert-danger mb-3">{doesWordExistMessage}</p>}
                                    </div>
                                </>
                            </div>
                        </>
                    </div>
                </>
            );
        }
        else if (gameId === 2) {
            return (
                <>
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <>
                            <h1>{question.title}</h1>
                            <div className="row">
                                <>
                                    {question.answers.map((answer) => {
                                        return (<div className="col-6 col-lg-2 col-md-3 col-xl-2 p-3 d-flex flex-column justify-content-center align-items-center" style={{ marginLeft: "50%", transform: "translateX(-50%)" }} key={"answer-" + answer.answer.answerId}>
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-title m-auto">
                                                        <img
                                                            src={"https://flagcdn.com/h120/" + answer.answer.answerValue.substring(0, 2) + ".png"}
                                                            srcSet={"https://flagcdn.com/h240/" + answer.answer.answerValue.substring(0, 2) + ".png 2x"}
                                                            height="120"
                                                            alt={answer.answer.answerValue} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>);
                                    })}
                                </>
                            </div>
                            <div className="input-group w-25">
                                <input className="form-control form-control-sm"
                                    type="text"
                                    value={givenCountryName}
                                    placeholder="Guess the flag"
                                    onChange={(e) => setGivenCountryName(e.target.value)}
                                    onKeyUp={(e) => e.key === "Enter" && checkFlagAnswer(question)} />
                            </div>
                            {isCountryNameCorrect && isCountryNameCorrectMessageVisible && <div className="correct mt-3"><h1><FontAwesomeIcon icon={faCircleCheck}></FontAwesomeIcon> Correct!</h1></div>}
                            {!isCountryNameCorrect && isCountryNameCorrectMessageVisible &&
                                <>
                                    <div className="d-flex justify-content-center align-items-center flex-column mt-3">
                                        <h1 className="incorrect"><FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon> Incorrect!</h1>
                                        <h2>The correct answer is: {question.answers[0].answer.answerValue.substring(4, question.answers[0].answer.answerValue.length - 1)}</h2>
                                    </div>
                                </>}
                            <div>
                                {!isCountryNameCorrectMessageVisible && <button className="btn btn-sm btn-primary mt-3" onClick={() => checkFlagAnswer(question)}>Submit</button>}
                                {isCountryNameCorrectMessageVisible && <button className="btn btn-sm btn-success mt-3 ms-3" onClick={() => {
                                    if (questionIndex < (questions !== undefined ? questions?.length - 1 : 0)) {
                                        setQuestionIndex(questionIndex + 1);
                                        setGivenCountryName("");
                                    } else {
                                        setGameId(3);
                                        setQuestionIndex(0);
                                    }

                                    setIsCountryNameCorrectMessageVisible(false);
                                }}>Next question</button>}
                            </div>
                        </>
                    </div>
                </>);
        }
        else if (gameId === 3) {
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
                                        return (<div className="col-6 col-md-4 col-lg-4 col-xl-4 p-3 d-flex justify-content-center align-items-center" key={"answer-" + answer.answer.answerId}>
                                            <div className={!isClicked ? "card" : "card" + (answer.isCorrect ? " border border-3 border-success" : " border border-3 border-danger")} onClick={() => handleClick(answer, 3)}>
                                                <div className="card-body">
                                                    <div className="card-title m-auto">
                                                        <img
                                                            src={"https://flagcdn.com/120x90/" + answer.answer.answerValue.substring(0, 2) + ".png"}
                                                            srcSet={"https://flagcdn.com/240x180/" + answer.answer.answerValue.substring(0, 2) + ".png 2x"}
                                                            width="120"
                                                            height="90"
                                                            alt={answer.answer.answerValue} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>);
                                    })}
                                </>
                            </div>
                            {isCountryFlagCorrect && isCountryFlagCorrectMessageVisible && <div className="correct mt-3"><h1><FontAwesomeIcon icon={faCircleCheck}></FontAwesomeIcon> Correct!</h1></div>}
                            {!isCountryFlagCorrect && isCountryFlagCorrectMessageVisible &&
                                <>
                                    <div className="d-flex justify-content-center align-items-center flex-column mt-3">
                                        <h1 className="incorrect"><FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon> Incorrect!</h1>
                                        {isCountryFlagCorrectMessage && <h2>{isCountryFlagCorrectMessage}</h2>}
                                    </div>
                                </>}
                            <div>
                                {isCountryFlagCorrectMessageVisible && <button className="btn btn-sm btn-success mt-3" onClick={() => {
                                    if (questionIndex < (questions !== undefined ? questions?.length - 1 : 0)) {
                                        setQuestionIndex(questionIndex + 1);
                                    } else {
                                        setGameId(4);
                                        setQuestionIndex(0);
                                    }

                                    setIsClicked(false);
                                    setIsCountryFlagCorrectMessageVisible(false);
                                }}>Next question</button>}
                            </div>
                        </>
                    </div>
                </>
            );
        }
        else {
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
                                        return (<div className="col-6 col-md-4 col-lg-4 col-xl-4 p-3 d-flex justify-content-center align-items-center" style={{ width: "150px" }} key={"answer-" + answer.answer.answerId}>
                                            <div className={!isClicked ? "card w-100 d-flex justify-content-center align-items-center" : "card w-100 d-flex justify-content-center align-items-center" + (answer.isCorrect ? " border border-3 border-success" : " border border-3 border-danger")} onClick={() => handleClick(answer, 4)}>
                                                <div className="card-body">
                                                    <div className="card-title m-auto">
                                                        <h1>{answer.answer.answerValue}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>);
                                    })}
                                </>
                            </div>
                            {isExpressionResultCorrect && isExpressionResultCorrectMessageVisible && <div className="correct mt-3"><h1><FontAwesomeIcon icon={faCircleCheck}></FontAwesomeIcon> Correct!</h1></div>}
                            {!isExpressionResultCorrect && isExpressionResultCorrectMessageVisible && <div className="incorrect mt-3"><h1><FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon> Incorrect!</h1></div>}
                            <div>
                                {isExpressionResultCorrectMessageVisible && <button className="btn btn-sm btn-success mt-3" onClick={() => {
                                    if (questionIndex < (questions !== undefined ? questions?.length - 1 : 0)) {
                                        setQuestionIndex(questionIndex + 1);
                                        setGivenCountryName("");
                                    } else {
                                        setGameId(1);
                                        setQuestionIndex(0);
                                        navigate("/", { replace: true });
                                    }

                                    setIsClicked(false);
                                    setIsExpressionResultCorrectMessageVisible(false);
                                }}>Next question</button>}
                            </div>
                        </>
                    </div>
                </>
            );
        }
    }

    return (
        <div>
            {errorMessage && <p className="alert alert-danger mb-3">{errorMessage}</p>}

            {gameId === 1 && <CountdownTimer delay={60000} onComplete={() => {
                setShowFirstGameSummaryDialog(true);
            }}></CountdownTimer>}

            {gameId === 2 && <CountdownTimer delay={questions ? (questions.length * 10000) : 10000} onComplete={() => {
                // TODO: Show summary dialog for other games
            }}></CountdownTimer>}

            {gameId === 3 && <CountdownTimer delay={questions ? (questions.length * 10000) : 10000} onComplete={() => {
                // TODO: Show summary dialog for other games
            }}></CountdownTimer>}

            {gameId === 4 && <CountdownTimer delay={questions ? (questions.length * 30000) : 30000} onComplete={() => {
                // TODO: Show summary dialog for other games
            }}></CountdownTimer>}

            {questions && RenderQuestionInfo(questions[questionIndex])}
        </div>
    );
}