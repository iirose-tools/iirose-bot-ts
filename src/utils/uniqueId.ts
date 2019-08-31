export const uniqueId = () => {
  return (
    new Date()
      .getTime()
      .toString()
      .substr(-5) +
    Math.random()
      .toString()
      .substr(-7)
  );
};
