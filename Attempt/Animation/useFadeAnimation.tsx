import { useEffect, useState } from "react";

export const useFadeAnimation = (fadeInDelay: number, fadeOutDelay: number) => {
  const [showComponent, setShowComponent] = useState(false);
  const [hideComponent, setHideComponent] = useState(false);

  useEffect(() => {
    // Show the component after `fadeInDelay` milliseconds
    const fadeInTimeout = setTimeout(() => {
      setShowComponent(true);
    }, fadeInDelay);

    // Hide the component after `fadeOutDelay` milliseconds
    const fadeOutTimeout = setTimeout(() => {
      setHideComponent(true);
    }, fadeInDelay + fadeOutDelay);

    // Cleanup the timeouts when the component unmounts
    return () => {
      clearTimeout(fadeInTimeout);
      clearTimeout(fadeOutTimeout);
    };
  }, [fadeInDelay, fadeOutDelay]);

  return { showComponent, hideComponent };
};