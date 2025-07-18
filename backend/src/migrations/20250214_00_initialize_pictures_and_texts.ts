import { QueryInterface, DataTypes, fn } from 'sequelize';

export async function up({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.createTable('pictures', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    month_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: fn('NOW'),
    },
  });

  await context.createTable('texts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text_fi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    text_en: {
      type: DataTypes.TEXT,
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

  await context.addColumn('pictures', 'text_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

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

  await context.addColumn('texts', 'picture_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
  await context.addConstraint('texts', {
    fields: ['picture_id'],
    type: 'foreign key',
    name: 'fk_picture_id',
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
  await context.removeConstraint('pictures', 'fk_text_id');
  await context.removeColumn('pictures', 'text_id');

  await context.removeConstraint('texts', 'fk_picture_id');
  await context.removeColumn('texts', 'picture_id');

  await context.dropTable('pictures');
  await context.dropTable('texts');
}
