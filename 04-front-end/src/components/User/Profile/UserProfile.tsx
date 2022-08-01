import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../api/api";
import IUser from "../../../models/IUser.model";
import AppStore from "../../../stores/AppStore";
import UserDetailsEditor from "./UserDetailsEditor";
import UserPasswordChanger from "./UserPasswordChanger";

export default function UserProfile() {
    const [user, setUser] = useState<IUser>();

    function loadUserData() {
        if (AppStore.getState().auth.role !== "activeUser") {
            return;
        }

        api("get", "/api/user/" + AppStore.getState().auth.id, "activeUser")
            .then(res => {
                if (res.status !== 'ok') {
                    throw new Error("Coudl not fetch this data. Reason: " + JSON.stringify(res.data));
                }

                return res.data;
            })
            .then(user => {
                setUser(user);
            })
            .catch(() => { });
    };

    useEffect(loadUserData, []);

    if (AppStore.getState().auth.role !== "activeUser") {
        return null;
    }

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <div className="card-title mb-3">
                        <h1 className="h5">My profile</h1>
                    </div>
                    <div className="card-text">
                        <div className="row mb-4">
                            <div className="col col-12 col-lg-6">
                                {user && <UserDetailsEditor user={user} onDataChanged={user => setUser(user)} />}
                            </div>

                            <div className="col col-12 col-lg-6">
                                {user && <UserPasswordChanger user={user} onPasswordChange={user => setUser(user)} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">My questions</h2>
                        </div>
                        <div className="card-text d-grid gap-3">
                            <Link className="btn btn-primary" to="/question">List all</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
