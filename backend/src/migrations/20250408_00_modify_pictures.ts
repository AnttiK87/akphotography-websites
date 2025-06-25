import { QueryInterface, DataTypes } from 'sequelize';

export async function up({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.addColumn('pictures', 'url_thumbnail', {
    type: DataTypes.STRING,
    allowNull: true,
  });
}

export async function down({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.removeColumn('pictures', 'url_thumbnail');
}
