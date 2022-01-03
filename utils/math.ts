const sum = (numbers: number[]) => {
  return numbers.reduce((a, b) => a + b, 0);
};

const mean = (numbers: number[]) => {
  return sum(numbers) / numbers.length;
};

const stdev = (numbers: number[]) => {
  const avg = mean(numbers);
  const variance =
    sum(numbers.map((x: number) => (x - avg) ** 2)) / numbers.length - 1;

  return Math.sqrt(variance);
};

export { sum, mean, stdev };
