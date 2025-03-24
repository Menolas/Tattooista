import {ADMIN, SUPER_ADMIN, USER} from "./constants";
import {RoleType} from "../types/Types";
import * as React from "react";

export const getNewPage = (currentPage:number) => {
    if (currentPage > 1) {
        return currentPage - 1
    } else {
        return 1
    }
}

export const getUserRole = (uRoles: Array<string>, roles: Array<RoleType>) => {
    let userRole = ''
    const userRoles = uRoles.map(userRole => {
        const role = roles.find(role => role._id === userRole);
        return role ? role.value : null; // Return role value if found, null otherwise
    });
    //console.log(userRoles)
    if (userRoles.includes("SUPERADMIN")){
        userRole = SUPER_ADMIN
    } else if (userRoles.includes("ADMIN")) {
        userRole = ADMIN
    } else if (userRoles) {
        userRole = USER
    }

    return userRole
}

export const handleEnterClick = (event: React.KeyboardEvent, handleSubmit: () => void) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleSubmit();
    }
};

export const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
        .then(() => {
            //alert("Page URL copied to clipboard!");
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
};

export const getDateFormatted = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};
