import { useEffect, useRef, useState } from "react";
import { useImageSearch } from "../../hooks/useImageSearch";
import ImageSkeleton from "../ImageSkeleton/ImageSkeleton";
import "./Photos.css";
import ErrorState from "../ErrorState/ErrorState";
import EmptyState from "../EmptyState/EmptyState";

function Photos({ term }) {
  const { images, loading, error, canLoadMore, loadMore, retry, showMore } =
    useImageSearch(term);

  const loaderRef = useRef(null);

  useEffect(() => {
    if (!canLoadMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          loadMore();
        }
      },
      { threshold: 1 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, loading, canLoadMore]);

  if (loading && images.length === 0) {
    return <ImageSkeleton />;
  }

  if (error && images.length === 0) {
    return <ErrorState onRetry={retry} />;
  }

  if (!loading && images.length === 0) {
    return <EmptyState />;
  }

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

      {loading && images.length > 0 && <ImageSkeleton count={4} />}

      {!canLoadMore && (
        <div className="loadMorePrompt">
          <p>Want to explore more images?</p>

          <button className="showMoreBtn" onClick={showMore}>
            Show More
          </button>
        </div>
      )}

      {canLoadMore && <div ref={loaderRef} />}
    </div>
  );
}

export default Photos;
