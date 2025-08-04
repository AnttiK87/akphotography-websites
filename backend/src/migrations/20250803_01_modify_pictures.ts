import { QueryInterface, DataTypes } from 'sequelize';

export async function up({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.addColumn('pictures', 'order', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: null,
  });
}

export async function down({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.removeColumn('pictures', 'order');
}
