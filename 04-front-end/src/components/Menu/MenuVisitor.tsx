import { useState } from "react";
import { Link } from "react-router-dom";
import AppStore from "../../stores/AppStore";

export default function MenuVisitor() {
    const [role, setRole] = useState<"visitor" | "user" | "activeUser" | "administrator">(AppStore.getState().auth.role);

    AppStore.subscribe(() => {
        setRole(AppStore.getState().auth.role)
    });

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <Link className="navbar-brand" to="/">Home page</Link>

            {role === "user" && <Link className="navbar-brand" to="/">Good day, {AppStore.getState().auth.identity}</Link>}

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <Link className="nav-item nav-link" to="/auth/user/login">User login</Link>
                    <Link className="nav-item nav-link" to="/auth/user/register">Register an account</Link>
                    <Link className="nav-item nav-link" to="/auth/administrator/login">Admin login</Link>
                    <Link className="nav-item nav-link" to="/contact">Contact</Link>
                </div>
            </div>
        </nav>
    );
}
