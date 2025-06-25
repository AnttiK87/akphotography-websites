import { QueryInterface, DataTypes } from 'sequelize';

export async function up({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.removeColumn('texts', 'text_fi');
  await context.removeColumn('texts', 'text_en');

  await context.addColumn('texts', 'text_fi', {
    type: DataTypes.TEXT,
    allowNull: true,
  });

  await context.addColumn('texts', 'text_en', {
    type: DataTypes.TEXT,
    allowNull: true,
  });
}

export async function down({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.removeColumn('texts', 'text_fi');
  await context.removeColumn('texts', 'text_en');

  await context.addColumn('texts', 'text_fi', {
    type: DataTypes.TEXT,
    allowNull: false,
  });

  await context.addColumn('texts', 'text_en', {
    type: DataTypes.TEXT,
    allowNull: false,
  });
}
