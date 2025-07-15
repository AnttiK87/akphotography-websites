// migration for testing purposes. It simulates a migration failure.

export const up = () => {
  throw new Error('Simulated migration failure');
};
