export function mockRequest<T>(data: T, opts?: { fail?: boolean; delayMs?: [number, number] }): Promise<T> {
  const [min, max] = opts?.delayMs ?? [400, 900];
  const delay = Math.floor(Math.random() * (max - min)) + min;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (opts?.fail) {
        reject({ response: { data: { error: { code: 'MOCK_ERROR', message: 'Simulated failure' } } } });
      } else {
        resolve(data);
      }
    }, delay);
  });
}
