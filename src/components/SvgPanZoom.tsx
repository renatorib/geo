import React from "react";

import { useViewportSize } from "@mantine/hooks";
import { ReactSVGPanZoom, Value, TOOL_PAN } from "react-svg-pan-zoom";

import { setStyle } from "~/lib/dom";

export type { Value, ReactSVGPanZoom };

type ReactSVGPanZoomProps = React.ComponentProps<typeof ReactSVGPanZoom>;

type SvgPanZoomProps = {
  onLoad?: (instance: ReactSVGPanZoom) => any;
  onRef?: (instance: ReactSVGPanZoom) => any;
  children: ReactSVGPanZoomProps["children"];
} & Partial<ReactSVGPanZoomProps>;

export const SvgPanZoom = (props: SvgPanZoomProps) => {
  const Viewer = React.useRef<ReactSVGPanZoom | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [value, setValue] = React.useState<Value>();
  const { width, height } = useViewportSize();
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (Viewer.current && !loaded) {
      props.onLoad?.(Viewer.current);
      setLoaded(true);
    }
  }, [Viewer.current]);

  return (
    <div ref={wrapperRef}>
      <ReactSVGPanZoom
        ref={(ref) => {
          Viewer.current = ref;
          if (ref) props.onRef?.(ref);
        }}
        width={width}
        height={height - 50}
        value={value ?? ({} as any)}
        tool={TOOL_PAN}
        onChangeTool={() => {}}
        scaleFactorOnWheel={1.15}
        background="#f9f9f9"
        SVGBackground="#f9f9f9"
        customToolbar={() => null}
        customMiniature={() => null}
        {...props}
        onChangeValue={(value) => {
          setValue(value);
          setStyle(wrapperRef!.current!, {
            "--viewer-zoom": value.a,
            // "--viewer-x": value.e,
            // "--viewer-y": value.f,
          });
          props.onChangeValue?.(value);
        }}
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 300ms ease-in-out",
          willChange: "opacity",
          ...props.style,
        }}
      />
    </div>
  );
};
