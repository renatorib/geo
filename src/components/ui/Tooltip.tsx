import React from "react";

import * as Ariakit from "@ariakit/react";
import { isFragment } from "react-is";

import { fr } from "~/lib/react";
import { cn, contextColors, fontSizes, paddingsSize, radii, shadows, transitions } from "~/lib/styles";

export const variants = {
  light: "bg-context-200 text-context-800",
  filled: "bg-context-700 text-context-50",
  outline: "border bg-white border-context-200 text-context-800",
};

type TooltipProps = {
  variant?: keyof typeof variants;
  color?: keyof typeof contextColors;
  size?: keyof typeof fontSizes;
  shadow?: keyof typeof shadows;
  radius?: keyof typeof radii;
  padding?: keyof typeof paddingsSize;
  transition?: keyof typeof transitions;
  children: React.ReactNode;
  content?: React.ReactNode;
  showArrow?: boolean;
  followCursor?: boolean;
} & Ariakit.TooltipStoreProps;

export const TooltipDefaultProps = {
  variant: "filled",
  color: "slate",
  size: "xs",
  shadow: "none",
  radius: "sm",
  padding: "md",
  transition: "normal",
  placement: "top",
  timeout: 0,
  showArrow: true,
  followCursor: false,
} satisfies Partial<TooltipProps>;

export const Tooltip = fr<TooltipProps, typeof Ariakit.Tooltip>(
  (
    {
      children,
      content,
      variant = TooltipDefaultProps.variant,
      color = TooltipDefaultProps.color,
      size = TooltipDefaultProps.size,
      shadow = TooltipDefaultProps.shadow,
      radius = TooltipDefaultProps.radius,
      padding = TooltipDefaultProps.padding,
      transition = TooltipDefaultProps.transition,
      showArrow = TooltipDefaultProps.showArrow,
      placement = TooltipDefaultProps.placement,
      timeout = TooltipDefaultProps.timeout,
      followCursor = TooltipDefaultProps.followCursor,
      ...props
    },
    ref,
  ) => {
    const tooltip = Ariakit.useTooltipStore({
      animated: true,
      timeout,
      placement,
      ...props,
    });
    const [position, setPosition] = React.useState({ x: 0, y: 0 });

    const updatePosition = () => {
      const { popoverElement } = tooltip.getState();
      if (!popoverElement) return;

      Object.assign(popoverElement.style, {
        transform: `translate3d(${position.x}px, ${position.y + window.scrollY + 10}px, 0px)`,
      });
    };

    React.useEffect(() => {
      function onMouseMove({ clientX, clientY }: MouseEvent) {
        setPosition({ x: clientX, y: clientY });
        tooltip.render();
      }

      const { anchorElement } = tooltip.getState();

      if (anchorElement && followCursor) {
        anchorElement.addEventListener("mousemove", onMouseMove);
        return () => {
          anchorElement.removeEventListener("mousemove", onMouseMove);
        };
      }
    }, [tooltip.render, tooltip.getState, followCursor]);

    return (
      <>
        <Ariakit.TooltipAnchor
          store={tooltip}
          render={
            typeof children === "string" ||
            typeof children === "number" ||
            typeof children === "boolean" ||
            children == null ||
            isFragment(children) ? (
              <span>{children}</span>
            ) : (
              (children as any)
            )
          }
        />
        <Ariakit.Tooltip
          store={tooltip}
          gutter={2}
          ref={ref}
          updatePosition={followCursor ? updatePosition : undefined}
          className={cn(
            contextColors[color],
            variants[variant],
            fontSizes[size],
            shadows[shadow],
            radii[radius],
            paddingsSize[padding],
            transitions[transition],
            "opacity-0 transform -translate-y-1 data-[enter]:opacity-100 data-[enter]:translate-y-0",
            "max-h-[var(--popover-available-height,300px)] min-w-[var(--popover-anchor-width,auto)]",
          )}
        >
          {showArrow && !followCursor && <Ariakit.TooltipArrow key={color + variant} />}
          {content}
        </Ariakit.Tooltip>
      </>
    );
  },
);
