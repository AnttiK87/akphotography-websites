import { QueryInterface, DataTypes, fn } from 'sequelize';

export async function up({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.createTable('comments', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    comment: {
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

  await context.addColumn('pictures', 'comment_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  await context.addConstraint('pictures', {
    fields: ['comment_id'],
    type: 'foreign key',
    name: 'fk_comment_id',
    references: {
      table: 'comments',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  await context.addColumn('comments', 'picture_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  await context.addConstraint('comments', {
    fields: ['picture_id'],
    type: 'foreign key',
    name: 'fk_comments_picture_id',
    references: {
      table: 'pictures',
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
  await context.removeConstraint('pictures', 'fk_comment_id');
  await context.dropTable('comments');
}
