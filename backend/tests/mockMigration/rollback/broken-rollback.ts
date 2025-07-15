// migration for testing purposes. It simulates a rollback failure.
export const up = () => {};

export const down = () => {
  throw new Error('Simulated migration failure');
};
