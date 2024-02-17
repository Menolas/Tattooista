import {ADMIN, SUPER_ADMIN, USER} from "./constants";
import {RoleType} from "../types/Types";

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
