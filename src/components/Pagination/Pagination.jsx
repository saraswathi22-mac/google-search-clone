import { useEffect, useState } from "react";

import "./Pagination.css";

const DESKTOP_VISIBLE_PAGES = 5;
const MOBILE_VISIBLE_PAGES = 3;

function Pagination({
  page,
  setPage,
  totalPages,
  hasPreviousPage,
  hasNextPage,
}) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const visiblePages = isMobile ? MOBILE_VISIBLE_PAGES : DESKTOP_VISIBLE_PAGES;

  let startPage = page - Math.floor(visiblePages / 2);

  if (startPage < 1) {
    startPage = 1;
  }

  const endPage = startPage + visiblePages - 1;

  if (endPage > totalPages) {
    startPage = Math.max(1, totalPages - visiblePages + 1);
  }

  const pages = Array.from(
    { length: visiblePages },
    (_, index) => startPage + index,
  );

  return (
    <div className="pagination">
      <button
        className="paginationBtn paginationNavBtn"
        disabled={!hasPreviousPage}
        onClick={() => setPage((prev) => prev - 1)}
      >
        <span className="paginationArrow">←</span>
        <span className="paginationText">Previous</span>
      </button>

      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`paginationBtn ${
            page === pageNumber ? "paginationBtnActive" : ""
          }`}
          onClick={() => setPage(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      <button
        className="paginationBtn paginationNavBtn"
        disabled={!hasNextPage}
        onClick={() => setPage((prev) => prev + 1)}
      >
        <span className="paginationText">Next</span>
        <span className="paginationArrow">→</span>
      </button>
    </div>
  );
}

export default Pagination;
