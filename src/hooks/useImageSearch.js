import { useState, useEffect } from "react";
import { API_KEY, CONTEXT_KEY } from "../config";

export const useImageSearch = (term) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!term) return;

    const fetchImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CONTEXT_KEY}&q=${encodeURIComponent(
            term,
          )}&searchType=image&start=1`,
        );

        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        setImages(result.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [term]);

  return {
    images,
    loading,
    error,
  };
};
