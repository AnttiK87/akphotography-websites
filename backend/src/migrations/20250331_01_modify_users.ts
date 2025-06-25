import { QueryInterface, DataTypes } from 'sequelize';

export async function up({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.addColumn('users', 'last_login', {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  });
}

export async function down({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.removeColumn('users', 'last_login');
}
