import { useState, useEffect } from "react";
import { API_KEY, CONTEXT_KEY } from "../config";

export const useImageSearch = (term) => {
  const [images, setImages] = useState([]);
  const [start, setStart] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const fetchImages = async () => {
    if (!term) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CONTEXT_KEY}&q=${encodeURIComponent(
          term,
        )}&searchType=image&start=${start}`,
      );

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const result = await res.json();
      setImages((prev) => {
        const existing = new Set(prev.map((img) => img.link));

        const newImages = (result.items || []).filter(
          (img) => !existing.has(img.link),
        );

        return [...prev, ...newImages];
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setImages([]);
    setStart(1);
    setCanLoadMore(true);
  }, [term]);

  useEffect(() => {
    fetchImages();
  }, [term, start]);

  const loadMore = () => {
    if (!canLoadMore || loading) return;

    if (images.length > 0 && images.length % 20 === 0) {
      setCanLoadMore(false);
      return;
    }

    setStart((prev) => prev + 10);
  };

  const showMore = () => {
    setCanLoadMore(true);
    setStart((prev) => prev + 10);
  };

  return {
    images,
    loading,
    error,
    canLoadMore,
    loadMore,
    retry: fetchImages,
    showMore,
  };
};
