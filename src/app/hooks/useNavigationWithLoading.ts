"use client";

import { useRouter } from "next/navigation";
import { useLoading } from "../contexts/LoadingContext";
import { useCallback } from "react";

export const useNavigationWithLoading = () => {
  const router = useRouter();
  const { setLoading } = useLoading();

  const navigateWithLoading = useCallback(
    (path: string, delay: number = 300) => {
      setLoading(true);
      
      let isMounted = true;

      const timer = setTimeout(() => {
        if (!isMounted) return;
        
        router.push(path);
        const navigationTimer = setTimeout(() => {
          if (isMounted) {
            setLoading(false);
          }
        }, 500);

        return () => clearTimeout(navigationTimer);
      }, delay > 0 ? delay : 0);

      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    },
    [router, setLoading]
  );

  return { navigateWithLoading };
};

