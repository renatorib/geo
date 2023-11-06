import { parsePathData } from "./path";

type GetViewboxOfPathProps = {
  aspectRatio?: false | number;
  fit?: "contain";
  margin?: number;
};

/**
 * Returns the svg viewBox that zoom and centers respective  path string data.
 * pathData can also be an array of paths.
 * @example
 * const { viewbox } = getViewboxOfPath("m 495.77175,326.8484 -0.171,0.073 0.007,-0.084 0.042,-0.046 0.054,-0.022 0.063,0.037 z");
 * console.log(viewbox); // 495.51525 326.7314 0.3419999999999703 0.22799999999998022
 */
export const getViewboxOfPath = (
  pathData: string | string[],
  { aspectRatio = false, fit = "contain", margin = 0.5 }: GetViewboxOfPathProps = {},
) => {
  const points = { x: new Set<number>(), y: new Set<number>() };

  [pathData].flat(2).forEach((path) => {
    const pointer = { x: 0, y: 0 };
    const data = parsePathData(path);

    for (const { command, args } of data) {
      switch (command) {
        // Move absolute
        case "M": {
          pointer.x = args[0];
          pointer.y = args[1];
          break;
        }
        // Move relative
        case "m": {
          pointer.x += args[0];
          pointer.y += args[1];
          break;
        }
        // Lineto absolute
        case "L": {
          pointer.x = args[0];
          pointer.y = args[1];
          break;
        }
        // Lineto relative
        case "l": {
          pointer.x += args[0];
          pointer.y += args[1];
          break;
        }
        // Horizontal Lineto absolute
        case "H": {
          pointer.x = args[0];
          break;
        }
        // Horizontal Lineto relative
        case "h": {
          pointer.x += args[0];
          break;
        }
        // Vertical Lineto absolute
        case "V": {
          pointer.y = args[0];
          break;
        }
        // Vertical Lineto relative
        case "v": {
          pointer.y += args[0];
          break;
        }
        // Curveto absolute
        case "C": {
          pointer.x = args[4];
          pointer.y = args[5];
          break;
        }
        // Curveto relative
        case "c": {
          pointer.x += args[4];
          pointer.y += args[5];
          break;
        }
        // Smooth curveto absolute
        case "S": {
          pointer.x = args[2];
          pointer.y = args[3];
          break;
        }
        // Smooth curveto relative
        case "s": {
          pointer.x += args[2];
          pointer.y += args[3];
          break;
        }
        // Quadric bezier absolute
        case "Q": {
          pointer.x = args[2];
          pointer.y = args[3];
          break;
        }
        // Quadric bezier relative
        case "q": {
          pointer.x += args[2];
          pointer.y += args[3];
          break;
        }
        // Smooth quadric bezier absolute
        case "T": {
          pointer.x = args[0];
          pointer.y = args[1];
          break;
        }
        // Smooth quadric bezier relative
        case "t": {
          pointer.x += args[0];
          pointer.y += args[1];
          break;
        }
        // elliptical arc absolute
        case "A": {
          pointer.x = args[5];
          pointer.y = args[6];
          break;
        }
        // elliptical arc relative
        case "a": {
          pointer.x += args[5];
          pointer.y += args[6];
          break;
        }
      }

      // Snapshot (save current pointer as a new point)
      points.x.add(pointer.x);
      points.y.add(pointer.y);
    }
  });

  const boundary = {
    x: [Math.min(...points.x), Math.max(...points.x)],
    y: [Math.min(...points.y), Math.max(...points.y)],
  };

  const width = boundary.x[1] - boundary.x[0];
  const height = boundary.y[1] - boundary.y[0];

  /**
   * Prepare output & postprocessing
   */

  let viewboxX = boundary.x[0];
  let viewboxY = boundary.y[0];
  let viewboxHeight = height;
  let viewboxWidth = width;

  // Object contain
  if (fit === "contain" && aspectRatio) {
    if (width / height > aspectRatio) {
      viewboxHeight = width / aspectRatio;
      viewboxY = viewboxY - (viewboxHeight - height) / 2;
    } else if (width / height < aspectRatio) {
      viewboxWidth = height * aspectRatio;
      viewboxX = viewboxX - (viewboxWidth - width) / 2;
    }
  }

  // Add margins
  if (margin !== 0) {
    const offsetWidth = viewboxWidth * margin;
    const offsetHeight = viewboxHeight * margin;
    viewboxX -= offsetWidth / 2;
    viewboxY -= offsetHeight / 2;
    viewboxWidth += offsetWidth;
    viewboxHeight += offsetHeight;
  }

  const viewbox = `${viewboxX} ${viewboxY} ${viewboxWidth} ${viewboxHeight}`;

  return {
    boundary,
    viewboxX,
    viewboxY,
    viewboxHeight,
    viewboxWidth,
    viewbox,
  };
};

export type Viewbox = ReturnType<typeof getViewboxOfPath>;
