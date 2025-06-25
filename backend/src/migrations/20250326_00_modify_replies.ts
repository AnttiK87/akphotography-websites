import { QueryInterface, DataTypes } from 'sequelize';

export async function up({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.addColumn('replies', 'admin_reply', {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  });
}

export async function down({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.removeColumn('replies', 'admin_reply');
}
