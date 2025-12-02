import { QueryInterface, DataTypes } from 'sequelize';

export async function up({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.addColumn('users', 'profile_picture', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '/images/about/profile-picture.jpg',
  });
}

export async function down({
  context,
}: {
  context: QueryInterface;
}): Promise<void> {
  await context.removeColumn('users', 'profile_picture');
}
