import * as React from 'react'

type PropsType = {
  totalCount: number
  pageSize: number
  currentPage?: number
  onPageChanged: (page: number) => void
  setPageLimit: (pageSize: number) => void
}

export const Paginator: React.FC<PropsType> = React.memo(({
  totalCount,
  pageSize,
  currentPage = 1,
  onPageChanged,
  setPageLimit
}) => {

  let pagesCount: number = Math.ceil(totalCount / pageSize)
  let pages = []
  for (let i = 1; i <= pagesCount; i++) {
    pages.push(i)
  }

  pages = pages
    .map(page => {
      return (
        <li
          key={page}
          className={currentPage === page ? "pagination__item currentPage" : "pagination__item"}
          onClick={() => {
            onPageChanged(page)
          }}
        >
          {page}
        </li>
      )
    })

  if (totalCount > pageSize) {
      return (
          <div className="pagination">
              <div className={"page-limit"}>
                  <label htmlFor={"pageLimit"}>Page limit</label>
                  <select
                      id="pageLimit"
                      name={"pageLimit"}
                      value={pageSize}
                      onChange={(event) => {
                          setPageLimit(Number(event.target.value))
                          console.log(event.target.value)
                      }}
                  >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                  </select>
              </div>
              <ul className="list pagination__list">
                  {pages}
              </ul>
          </div>
      )
  } else {
      return
  }
})
