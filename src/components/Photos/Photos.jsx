import { useImageSearch } from "../../hooks/useImageSearch";
import "./Photos.css";

function Photos({ term }) {
  const { images, loading, error } = useImageSearch(term);

  if (images.length > 0) {
    console.log(images[0].image.thumbnailLink);
  }

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="photos">
      {images.map((image) => (
        <div key={image.link} className="photoCard">
          <img
            src={image.image.thumbnailLink}
            alt={image.title}
            className="photoImage"
          />

          <p className="photoTitle">{image.title}</p>
        </div>
      ))}
    </div>
  );
}

export default Photos;
