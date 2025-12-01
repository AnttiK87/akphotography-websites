import { QueryInterface } from 'sequelize';

export async function up({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.sequelize.query(`
      ALTER DATABASE \`${process.env.MYSQL_DATABASE}\`
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci;
    `);
}

export async function down({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.sequelize.query(`
      ALTER DATABASE \`${process.env.MYSQL_DATABASE}\`
      CHARACTER SET utf8
      COLLATE utf8_general_ci;
    `);
}
