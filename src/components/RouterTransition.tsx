import { useRouter } from "next/router";
import React from "react";

export function RouterTransition() {
  const router = useRouter();

  React.useEffect(() => {
    const handleStart = (url: string) => {
      if (url !== router.asPath) {
        // startNavigationProgress();
      }
    };
    const handleComplete = () => {
      // resetNavigationProgress();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.asPath]); // eslint-disable-line

  return null;
}
