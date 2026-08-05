import "./EmptyState.css";

function EmptyState() {
  return (
    <div className="empty-state">
      <span className="empty-icon">🖼️</span>

      <h2>No images found</h2>

      <p>Try searching with different keywords.</p>
    </div>
  );
}

export default EmptyState;