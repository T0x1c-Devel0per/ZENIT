import { useEffect, useState } from 'react';

/**
 * Hook para detectar si el elemento es visible en el viewport
 */
export function useInView<T extends HTMLElement>(threshold = 0.1) {
  const [ref, setRef] = useState<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold]);

  return { setRef, isInView } as const;
}
