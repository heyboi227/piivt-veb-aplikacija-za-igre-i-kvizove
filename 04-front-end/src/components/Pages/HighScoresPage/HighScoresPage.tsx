import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import { localDateFormat } from "../../../helpers/helpers";
import IScore from "../../../models/IScore.model";
import AppStore from "../../../stores/AppStore";

interface IHighScoresListRowProperties {
  score: IScore;
}

export default function HighScoresPage() {
  const [scores, setScores] = useState<IScore[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function HighScoresListRow(props: IHighScoresListRowProperties) {
    const [createdAt] = useState<string>(props.score.createdAt);
    const [username] = useState<string>(props.score.user.username);
    const [value] = useState<number>(props.score.value);

    return (
      <tr
        className={
          username === AppStore.getState().auth.identity
            ? "text-white bg-primary"
            : ""
        }
      >
        <td>{localDateFormat(createdAt)}</td>
        <td>{username}</td>
        <td>{value}</td>
      </tr>
    );
  }

  const loadScores = () => {
    api("get", "/api/score/best", "activeUser")
      .then((apiResponse) => {
        if (apiResponse.status === "ok") {
          return setScores(apiResponse.data);
        }

        throw new Error("Unknown error while loading scores...");
      })
      .catch((error) => {
        setErrorMessage(
          error?.message ?? "Unknown error while loading scores..."
        );
      });
  };

  useEffect(() => {
    loadScores();
  }, []);

  return (
    <div>
      {errorMessage && <p>Error: {errorMessage}</p>}
      {!errorMessage && (
        <>
          <h1>High scores</h1>
          <div>
            <table className="table table-bordered table-hover table-sm mt-3">
              <thead>
                <tr>
                  <th>Date played</th>
                  <th>User</th>
                  <th>Score value</th>
                </tr>
              </thead>
              <tbody>
                {!scores && <h1>There are no high scores.</h1>}
                {scores.map((score) => (
                  <HighScoresListRow
                    key={"score-row-" + score.scoreId}
                    score={score}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
