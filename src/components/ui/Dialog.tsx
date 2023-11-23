import React from "react";

import * as Ariakit from "@ariakit/react";
import { RiCloseLine } from "react-icons/ri";

import { cn, contextColors, radii, shadows, transitions } from "~/lib/styles";

import { Button } from "./Button";
import { ButtonIcon } from "./ButtonIcon";

export const variants = /* tw */ {
  white: {
    root: "bg-white",
  },
  filled: {
    root: "bg-current-700 text-current-50 [&_data-dialogtitle='true']:text-current-100",
  },
  light: {
    root: "bg-current-50 text-current-700",
  },
  none: {
    root: "",
  },
};

export const widths = /* tw */ {
  none: "",
  full: "w-full",
  fit: "w-fit",
  max: "w-max",
  min: "w-min",
  "2xl": "w-[1024px]",
  xl: "w-[768px]",
  lg: "w-[550px]",
  md: "w-[400px]",
  sm: "w-[320px]",
  xs: "w-[240px]",
};

export const paddings = /* tw */ {
  none: "p-0",
  xs: "p-1 md:p-2",
  sm: "p-2 md:p-3",
  md: "p-3 md:p-5",
  lg: "p-4 md:p-6",
  xl: "p-5 md:p-7",
  "2xl": "p-6 md:p-9",
};

type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onChange?: (open: boolean) => void;
  children?: React.ReactNode;

  variant?: keyof typeof variants;
  width?: keyof typeof widths;
  padding?: keyof typeof paddings;
  transition?: keyof typeof transitions;
  radius?: keyof typeof radii;
  shadow?: keyof typeof shadows;
  color?: keyof typeof contextColors;
} & Omit<React.ComponentProps<typeof Ariakit.Dialog>, "store" | "onChange">;

export const DialogDefaultProps = {
  variant: "white",
  width: "fit",
  padding: "md",
  transition: "normal",
  radius: "md",
  shadow: "md",
} satisfies DialogProps;

const DialogConfigContext = React.createContext<DialogProps>(DialogDefaultProps);
const useDialogConfig = () => {
  const config = React.useContext(DialogConfigContext);
  return { ...DialogDefaultProps, ...config };
};

export const Dialog = ({
  open,
  defaultOpen,
  onChange,
  children,

  variant = DialogDefaultProps.variant,
  width = DialogDefaultProps.width,
  padding = DialogDefaultProps.padding,
  transition = DialogDefaultProps.transition,
  radius = DialogDefaultProps.radius,
  shadow = DialogDefaultProps.shadow,
  color,

  ...props
}: DialogProps) => {
  const animated = transition !== "none";
  const dialog = Ariakit.useDialogStore({
    animated,
    open,
    defaultOpen,
    setOpen: onChange,
  });

  return (
    <DialogConfigContext.Provider value={{ variant, width, padding, transition, radius, shadow, color }}>
      <Ariakit.Dialog
        store={dialog}
        backdrop={<DialogBackdrop />}
        {...props}
        data-variant={variant}
        className={cn(
          "group fixed z-50 inset-3 m-auto h-fit max-h-[calc(100vh-2*0.75rem)]",
          "overflow-auto max-w-[calc(100vw-1.5rem)]",
          animated && "scale-90 opacity-0 data-[enter]:scale-100 data-[enter]:opacity-100",
          variants[variant].root,
          color && contextColors[color],
          widths[width],
          paddings[padding],
          transitions[transition],
          radii[radius],
          shadows[shadow],
          props.className,
        )}
      >
        <div className={cn("flex flex-col gap-4 relative")}>{children}</div>
      </Ariakit.Dialog>
    </DialogConfigContext.Provider>
  );
};

type DialogBackdropProps = {
  blur?: boolean;
} & React.ComponentProps<"div">;

export const DialogBackdropDefaultProps = {
  blur: true,
} satisfies DialogBackdropProps;

export const DialogBackdrop = React.forwardRef<React.ComponentRef<"div">, DialogBackdropProps>(
  ({ blur = DialogBackdropDefaultProps.blur, ...props }, ref) => {
    const { transition } = useDialogConfig();
    const animated = transition !== "none";
    return (
      <div
        ref={ref}
        {...props}
        style={{ zIndex: 50, ...props.style }}
        className={cn(
          "bg-slate-950/20 z-50 inset-0",
          animated
            ? cn("opacity-0 data-[enter]:opacity-100", blur && "backdrop-blur-0 data-[enter]:backdrop-blur-sm")
            : cn(blur && "backdrop-blur-sm"),
          transitions[transition],
          props.className,
        )}
      />
    );
  },
);

export const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof Ariakit.DialogHeading>,
  React.ComponentProps<typeof Ariakit.DialogHeading>
>((props, ref) => {
  return <Ariakit.DialogHeading ref={ref} {...props} className={cn("font-bold text-lg", props.className)} />;
});

export const DialogCloseButton = React.forwardRef<
  React.ComponentRef<typeof Ariakit.DialogDismiss>,
  React.ComponentProps<typeof ButtonIcon>
>((props, ref) => {
  return (
    <Ariakit.DialogDismiss
      ref={ref}
      render={
        <ButtonIcon variant="muted" {...props} className={cn("absolute top-0 right-0", props.className)}>
          <RiCloseLine />
        </ButtonIcon>
      }
    />
  );
});

export const DialogDismiss = React.forwardRef<
  React.ComponentRef<typeof Ariakit.DialogDismiss>,
  React.ComponentProps<typeof Button>
>((props, ref) => {
  return <Ariakit.DialogDismiss ref={ref} {...props} />;
});

export const DialogActions = React.forwardRef<React.ComponentRef<"div">, React.ComponentProps<"div">>((props, ref) => (
  <div ref={ref} {...props} className={cn("flex items-center justify-end gap-2", props.className)}></div>
));

Dialog.Backdrop = DialogBackdrop;
Dialog.Title = DialogTitle;
Dialog.CloseButton = DialogCloseButton;
Dialog.Dismiss = DialogDismiss;
Dialog.Actions = DialogActions;
