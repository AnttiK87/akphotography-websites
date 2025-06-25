import { QueryInterface } from 'sequelize';

export async function up({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.removeConstraint('pictures', 'fk_text_id');

  await context.addConstraint('pictures', {
    fields: ['text_id'],
    type: 'foreign key',
    name: 'fk_text_id',
    references: {
      table: 'texts',
      field: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
}

export async function down({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.removeConstraint('pictures', 'fk_text_id');

  await context.addConstraint('pictures', {
    fields: ['text_id'],
    type: 'foreign key',
    name: 'fk_text_id',
    references: {
      table: 'texts',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
}
