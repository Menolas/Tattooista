import * as React from "react";
import {useEffect, useState} from "react";

type PropsType = {
  totalCount: number;
  pageSize: number;
  currentPage?: number;
  onPageChanged: (page: number) => void;
  setPageLimit: (pageSize: number) => void;
}

export const Paginator: React.FC<PropsType> = React.memo(({
  totalCount,
  pageSize = 5,
  currentPage = 1,
  onPageChanged,
  setPageLimit,
}) => {
  const [isPageLimitEditable, setIsPageLimitEditable] = useState(false);
  const [limit, setLimit] = useState(pageSize);

  useEffect(()=> {
    setLimit(pageSize)
  }, [pageSize]);

  const pagesCount: number = Math.ceil(totalCount / pageSize);
  let pages = [];
  for (let i = 1; i <= pagesCount; i++) {
    pages.push(i);
  }

  pages = pages
    .map(page => {
      return (
        <li
          key={page}
          className={currentPage === page ? "pagination__item currentPage" : "pagination__item"}
          onClick={() => {
            onPageChanged(page);
          }}
        >
          {page}
        </li>
      );
    });

  return (
      <div className="pagination">
          <div className={"page-limit"}>
              <label htmlFor={"pageLimit"}>Page limit:</label>
              {
                  !isPageLimitEditable &&
                      <button
                          className={"pagination__pageLimitButton"}
                          onClick={() => {
                              setIsPageLimitEditable(true);
                          }}
                      >
                          {pageSize}
                      </button>
              }

              {
                  isPageLimitEditable &&
                      <input
                          className={"pagination__pageLimit"}
                          id="pageLimit"
                          name={"pageLimit"}
                          value={limit || ""}
                          type={"number"}
                          autoFocus={true}
                          onChange={(e) => {
                              setLimit(Number(e.target.value));
                          }}
                          onBlur={() => {
                              setIsPageLimitEditable(false);
                              setPageLimit(limit);
                          }}
                          onKeyDown={(e) => {
                              if(e.key === "Enter") {
                                  setIsPageLimitEditable(false);
                                  setPageLimit(limit);
                              }
                          }}
                      />
              }

          </div>
          <ul className="list pagination__list">
              {pages}
          </ul>
          <div className={"paginator__total"}>
              Total: <span>{totalCount}</span>
          </div>

      </div>
  );
});

Paginator.displayName = 'Paginator';
