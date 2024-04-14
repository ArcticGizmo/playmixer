export const chunk = <T>(arr: T[], size: number) => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    const c = arr.slice(i, i + size);
    if (c.length === size) {
      chunks.push(c);
    }
  }

  return chunks;
};

export const chunkUneven = <T>(arr: T[], maxSize: number) => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += maxSize) {
    const c = arr.slice(i, i + maxSize);
    chunks.push(c);
  }

  return chunks;
};
