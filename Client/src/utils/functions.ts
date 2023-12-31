import * as React from "react";

export const getNewPage = (currentPage:number) => {
    if (currentPage > 1) {
        return currentPage - 1
    } else {
        return 1
    }
}
