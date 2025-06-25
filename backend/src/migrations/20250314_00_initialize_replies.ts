import { QueryInterface, DataTypes, fn } from 'sequelize';

export async function up({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.createTable('replies', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reply: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    picture_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: fn('NOW'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: fn('NOW'),
    },
  });

  await context.addColumn('comments', 'reply_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  await context.addConstraint('comments', {
    fields: ['reply_id'],
    type: 'foreign key',
    name: 'fk_reply_id',
    references: {
      table: 'replies',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  await context.addColumn('replies', 'comment_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  await context.addConstraint('replies', {
    fields: ['comment_id'],
    type: 'foreign key',
    name: 'fk_reply_comment_id',
    references: {
      table: 'comments',
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
  await context.removeConstraint('comments', 'fk_reply_id');
  await context.removeColumn('comments', 'reply_id');
  await context.removeConstraint('replies', 'fk_reply_comment_id');
  await context.removeColumn('replies', 'comment_id');
  await context.dropTable('replies');
}
