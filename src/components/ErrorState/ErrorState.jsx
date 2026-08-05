import "./ErrorState.css";

function ErrorState({ onRetry }) {
  return (
    <div className="error-state">
      <span className="error-icon">⚠️</span>

      <h2>Couldn't load images</h2>

      <p>Something went wrong while fetching images.</p>

      <button onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}

export default ErrorState;