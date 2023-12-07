export const getNewPage = (currentPage:number) => {
    if (currentPage > 1) {
        return currentPage - 1
    } else {
        return 1
    }
}

// export const getNewPage = (currentPage:number, total:number, pageLimit:number) => {
//     if (currentPage > 1) {
//         return currentPage - 1
//     } else if ((total - 1) > pageLimit) {
//         return currentPage + 1
//     } else {
//         return 1
//     }
// }
