import { useEffect, useRef } from "react";
import { useImageSearch } from "../../hooks/useImageSearch";
import "./Photos.css";

function Photos({ term }) {
  const { images, loading, error, loadMore } = useImageSearch(term);
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        threshold: 1,
      },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  if (loading && images.length === 0) {
    return <p>Loading images...</p>;
  }
  if (error) return <p>{error}</p>;

  return (
    <div className="photos">
      {images.map((image, index) => (
        <a
          key={`${image.link}-${index}`}
          href={image.image.contextLink}
          target="_blank"
          rel="noopener noreferrer"
          className="photoCard"
        >
          <img
            src={image.link}
            alt={image.title}
            className="photoImage"
            loading="lazy"
            onError={(e) => {
              e.target.src = image.image.thumbnailLink;
            }}
          />

          <p className="photoTitle">{image.title}</p>
        </a>
      ))}

      {loading && <p className="loadingMore">Loading more images...</p>}

      <div ref={loaderRef}></div>
    </div>
  );
}

export default Photos;
