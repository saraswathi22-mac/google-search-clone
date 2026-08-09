import { useState, useEffect } from "react";
import { API_KEY, CONTEXT_KEY } from "../config";

const BATCH_SIZE = 30;
const PAGE_SIZE = 10;

export const useImageSearch = (term) => {
  const [images, setImages] = useState([]);
  const [start, setStart] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [canLoadMore, setCanLoadMore] = useState(true);
  const [nextPauseAt, setNextPauseAt] = useState(BATCH_SIZE);

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

  // Reset when search term changes
  useEffect(() => {
    setImages([]);
    setStart(1);
    setCanLoadMore(true);
    setNextPauseAt(BATCH_SIZE);
  }, [term]);

  // Fetch when search term or pagination changes
  useEffect(() => {
    fetchImages();
  }, [term, start]);

  // Pause infinite scroll after each 20-image batch
  useEffect(() => {
    if (images.length >= nextPauseAt) {
      setCanLoadMore(false);
    }
  }, [images.length, nextPauseAt]);

  // Called by IntersectionObserver
  const loadMore = () => {
    if (!canLoadMore || loading) return;

    setStart((prev) => prev + PAGE_SIZE);
  };

  // Called by Show More button
  const showMore = () => {
    setNextPauseAt((prev) => prev + BATCH_SIZE);
    setCanLoadMore(true);
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