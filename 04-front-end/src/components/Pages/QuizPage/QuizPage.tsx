import { useEffect, useState } from "react";
import IGame from "../../../models/IGame.model"
import IQuestion from "../../../models/IQuestion.model";
import { api } from '../../../api/api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ShowFirstGameSummaryAction from "../../../helpers/ShowFirstGameSummaryAction";

export default function QuizPage() {
    const [game, setGame] = useState<IGame>();
    const [gameId, setGameId] = useState<number>(1);

    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [questions, setQuestions] = useState<IQuestion[]>();

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isClicked, setIsClicked] = useState<boolean>(false);

    const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
    const [givenWord, setGivenWord] = useState<string>("");
    const [doesGivenWordExist, setDoesGivenWordExist] = useState<boolean>(false);
    const [doesWordExistMessage, setDoesWordExistMessage] = useState<string>("");
    const [showFirstGameSummaryDialog, setShowFirstGameSummaryDialog] = useState<boolean>(false);

    const [givenCountryName, setGivenCountryName] = useState<string>("");


    const handleClick = () => {
        setIsClicked(current => !current);
        setTimeout(() => { setIsClicked(current => !current); }, 2000);
    }

    function loadGameData() {
        if (gameId > 4) {
            return;
        }

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
                if (res?.status < 200 || res?.status >= 300) {
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
        if (gameId === 1) {
            setShuffledLetters(shuffleWordLetters(questions ? questions[0].answers[0].answer.answerValue.split("") : []));
        }
    }, [gameId, questions])

    function renderGameInfo(game: IGame) {
        return (
            <div>
                <h1>{game.name}</h1>
                <button className="btn btn-primary btn-sm" onClick={() => setGameId(gameId + 1)}>Submit</button>
            </div>
        );
    }

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

    function RenderQuestionInfo(question: IQuestion) {

        if (gameId === 1) {
            const characters = "abcdefghijklmnopqrstuvwxyz".split("");

            while (shuffledLetters.length < 10) {
                shuffledLetters.push(randomElement(characters));
            }

            return (
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
                                            onChange={(e) => { setGivenWord(e.target.value); checkIfWordExists(givenWord) }} />
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
                                            onSubmit={() => { setShowFirstGameSummaryDialog(false); setGivenWord(""); setShuffledLetters([]); setGameId(gameId + 1) }}
                                            givenWord={givenWord}
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
                </div >
            );
        }
        if (gameId === 2) {
            return (<div className="d-flex flex-column justify-content-center align-items-center">
                <>
                    <h1>{question.title}</h1>
                    <div className="row">
                        <>{question.answers.map((answer) => {
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
                            onChange={(e) => setGivenCountryName(e.target.value)} />
                    </div>
                    <div>
                        <button className="btn btn-sm btn-primary mt-3" onClick={() => {
                            if (question.answers[0].answer.answerValue.includes(givenCountryName)) {
                                alert("Correct!");
                            } else {
                                alert("Incorrect!")
                            }
                        }}>Submit</button>
                    </div>
                </>
            </div >);
        }
        if (gameId === 3) {
            return (
                <div>
                    <>
                        <h1>{question.title}</h1>
                        <div className="row">
                            <>
                                {question.answers.map((answer) => {
                                    return (<div className="col-6 col-lg-2 col-md-3 col-xl-2 p-3" key={"answer-" + answer.answer.answerId}>
                                        <div className={!isClicked ? "card" : "card" + (answer.isCorrect ? " border-3 border-success" : " border-3 border-danger")} onClick={handleClick}>
                                            <div className="card-body">
                                                <div className="card-title m-auto">
                                                    <img
                                                        src={"https://flagcdn.com/120x90/" + answer.answer.answerValue + ".png"}
                                                        srcSet={"https://flagcdn.com/240x180/" + answer.answer.answerValue + ".png 2x"}
                                                        width="120"
                                                        height="90"
                                                        alt={answer.answer.answerValue} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>);
                                })}
                                {isClicked && <button className="btn btn-success btn-sm" onClick={() => { (questionIndex < (questions?.length ?? 0)) ? setQuestionIndex(questionIndex + 1) : setQuestionIndex(0) }}>Next question</button>}
                            </>
                        </div>
                    </>
                </div>
            );
        }
        else {
            return (
                <div>
                    <>
                        <h1>{question.title}</h1>
                        <div className="row">
                            <>
                                {question.answers.map((answer) => {
                                    return (<div className="col-6 col-lg-2 col-md-3 col-xl-2 p-3" key={"answer-" + answer.answer.answerId}>
                                        <div className={!isClicked ? "card" : "card" + (answer.isCorrect ? " border-3 border-success" : " border-3 border-danger")} onClick={handleClick}>
                                            <div className="card-body">
                                                <div className="card-title m-auto">
                                                    <h1>{answer.answer.answerValue}</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>);
                                })}
                                {isClicked && <button className="btn btn-success btn-sm" onClick={() => { (questionIndex < (questions?.length ?? 0)) ? setQuestionIndex(questionIndex + 1) : setQuestionIndex(0) }}>Next question</button>}
                            </>
                        </div>
                    </>
                </div>
            );
        }
    }

    return (
        <div>
            {errorMessage && <p className="alert alert-danger mb-3">{errorMessage}</p>}
            {game && gameId === 3 && renderGameInfo(game)}
            {questions && RenderQuestionInfo(questions[questionIndex])}
        </div>
    );
}