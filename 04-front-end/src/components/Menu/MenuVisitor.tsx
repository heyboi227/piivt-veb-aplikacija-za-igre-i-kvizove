import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SubmitAction from "../../helpers/SubmitAction";
import AppStore from "../../stores/AppStore";
import { api } from '../../api/api';

export default function MenuVisitor() {
    const [role, setRole] = useState<"visitor" | "user" | "activeUser" | "administrator">(AppStore.getState().auth.role);
    const [username, setUsername] = useState<string>("");
    const [showUsernameSubmitDialog, setShowUsernameSubmitDialog] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    AppStore.subscribe(() => {
        setRole(AppStore.getState().auth.role)
    });

    const doAddUser = () => {
        api("post", "/api/user", "user", { username })
            .then(res => {
                if (res.status !== "ok") {
                    throw new Error("Could not add your account. Reason: " + JSON.stringify(res.data));
                }
            })
            .then(() => {
                api("post", "/api/auth/user/login", "user", { username })
                    .then(res => {
                        if (res.status !== "ok") {
                            throw new Error("Could not login. Reason: " + JSON.stringify(res.data));
                        }

                        return res.data;
                    })
                    .then(data => {
                        AppStore.dispatch({ type: "auth.update", key: "authToken", value: data?.authToken });
                        AppStore.dispatch({ type: "auth.update", key: "refreshToken", value: data?.refreshToken });
                        AppStore.dispatch({ type: "auth.update", key: "identity", value: username });
                        AppStore.dispatch({ type: "auth.update", key: "id", value: +(data?.id) });
                        AppStore.dispatch({ type: "auth.update", key: "role", value: "user" });
                    })
            })
            .then(() => {
                navigate("/quiz", {
                    replace: true,
                });
            })
            .catch(error => {
                setError(error?.message ?? "Could not add your account.");

                setTimeout(() => {
                    setError("");
                }, 3500);
            });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <Link className="navbar-brand" to="/">Home page</Link>

            {role === "user" && <Link className="navbar-brand" to="/">Good day, {AppStore.getState().auth.identity}</Link>}

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <Link className="nav-item nav-link" to="#" onClick={() => setShowUsernameSubmitDialog(true)}>Play!</Link>

                    {showUsernameSubmitDialog && <SubmitAction
                        title="Enter your username"
                        message="Please enter your username in order to start playing."
                        username={username}
                        setUsername={setUsername}
                        onSubmit={() => { doAddUser(); setShowUsernameSubmitDialog(false); }}
                        onCancel={() => setShowUsernameSubmitDialog(false)} />}

                    <Link className="nav-item nav-link" to="/auth/user/login">User login</Link>
                    {role === "user" && <Link className="nav-item nav-link" to="/auth/user/register">Register an account</Link>}
                    <Link className="nav-item nav-link" to="/auth/administrator/login">Admin login</Link>
                    <Link className="nav-item nav-link" to="/contact">Contact</Link>
                </div>
            </div>
            {error && <p className="alert alert-danger">{error}</p>}
        </nav>
    );
}
