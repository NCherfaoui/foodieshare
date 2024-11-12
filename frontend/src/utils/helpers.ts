export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate = false
) => {
  let timeout: NodeJS.Timeout;
  let result: ReturnType<T>;

  const debounced = (...args: Parameters<T>) => {
    const later = () => {
      timeout = undefined;
      if (!immediate) {
        result = func(...args);
      }
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      result = func(...args);
    }

    return result;
  };

  debounced.cancel = () => {
    clearTimeout(timeout);
    timeout = undefined;
  };

  return debounced;
};

interface TimeRange {
  label: string;
  value: string;
}

export const timeRanges: TimeRange[] = [
  { label: "< 15 min", value: "0-15" },
  { label: "15-30 min", value: "15-30" },
  { label: "30-60 min", value: "30-60" },
  { label: "> 60 min", value: "60+" },
];

export const ingredientRanges = [
  { label: "1-5 ingrédients", value: "1-5" },
  { label: "6-10 ingrédients", value: "6-10" },
  { label: "Plus de 10", value: "10+" }
];