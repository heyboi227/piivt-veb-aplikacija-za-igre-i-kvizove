import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import { localDateFormat } from "../../../helpers/helpers";
import IScore from "../../../models/IScore.model";
import AppStore from "../../../stores/AppStore";

interface IUserScoresListRowProperties {
  score: IScore;
}

export default function UserScoresPage() {
  const [scores, setScores] = useState<IScore[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function UserScoresListRow(props: IUserScoresListRowProperties) {
    const [createdAt] = useState<string>(props.score.createdAt);
    const [value] = useState<number>(props.score.value);

    return (
      <tr>
        <td>{localDateFormat(createdAt)}</td>
        <td>{value}</td>
      </tr>
    );
  }

  const loadScores = () => {
    api("get", "/api/score/user/" + AppStore.getState().auth.id, "activeUser")
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
          <h1>My scores</h1>
          <div>
            <table className="table table-bordered table-striped table-hover table-sm mt-3">
              <thead>
                <tr>
                  <th>Date played</th>
                  <th>Score value</th>
                </tr>
              </thead>
              <tbody>
                {!scores && <h1>You haven't played the quiz yet.</h1>}
                {scores.map((score) => (
                  <UserScoresListRow
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
