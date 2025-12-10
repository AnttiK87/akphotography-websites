import { QueryInterface, Op } from 'sequelize';

export async function up({ context }: { context: QueryInterface }) {
  await context.bulkInsert('ui_texts', [
    {
      key_name: 'hero_text_contact',
      screen: 'contact',
      language: 'fin',
      content: 'Ota yhteyttä',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'hero_text_contact',
      screen: 'contact',
      language: 'en',
      content: 'Contact me',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'headerContact',
      screen: 'contact',
      language: 'fin',
      content: 'Jäikö jokin askarruttamaan?',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'headerContact',
      screen: 'contact',
      language: 'en',
      content: 'Did anything leave you curious?',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textContact1',
      screen: 'contact',
      language: 'fin',
      content: 'Mikäli haluat tietää lisää ota yhteyttä:',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textContact1',
      screen: 'contact',
      language: 'en',
      content: 'If you want to know more contact me:',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textContact2',
      screen: 'contact',
      language: 'fin',
      content: 'Harrastevalokuvaaja',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textContact2',
      screen: 'contact',
      language: 'en',
      content: 'Hobbyist photographer',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textContact3',
      screen: 'contact',
      language: 'fin',
      content:
        'Voit myös lähettää viestin minulle oheisella yhteydenottolomakkeella.',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textContact3',
      screen: 'contact',
      language: 'en',
      content:
        'You can also send me a message using the contact form provided.',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down({ context }: { context: QueryInterface }) {
  await context.bulkDelete('ui_texts', {
    key_name: {
      [Op.in]: [
        'hero_text_contact',
        'headerContact',
        'textContact1',
        'textContact2',
        'textContact3',
      ],
    },
  });
}
