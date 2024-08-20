import React from "react";

import { ReactSVGPanZoom, Value, TOOL_PAN } from "react-svg-pan-zoom";

import { onNextPaint, setStyle } from "~/lib/dom";
import { Viewbox } from "~/lib/svg";

export type { Value, ReactSVGPanZoom };

type ReactSVGPanZoomProps = React.ComponentProps<typeof ReactSVGPanZoom>;

type SvgPanZoomProps = {
  onLoad?: (instance: ReactSVGPanZoom) => any;
  onRef?: (instance: ReactSVGPanZoom) => any;
  children: ReactSVGPanZoomProps["children"];
  background?: string;
} & Partial<ReactSVGPanZoomProps>;

export const SvgPanZoom = (props: SvgPanZoomProps) => {
  const Viewer = React.useRef<ReactSVGPanZoom | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [value, setValue] = React.useState<Value>();
  const [loaded, setLoaded] = React.useState(false);
  const background = props.background ?? "#f9f9f9";

  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (wrapperRef.current) {
      const setSizes = () => {
        setWidth(wrapperRef.current?.clientWidth || 0);
        setHeight(wrapperRef.current?.clientHeight || 0);
      };
      setSizes();
      const interval = setInterval(setSizes, 100);
      wrapperRef.current.addEventListener("resize", setSizes);
      window.addEventListener("resize", setSizes);
      return () => {
        wrapperRef.current?.removeEventListener("resize", setSizes);
        window?.removeEventListener("resize", setSizes);
        clearInterval(interval);
      };
    }
  }, [wrapperRef.current]);

  React.useEffect(() => {
    if (Viewer.current && !loaded) {
      onNextPaint(() => {
        props.onLoad?.(Viewer.current!);
        setLoaded(true);
      });
    }
  }, [Viewer.current]);

  return (
    <div ref={wrapperRef} className="w-full h-full overflow-hidden">
      <ReactSVGPanZoom
        ref={(ref) => {
          Viewer.current = ref;
          if (ref) props.onRef?.(ref);
        }}
        value={value ?? ({} as any)}
        tool={TOOL_PAN}
        width={width}
        height={height}
        onChangeTool={() => {}}
        scaleFactorOnWheel={1.15}
        background={background}
        SVGBackground={background}
        customToolbar={() => null}
        customMiniature={() => null}
        scaleFactorMax={40}
        scaleFactorMin={0.3}
        {...props}
        onChangeValue={(value) => {
          setValue(value);
          wrapperRef.current &&
            setStyle(wrapperRef.current, {
              "--viewer-zoom": value.a,
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

SvgPanZoom.getZoomCoordinates = (vb: Viewbox, width: number, height: number, maxZoom = 40, minZoom = 2) => {
  const x = vb.viewboxX + vb.viewboxWidth / 2;
  const y = vb.viewboxY + vb.viewboxHeight / 2;
  const zoomY = (height - 50) / vb.viewboxHeight;
  const zoomX = width / vb.viewboxWidth;
  const zoom = Math.max(Math.min(zoomY, zoomX, maxZoom), minZoom);

  return { x, y, zoom };
};

SvgPanZoom.zoomOnViewbox = (viewer: ReactSVGPanZoom, vb: Viewbox, maxZoom = 40, minZoom = 2) => {
  const { x, y, zoom } = SvgPanZoom.getZoomCoordinates(vb, window.innerWidth, window.innerHeight, maxZoom, minZoom);
  viewer.setPointOnViewerCenter(x, y, zoom);
};
