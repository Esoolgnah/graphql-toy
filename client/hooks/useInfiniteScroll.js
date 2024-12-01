import { useCallback, useEffect, useRef, useState } from 'react';

const useInfiniteScroll = (targetEl) => {
  const observerRef = useRef(null);
  const [intersecting, setIntersecting] = useState(false);

  const createObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const isIntersecting = entries.some((entry) => entry.isIntersecting);
          setIntersecting(isIntersecting);
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1,
        }
      );
    }
    return observerRef.current;
  }, []);

  useEffect(() => {
    const element = targetEl?.current;

    if (element) {
      const observer = createObserver();
      observer.observe(element);

      return () => {
        observer.unobserve(element);
      };
    }
  }, [targetEl, createObserver]);

  return intersecting;
};

export default useInfiniteScroll;
