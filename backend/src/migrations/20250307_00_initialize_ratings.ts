import { QueryInterface, DataTypes, fn } from 'sequelize';

export async function up({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.createTable('ratings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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

  await context.addColumn('pictures', 'rating_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  await context.addConstraint('pictures', {
    fields: ['rating_id'],
    type: 'foreign key',
    name: 'fk_rating_id',
    references: {
      table: 'ratings',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  await context.addColumn('ratings', 'picture_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  await context.addConstraint('ratings', {
    fields: ['picture_id'],
    type: 'foreign key',
    name: 'fk_ratings_picture_id',
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
  await context.removeConstraint('pictures', 'fk_rating_id');
  await context.dropTable('ratings');
}
