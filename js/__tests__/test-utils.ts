export function expectArrayEqual<T extends Iterable<number>, U extends Iterable<number>>(
  actual: T, expected: U
): void {
  const actualArray = [...actual];
  const expectedArray = [...expected];
  expect(actualArray.length).toBe(expectedArray.length);
  for (let i = 0; i < expectedArray.length; ++i) {
    expect(actualArray[i]).toBeCloseTo(expectedArray[i]);
  }
}
