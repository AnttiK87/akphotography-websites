import { QueryInterface, DataTypes } from 'sequelize';

export async function up({ context }: { context: QueryInterface }) {
  const [results] = await context.sequelize.query(`
  SELECT keyword, COUNT(*) AS count
  FROM keywords
  GROUP BY keyword
  HAVING COUNT(*) > 1
`);

  if (results.length > 0) {
    throw new Error(
      'Duplicate keywords found. Resolve before applying unique constraint.',
    );
  }

  await context.changeColumn('keywords', 'keyword', {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  });
}

export async function down({ context }: { context: QueryInterface }) {
  await context.changeColumn('keywords', 'keyword', {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  });
}
