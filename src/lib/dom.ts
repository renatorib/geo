export const onNextPaint = <Cb extends (...args: any[]) => any>(cb: Cb) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cb();
    });
  });
};

export const setInputValue = <T extends HTMLInputElement | HTMLTextAreaElement>(
  input: T | undefined | null,
  value: string,
) => {
  if (input) {
    const setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    setValue?.call(input, value);

    const event = new Event("input", { bubbles: true });
    input.dispatchEvent(event);
  }
};
