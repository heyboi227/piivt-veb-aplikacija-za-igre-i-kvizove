import { useState } from 'react';
import MenuAdministrator from './MenuAdministrator';
import MenuActiveUser from './MenuActiveUser';
import MenuVisitor from './MenuVisitor';
import AppStore from '../../stores/AppStore';

export default function Menu() {
    const [role, setRole] = useState<"visitor" | "user" | "activeUser" | "administrator">(AppStore.getState().auth.role);

    AppStore.subscribe(() => {
        setRole(AppStore.getState().auth.role)
    });

    return (
        <>
            {(role === "visitor" || role === "user") && <MenuVisitor />}
            {role === "activeUser" && <MenuActiveUser />}
            {role === "administrator" && <MenuAdministrator />}
        </>
    );
}
