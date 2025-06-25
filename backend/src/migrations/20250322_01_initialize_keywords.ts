import { QueryInterface, DataTypes } from 'sequelize';

export async function up({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.createTable('keywords', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    keyword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  await context.createTable('picture_keywords', {
    picture_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pictures',
        key: 'id',
      },
      onDelete: 'CASCADE',
      primaryKey: true,
    },
    keyword_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'keywords',
        key: 'id',
      },
      onDelete: 'CASCADE',
      primaryKey: true,
    },
  });
}

export async function down({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.dropTable('picture_keywords');
  await context.dropTable('keywords');
}
