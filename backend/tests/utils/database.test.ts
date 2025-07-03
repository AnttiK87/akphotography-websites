import { sequelize } from '../../src/utils/db.js';
import { QueryTypes } from 'sequelize';

describe('test db connection and correct structure', () => {
  test('Test if there is connection to db', async () => {
    const dbName = sequelize.getDatabaseName();
    expect(dbName).toBe('test_akphotographyDB');

    const rows = await sequelize.query<{ test: number }>('SELECT 1 as test', {
      type: QueryTypes.SELECT,
    });
    expect(rows[0].test).toBe(1);
  });

  const expectedTables = [
    'comments',
    'keywords',
    'migrations',
    'pictures',
    'picture_keywords',
    'ratings',
    'replies',
    'sessions',
    'texts',
    'users',
  ];

  test('All expected tables exist', async () => {
    const tables = await sequelize.query<{ [key: string]: string }>(
      'SHOW TABLES',
      { type: QueryTypes.SELECT },
    );
    const tableNames = tables.map((row) => Object.values(row)[0]);
    const missing = expectedTables.filter((t) => !tableNames.includes(t));
    expect(missing).toEqual([]); // eli ei puutu mitään
  });

  test('Table users contains default admin user', async () => {
    const rows = await sequelize.query<{ username: string }>(
      'SELECT * FROM users WHERE username = "admin"',
      { type: QueryTypes.SELECT },
    );

    expect(rows.length).toBe(1);
    expect(rows[0].username).toBe('admin');
  });

  test('users-table contains corret columns', async () => {
    const columns = await sequelize.query('DESCRIBE users', {
      type: QueryTypes.DESCRIBE,
    });

    const expected = {
      id: { type: 'INT', allowNull: false },
      name: { type: 'VARCHAR(255)', allowNull: false },
      username: { type: 'VARCHAR(255)', allowNull: false },
      email: { type: 'VARCHAR(255)', allowNull: false },
      password_hash: { type: 'VARCHAR(255)', allowNull: false },
      role: { type: 'VARCHAR(255)', allowNull: false },
      last_login: { type: 'DATETIME', allowNull: true },
      login_time: { type: 'DATETIME', allowNull: true },
    };

    for (const [columnName, { type, allowNull }] of Object.entries(expected)) {
      expect(columns[columnName]).toBeDefined();
      expect(columns[columnName].type).toContain(type);
      expect(columns[columnName].allowNull).toBe(allowNull);
    }
  });

  test('pictures-table contains corret columns', async () => {
    const columns = await sequelize.query('DESCRIBE pictures', {
      type: QueryTypes.DESCRIBE,
    });

    const expected = {
      id: { type: 'INT', allowNull: false },
      file_name: { type: 'VARCHAR(255)', allowNull: false },
      url: { type: 'VARCHAR(255)', allowNull: false },
      height: { type: 'INT', allowNull: false },
      width: { type: 'INT', allowNull: false },
      type: { type: 'VARCHAR(255)', allowNull: false },
      month_year: { type: 'INT', allowNull: true },
      uploaded_at: { type: 'DATETIME', allowNull: false },
      text_id: { type: 'INT', allowNull: true },
      rating_id: { type: 'INT', allowNull: true },
      comment_id: { type: 'INT', allowNull: true },
      view_count: { type: 'INT', allowNull: false },
      url_thumbnail: { type: 'VARCHAR(255)', allowNull: true },
    };

    for (const [columnName, { type, allowNull }] of Object.entries(expected)) {
      expect(columns[columnName]).toBeDefined();
      expect(columns[columnName].type).toContain(type);
      expect(columns[columnName].allowNull).toBe(allowNull);
    }
  });
});
