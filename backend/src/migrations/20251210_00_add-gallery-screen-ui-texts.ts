import { QueryInterface, Op } from 'sequelize';

export async function up({ context }: { context: QueryInterface }) {
  await context.bulkInsert('ui_texts', [
    {
      key_name: 'header_monthly',
      screen: 'gallery',
      language: 'fin',
      content: 'Kuukauden kuva',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'header_monthly',
      screen: 'gallery',
      language: 'en',
      content: 'Photo of the Month',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textContent_monthly',
      screen: 'gallery',
      language: 'fin',
      content:
        'Joka kuukausi valitsen yhden erityisen kuvan, joka on jäänyt mieleeni tavalla tai toisella. Se voi olla hetki, jonka onnistuin tallentamaan juuri oikeaan aikaan, teknisesti haastava otos tai yksinkertaisesti kuva, joka herättää tunteita ja muistoja.\n\nHaluan myös tarjota kurkistuksen kuvan taustoihin – missä ja miten se on otettu, mikä teki tilanteesta ainutlaatuisen ja mitä ajatuksia kuva minussa herättää. Kerron tarvittaessa myös teknisistä yksityiskohdista, kuten käytetystä kalustosta ja asetuksista, sekä mahdollisista jälkikäsittelyvaiheista.\n\nTavoitteeni on jakaa paitsi kauniita ja mielenkiintoisia kuvia, myös tarinoita niiden takaa. Toivon, että tämä osio inspiroi sinua katsomaan ympäröivää maailmaa uusin silmin – ehkä jopa tarttumaan itse kameraan ja ikuistamaan omia hetkiäsi!',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textContent_monthly',
      screen: 'gallery',
      language: 'en',
      content:
        'Every month, I choose a special photo that has stayed in my mind for one reason or another. It could be a moment I managed to capture at just the right time, a technically challenging shot, or simply an image that evokes emotions and memories.\n\nI also want to offer a glimpse into the story behind the photo – where and how it was taken, what made the moment unique, and what thoughts it brings to mind. When relevant, I’ll also share technical details, such as the equipment and settings used, as well as any post-processing steps.\n\nMy goal is to share not only beautiful and interesting images but also the stories behind them. I hope this section inspires you to see the world around you in a new way – and perhaps even pick up a camera yourself to capture your own special moments!',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'header_mammals',
      screen: 'gallery',
      language: 'fin',
      content: 'Nisäkkäät',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'header_mammals',
      screen: 'gallery',
      language: 'en',
      content: 'Mammals',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textContent_mammals',
      screen: 'gallery',
      language: 'fin',
      content:
        'Nisäkkäiden ja varsinkin isojen eläinten kuvaaminen on varmasti haastavinta. Eikä vähiten siksi, että niitä pääsee näkemään vain niin kovin harvoin. Ehkäpä myös siksi jo pelkkä eläimen näkeminen on aina erityinen kokemus. Isojen petoeläinten kuvaamiseen itselläni ei ole oikeastaan muita mahdollisuuksia kuin maksulliset piilokojut. Toki itse oman työn tuloksena kohdattu ja kuvattu eläin tuntuu ehkäpä enemmän ansaitulta. Silti on kyllä pakko myöntää, että mesikämmenen ihastelu suon laidalla pienestä kopista kesäyönä on myös kokemuksena vertaansa vailla.',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textContent_mammals',
      screen: 'gallery',
      language: 'en',
      content:
        'Photographing mammals, especially large animals, is undoubtedly one of the most challenging tasks—not least because they are so rarely seen. Perhaps that’s also why simply spotting one always feels like a special experience. When it comes to photographing large predators, my only real option is using paid hides. Of course, encountering and capturing an animal through my own effort feels more rewarding. Still, I have to admit that watching a bear on the edge of a marsh from a small hide on a summer night is an experience like no other.',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'header_nature',
      screen: 'gallery',
      language: 'fin',
      content: 'Luonto',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'header_nature',
      screen: 'gallery',
      language: 'en',
      content: 'Nature',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textContent_nature',
      screen: 'gallery',
      language: 'fin',
      content:
        'Luonto on ikiaikainen inspiraation lähde. Itseäni en pidä erityisen lahjakkaana taiteellisesti. Kuitenkin luontoa tarkkailemalla minäkin toisinaan saatan löytää luonnon luomaa taidetta. Sen ihastelu minulta onnistuu kyllä. Luonto on loputon pienien ja isompienkin ihmeiden aarreaitta erilaisine muotoineen, väreineen ja hetkineen. Hienointa tässä on, että ihastellakseen tätä taidetta täytyy vain muistaa pysähtyä, katsoa vähän tarkemmin kuin yleensä ja nauttia. Kun oivalsin tämän olen löytänyt myös itseni...monesti makaamasta mahallani maassa ja ihmettelemässä luontoa.',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textContent_nature',
      screen: 'gallery',
      language: 'en',
      content:
        'Nature is an eternal source of inspiration. I don’t consider myself particularly gifted artistically. However, by observing nature, I too sometimes come across art created by nature itself. Admiring it is something I can certainly do. Nature is an endless treasure trove of small and grand wonders, filled with different shapes, colors, and fleeting moments. The best part is that to appreciate this art, all you need to do is pause, look a little closer than usual, and enjoy. Once I realized this, I often found myself… lying on my stomach on the ground, marveling at nature.',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'header_landscapes',
      screen: 'gallery',
      language: 'fin',
      content: 'Maisemat',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'header_landscapes',
      screen: 'gallery',
      language: 'en',
      content: 'Landscapes',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textContent_landscapes',
      screen: 'gallery',
      language: 'fin',
      content:
        'Maisemakuvaamisen suola on mielestäni se, että vaikka käyn kuinka monesti samalla paikalla kuvaamassa, niin kerta toisensa jälkeen maisema ja kuva muuttuvat ja niistä löytää yllättäen uusia piirteitä. Minulle on muodostunutkin sellaisia omia suosikkipaikkoja ottaa kuvia eri kellon- ja vuodenaikoina sekä erilaisissa sääolosuhteissa. Myös tähtitaivaan kuvaaminen ja katseleminen totaalisessa pimeydessä vetää nöyräksi ja muistuttaa laittamaan asiat oikeaan mittakaavaan.',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textContent_landscapes',
      screen: 'gallery',
      language: 'en',
      content:
        'The beauty of landscape photography, in my opinion, is that no matter how many times I visit the same location, the scenery and the resulting image always change, unexpectedly revealing new details. Over time, I have found my own favorite spots to photograph at different times of the day and year, as well as in various weather conditions. Capturing and observing the starry sky in complete darkness is also a humbling experience, reminding me to put things into perspective.',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'header_birds',
      screen: 'gallery',
      language: 'fin',
      content: 'Linnut',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'header_birds',
      screen: 'gallery',
      language: 'en',
      content: 'Birds',
      role: 'title',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textContent_birds',
      screen: 'gallery',
      language: 'fin',
      content:
        'Linnut kiehtovat minua tavalla, jota on vaikea selittää. Ne ovat erityisen lähellä sydäntäni, sillä intohimoni valokuvaukseen – ja erityisesti luontokuvaukseen – sai kipinänsä kohtaamisestani viirupöllön kanssa. Ensimmäinen viirupöllöstä ottamani kuva ei ollut millään mittarilla onnistunut. Sittemmin olen kuitenkin saanut ikuistettua monia lintukohtaamisia, jotka ovat tuoneet todellisia onnistumisen kokemuksia. Aina näin ei kuitenkaan käy. Lintujen kuvaaminen voi toisinaan olla jopa turhauttavaa, mutta juuri haastavuus on yksi niistä asioista, jotka pitävät mielenkiinnon yllä.',
      role: 'text',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key_name: 'textContent_birds',
      screen: 'gallery',
      language: 'en',
      content:
        'Birds fascinate me in a way that is hard to explain. They are especially close to my heart because my passion for photography – and nature photography in particular – was sparked by an encounter with a Ural owl. The first photo I took of it was far from successful. However, over time, I have managed to capture many bird encounters that have given me a true sense of accomplishment. But that’s not always the case. Photographing birds can sometimes be frustrating, yet the very challenge of it is likely one of the reasons that keeps my interest alive.',
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
        'header_monthly',
        'textContent_monthly',
        'header_mammals',
        'textContent_mammals',
        'header_nature',
        'textContent_nature',
        'header_landscapes',
        'textContent_landscapes',
        'header_birds',
        'textContent_birds',
      ],
    },
  });
}
