import React from "react";

export const useAnimateEffect = (keyframes: Keyframe[], options?: KeyframeAnimationOptions) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const animate = () => {
    if (ref.current && "animate" in ref.current) {
      ref.current.animate(keyframes, {
        duration: 500,
        easing: "ease-in-out",
        iterations: 1,
        fill: "backwards",
        ...options,
      });
    }
  };

  return {
    animate,
    ref,
    UI: (props: React.ComponentProps<"div">) => <div ref={ref} {...props} />,
  };
};
