import React, { useState, useEffect, useRef } from "react";
import "./Search.css";
import { useNavigate } from "react-router-dom";
import { useStateValue } from "../../context/StateProvider";
import useVoiceSearch from "../../hooks/useVoiceSearch";
import { actionTypes } from "../../context/searchReducer";
import SearchInput from "./SearchInput";
import SearchSuggestions from "./SearchSuggestions";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import KeyboardRoundedIcon from "@mui/icons-material/KeyboardRounded";

function Search({
  inputValue,
  showFeatures = true,
  className = "",
  showMobileLogo = false,
}) {
  const { term, dispatch } = useStateValue();
  const [input, setInput] = useState(inputValue || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const navigate = useNavigate();

  const { transcript, isListening, startListening } = useVoiceSearch();

  const recentSearches =
    JSON.parse(localStorage.getItem("recentSearches")) || [];

  useEffect(() => {
    if (!transcript) return;

    setInput(transcript);

    dispatch({
      type: actionTypes.SET_SEARCH_TERM,
      term: transcript,
    });

    navigate("/search");
  }, [transcript, dispatch, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ignore clicks on the theme toggle
      if (event.target.closest("[data-theme-toggle]")) {
        return;
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Ignore if user is already typing
      const activeElement = document.activeElement;
      const isTyping =
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.isContentEditable;

      if (isTyping) return;

      if (e.key === "/") {
        e.preventDefault();

        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  const handleSuggestions = (value) => {
    setInput(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      return;
    }

    const filteredSuggestions = recentSearches.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase()),
    );

    setSuggestions(filteredSuggestions);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();

      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    }

    if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();

      const selectedSuggestion = suggestions[selectedIndex];

      setInput(selectedSuggestion);
      setShowSuggestions(false);
      setSelectedIndex(-1);

      dispatch({
        type: actionTypes.SET_SEARCH_TERM,
        term: selectedSuggestion,
      });

      navigate("/search");
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }

    if (!suggestions.length) return;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const updatedSearches = [
      trimmedInput,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== trimmedInput.toLowerCase(),
      ),
    ].slice(0, 5);

    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

    // Hide suggestions
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);

    dispatch({
      type: actionTypes.SET_SEARCH_TERM,
      term: trimmedInput,
    });

    navigate("/search");
  };

  const handleSuggestionClick = (value) => {
    setInput(value);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);

    dispatch({
      type: actionTypes.SET_SEARCH_TERM,
      term: value,
    });

    navigate("/search");
  };

  return (
    <form className={`search ${className}`} onSubmit={handleSearch}>
      <div
        className={`search_wrapper ${
          showSuggestions && suggestions.length > 0 ? "expanded" : ""
        }`}
        ref={searchRef}
      >
        <SearchInput
          input={input}
          handleSuggestions={handleSuggestions}
          handleKeyDown={handleKeyDown}
          startListening={startListening}
          isListening={isListening}
          inputRef={inputRef}
          showMobileLogo={showMobileLogo}
        />
        {showSuggestions && suggestions.length > 0 && (
          <SearchSuggestions
            suggestions={suggestions}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            onSuggestionClick={handleSuggestionClick}
          />
        )}
      </div>
      {showFeatures && (
        <div className="feature-pills-container">
          <div className="feature-pill">
            <BoltRoundedIcon className="pill-icon" fontSize="small" />
            <span className="pill-text">Fast Results</span>
          </div>

          <div className="feature-pill">
            <MicRoundedIcon className="pill-icon" fontSize="small" />
            <span className="pill-text">Voice Search</span>
          </div>

          <div className="feature-pill">
            <KeyboardRoundedIcon className="pill-icon" fontSize="small" />
            <span className="pill-text">Keyboard Navigation</span>
          </div>
        </div>
      )}
    </form>
  );
}

export default Search;
