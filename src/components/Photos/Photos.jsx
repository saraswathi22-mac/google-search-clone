import { useImageSearch } from "../../hooks/useImageSearch";
import "./Photos.css";

function Photos({ term }) {
  const { images, loading, error } = useImageSearch(term);

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="photos">
      {images.map((image) => (
        <a
          key={image.link}
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
    </div>
  );
}

export default Photos;
