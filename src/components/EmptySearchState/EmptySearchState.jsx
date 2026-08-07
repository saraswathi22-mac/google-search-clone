import { useNavigate } from "react-router-dom";
import { exploreTopics } from "../../constants";
import { useStateValue } from "../../context/StateProvider";
import { actionTypes } from "../../context/searchReducer";
import "./EmptySearchState.css";

function EmptySearchState({ term }) {
  const { dispatch } = useStateValue();
  const navigate = useNavigate();

  const handleTopicClick = (topic) => {
    dispatch({
      type: actionTypes.SET_SEARCH_TERM,
      term: topic,
    });

    navigate("/search");
  };

  return (
    <div className="emptySearchState">
      <div className="emptySearchIcon">🔍</div>

      <h2>No results found for "{term}"</h2>

      <p>
        Check the spelling or try different keywords, or explore one of the
        topics below.
      </p>

      <div className="topicsWrapper">
        {exploreTopics.map((topic) => (
          <button
            key={topic}
            className="topicChip"
            onClick={() => handleTopicClick(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmptySearchState;
