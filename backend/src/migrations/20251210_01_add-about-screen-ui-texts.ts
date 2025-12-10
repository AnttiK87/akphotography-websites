import { QueryInterface, Op } from 'sequelize';

export async function up({ context }: { context: QueryInterface }) {
  await context.bulkInsert('ui_texts', [
    {
      key_name: 'hero_text_about',
      screen: 'about',
      language: 'fin',
      content: 'Kameran takana',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'hero_text_about',
      screen: 'about',
      language: 'en',
      content: 'Info about me',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'headerAbout',
      screen: 'about',
      language: 'fin',
      content: 'Matkani luontokuvauksen parissa',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'headerAbout',
      screen: 'about',
      language: 'en',
      content: 'My Journey into the Nature Photography',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textAbout1',
      screen: 'about',
      language: 'fin',
      content:
        'Moi! Olen Antti Kortelainen, valokuvauksen ja erityisesti luontokuvauksen intoilija Leppävirralta. Innostukseni kuvaamiseen syttyi toden teolla, kun hankin ensimmäisen kamerani, jossa oli mahdollisuus käyttää manuaaliasetuksia. Jo heti ensimmäisellä käyttökerralla itsenäisyyspäivänä 2018 otin kameran mukaan kävelylle — ja tuolla kävelyllä kohtasin viirupöllön ensimmäistä kertaa elämässäni. Onnistuin saamaan siitä kuvan! Kokemus oli selittämättömällä tavalla niin voimakas, että se vei minut täysin mukanaan. Viirupöllöä ei ole tuon kohtaamisen jälkeen vielä uudelleen tullut vastaan, mutta luontokuvausharrastus on tarjonnut lukemattomia upeita elämyksiä. Uskon, että jonain päivänä viirupöllö näyttäytyy jälleen, kunhan vain muistan lähteä ulos riittävän usein.',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textAbout1',
      screen: 'about',
      language: 'en',
      content:
        "Hi!  I'm Antti Kortelainen, a photography enthusiast with a passion for nature photography, based in Leppävirta. My true interest in photography ignited when I got my first camera that allowed me to shoot in manual mode. On its very first use, on Independence Day in 2018, I took the camera with me on a walk — and during that walk, I encountered a Ural owl for the first time in my life. I managed to capture a photo of it! The experience was so powerful and almost indescribable that it completely drew me in. I haven't seen a Ural owl since that day, but this hobby has given me countless incredible nature experiences. I believe that one day I'll see a Ural owl again. I just have to remember to step outside often enough.",
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textAbout2',
      screen: 'about',
      language: 'fin',
      content:
        'Valokuvauksen tekninen puoli, niin itse kamerassa, optiikassa kuin kuvankäsittelyssäkin, on yksi niistä asioista, jotka tekevät tästä harrastuksesta minulle niin mielekkään. Toki on hyvä muistaa, että edes paras kamera tai objektiivi ei itsessään takaa onnistunutta kuvaa. Mutta ei käy kieltäminen, etteikö nykytekniikasta olisi toisinaan suurta apua. Kuvauskalustoni on vuosien varrella laajentunut ja vaihtunut, ehkäpä välillä turhankin usein. Tällä hetkellä käytössäni on Nikon Z9 sekä Zfc rungot. Objektiiveja käytössäni on NIKKOR Z 600mm f/6.3 VR Set, NIKKOR Z 100-400mm f/4.5-5.6 VR S, NIKKOR AF-S 50mm f/1.4G, Nikkor AF-S 300mm f/2.8G VR II, Samyang XP 14mm f/2.4 ja Sigma 105mm f/2.8 EX DG makro. Aktiivisessa käytössä ovat myös Nikon Z TC-1.4X telejatke sekä Nikon FTZ II adapteri. Lisäksi tarvikkeista mainittakoon, että olen havainnut hintalaatusuhteeltaan toimiviksi Benron jalustat sekä kamerapäät.',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textAbout2',
      screen: 'about',
      language: 'en',
      content:
        "The technical side of photography — whether it&#39;s the camera itself, optics, or post-processing — is one of the things that makes this hobby so enjoyable for me. Of course, it's important to remember that even the best camera or lens doesn&#39;t guarantee a successful shot. But there's no denying that modern technology can sometimes be a huge help. Over the years, my photography gear has expanded and changed, perhaps a bit too often. At the moment, I use ikon Z9 and Z fc camera bodies. My lenses include NIKKOR Z 600mm f/6.3 VR S, NIKKOR Z 100-400mm f/4.5-5.6 VR S, NIKKOR AF-S 50mm f/1.4G, NIKKOR AF-S 300mm f/2.8G VR II, Samyang XP 14mm f/2.4, and Sigma 105mm f/2.8 EX DG Macro. I also actively use the Nikon Z TC-1.4X teleconverter and the Nikon FTZ II adapter. Additionally, when it comes to accessories, I have found Benro tripods and tripod heads to offer a great balance of price and quality.",
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textAbout3',
      screen: 'about',
      language: 'fin',
      content:
        'Kuvaajana olen itseoppinut ja kuvia napsin täysin harrastepohjalta omaksi iloksi. Kuvatessa pääsen luonnonhelmaan rentoutumaan. Silloin huolet ja murheet unohtuvat helposti. Kuvaaminen on minulle myös liikkeelle ajava voima eli syy nousta sohvalta ja lähteä ulos. Iso kiitos kuuluu myös vaimolle. Kiitos, että olet jaksanut lähteä mukaan retkille ja projekteihin. Kaiken lisäksi olet sietänyt havunneulasia eteisen lattialla......ja muissa mitä ihmeellisimmissä paikoissa. -Antti-',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textAbout3',
      screen: 'about',
      language: 'en',
      content:
        "I am a self-taught photographer, capturing moments purely as a hobby for my own enjoyment. Being out in nature with my camera helps me relax. For me it's a time when everyday worries fade away. Photography is also what pushes me to get moving, a reason to get off the couch and step outside. A huge thank you goes to my wife. Thank you for joining me on my trips and projects—and for patiently tolerating pine needles on the hallway floor......and in other most unexpected places. -Antti-",
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
        'hero_text_about',
        'headerAbout',
        'textAbout1',
        'textAbout2',
        'textAbout3',
      ],
    },
  });
}
