import { QueryInterface, DataTypes } from 'sequelize';

export async function up({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.addColumn('replies', 'parent_reply_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  await context.addConstraint('replies', {
    fields: ['parent_reply_id'],
    type: 'foreign key',
    name: 'fk_parent_reply_id',
    references: {
      table: 'replies',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
}

export async function down({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.removeConstraint('replies', 'fk_parent_reply_id');
  await context.removeColumn('replies', 'parent_reply_id');
}
