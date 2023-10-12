export const onNextPaint = <Cb extends (...args: any[]) => any>(cb: Cb) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cb();
    });
  });
};
