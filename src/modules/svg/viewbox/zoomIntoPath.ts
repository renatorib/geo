import { parsePathData } from "../path";

export const zoomIntoPath = (pathData: string, aspectRatio = 45 / 30) => {
  const data = parsePathData(pathData);
  const points = { x: new Set<number>(), y: new Set<number>() };
  const pointer = { x: 0, y: 0 };

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

  let bounds = {
    x: [Math.min(...points.x), Math.max(...points.x)],
    y: [Math.min(...points.y), Math.max(...points.y)],
  };
  let width = bounds.x[1] - bounds.x[0];
  let height = bounds.y[1] - bounds.y[0];

  // Output

  let viewboxX = bounds.x[0];
  let viewboxY = bounds.y[0];
  let viewboxHeight = height;
  let viewboxWidth = width;

  // Object contain
  if (width / height > aspectRatio) {
    viewboxHeight = width / aspectRatio;
    viewboxY = viewboxY - (viewboxHeight - height) / 2;
  } else if (width / height < aspectRatio) {
    viewboxWidth = height * aspectRatio;
    viewboxX = viewboxX - (viewboxWidth - width) / 2;
  }

  // Add margins
  const MARGIN = 0.5;
  const offsetWidth = viewboxWidth * MARGIN;
  const offsetHeight = viewboxHeight * MARGIN;
  viewboxX -= offsetWidth / 2;
  viewboxY -= offsetHeight / 2;
  viewboxWidth += offsetWidth;
  viewboxHeight += offsetHeight;

  const viewbox = `${viewboxX} ${viewboxY} ${viewboxWidth} ${viewboxHeight}`;

  return {
    viewboxX,
    viewboxY,
    viewboxHeight,
    viewboxWidth,
    viewbox,
  };
};
