const sum = (numbers: number[]) => {
  return numbers.reduce((a, b) => a + b, 0);
};

const mean = (numbers: number[]) => {
  return sum(numbers) / numbers.length;
};

const stdev = (numbers: number[]) => {
  const m = mean(numbers);
  const arr = numbers.map((x) => (x - m) ** 2);
  const variance = sum(arr) / (numbers.length - 1);

  return Math.sqrt(variance);
};

export { sum, mean, stdev };
