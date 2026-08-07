import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Search from "../../components/Search/Search";
import "./SearchPage.css";
import { useStateValue } from "../../context/StateProvider";
import { useSearch } from "../../hooks/useSearch";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Dropdown from "../../components/DropDown/Dropdown";
import {
  searchPageMore,
  searchPageOptionsLeft,
  searchPageOptionsRight,
} from "../../constants";
import SiteInfo from "../../components/SiteInfo/SiteInfo";
import ResultThumbnail from "../../components/ResultThumbnail/ResultThumbnail";
import { useDebounce } from "../../hooks/useDebounce";
import ResultSkeleton from "../../components/ResultSkeleton/ResultSkeleton";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "../../context/ThemeContext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import Pagination from "../../components/Pagination/Pagination";
import Photos from "../../components/Photos/Photos";
import EmptySearchState from "../../components/EmptySearchState/EmptySearchState";

function SearchPage() {
  const { term } = useStateValue();
  const { theme, toggleTheme } = useTheme();
  const debouncedTerm = useDebounce(term?.term, 500);
  const { data, loading, error, page, setPage } = useSearch(debouncedTerm);

  const [show, setShow] = useState(false);
  const [activeLabel, setActiveLabel] = useState("All");
  const [showBorder, setShowBorder] = useState(false);

  const highlightText = (text, keyword) => {
    if (!text || !keyword) return text;

    const words = keyword.trim().split(/\s+/);

    const escapedWords = words.map((word) =>
      word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    );

    const regex = new RegExp(`(${escapedWords.join("|")})`, "gi");

    return text.split(regex).map((part, index) =>
      escapedWords.some((word) => word.toLowerCase() === part.toLowerCase()) ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  useEffect(() => {
    const closeDropdown = () => setShow(false);
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBorder(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="searchPage">
      {/* 🔹 Header */}
      <header className={`sP_header ${showBorder ? "headerBorder" : ""}`}>
        <div className="sP_logoWrapper">
          <Link to="/">
            <img
              className="sP_logo"
              src={
                theme === "dark"
                  ? "/scout-brand-dark.png"
                  : "/scout-brand-light.png"
              }
              alt="Scout logo"
            />
          </Link>
        </div>

        <div className="sP_headerBody">
          <Search showFeatures={false} inputValue={term?.term} />

          <button
            className="themeToggle"
            data-theme-toggle
            onMouseDown={(e) => e.preventDefault()}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </button>
        </div>
      </header>

      <div
        className={`sP_optionsWrapper ${showBorder ? "hideTabsBorder" : ""}`}
      >
        <nav className="sP_options">
          <div className="sP_optionsLeft">
            {searchPageOptionsLeft.map((label) => (
              <div
                className={`sP_option ${activeLabel === label ? "active" : ""}`}
                key={label}
                onClick={() => setActiveLabel(label)}
              >
                <Link to={label === "All" ? "/search" : ""}>{label}</Link>
              </div>
            ))}

            {/* <div className="sP_option_dropdown">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShow(!show);
                }}
                className="sP_option_dropdown_btn"
              >
                {show ? (
                  <ArrowDropUpIcon className="moreVertIcon" />
                ) : (
                  <ArrowDropDownIcon className="moreVertIcon" />
                )}

                <div>Discover</div>
              </button>

              {show && <Dropdown show={show} items={searchPageMore} />}
            </div> */}
          </div>

          {/* <div className="sP_optionsRight">
            {searchPageOptionsRight.map((label) => (
              <div className="sP_option" key={label}>
                <Link to={`/${label.toLowerCase()}`}>{label}</Link>
              </div>
            ))}
          </div> */}
        </nav>
      </div>

      {/* 🔹 Results */}
      {term?.term && (
        <>
          {activeLabel === "All" && (
            <div className="results">
              {loading ? (
                <>
                  {[...Array(6)].map((_, i) => (
                    <ResultSkeleton key={i} />
                  ))}
                </>
              ) : data?.items?.length ? (
                <>
                  <div className="resultsInfo">
                    <span>
                      About {data?.searchInformation?.formattedTotalResults}{" "}
                      results ({data?.searchInformation?.formattedSearchTime}{" "}
                      seconds)
                    </span>

                    <Tooltip
                      title="Powered by Google Programmable Search"
                      arrow
                      placement="right"
                      slotProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "var(--surface-color)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "10px",
                            fontSize: "12px",
                            fontWeight: 500,
                            px: 1.2,
                            py: 0.8,
                            boxShadow: "0 4px 12px rgba(0,0,0,.08)",
                          },
                        },
                        arrow: {
                          sx: {
                            color: "var(--surface-color)",
                          },
                        },
                      }}
                    >
                      <span>
                        <InfoOutlinedIcon className="resultsInfoIcon" />
                      </span>
                    </Tooltip>
                  </div>

                  {data.items.map((item) => (
                    <div className="resultRow" key={item.link}>
                      {/* 🔹 Text Section */}
                      <div className="result">
                        <SiteInfo url={item.link} />

                        <div className="resultContent">
                          <a
                            className="resultTitle"
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {highlightText(item.title, debouncedTerm)}
                          </a>

                          <p className="resultSnippet">
                            {highlightText(item.snippet, debouncedTerm)}
                          </p>
                        </div>
                      </div>

                      {/* 🔹 Thumbnail */}
                      <ResultThumbnail item={item} />
                    </div>
                  ))}

                  {data?.items?.length > 0 && (
                    <Pagination
                      page={page}
                      setPage={setPage}
                      totalPages={10}
                      hasPreviousPage={!!data?.queries?.previousPage}
                      hasNextPage={!!data?.queries?.nextPage}
                    />
                  )}
                </>
              ) : (
                <EmptySearchState term={debouncedTerm} />
              )}
            </div>
          )}

          {activeLabel === "Photos" && <Photos term={debouncedTerm} />}
        </>
      )}
    </div>
  );
}

export default SearchPage;
