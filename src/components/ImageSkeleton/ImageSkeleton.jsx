import "./ImageSkeleton.css";

const ImageSkeleton = ({ count = 12 }) => {
  return (
    <div className="image-skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="image-skeleton-card">
          <div className="image-skeleton-thumbnail shimmer"></div>

          <div className="image-skeleton-title shimmer"></div>

          <div className="image-skeleton-subtitle shimmer"></div>
        </div>
      ))}
    </div>
  );
};

export default ImageSkeleton;
