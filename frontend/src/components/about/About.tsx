import AboutHeader from "./AboutHeader";
import AboutContent from "./AboutContent";

import { useLanguage } from "../../hooks/useLanguage";

const About = () => {
  const { language } = useLanguage();

  const headerAbout =
    language === "fin"
      ? "Matkani luontokuvauksen parissa"
      : " My Journey into the Nature Photography";

  const textAbout1 =
    language === "fin" ? (
      <p className="textAbout">
        <b>Moi!</b>
        <br />
        <br />
        Olen Antti Kortelainen, valokuvauksen ja erityisesti luontokuvauksen
        intoilija Leppävirralta. Innostukseni kuvaamiseen syttyi toden teolla,
        kun hankin ensimmäisen kamerani, jossa oli mahdollisuus käyttää
        manuaaliasetuksia. Jo heti ensimmäisellä käyttökerralla
        itsenäisyyspäivänä 2018 otin kameran mukaan kävelylle — ja tuolla
        kävelyllä kohtasin viirupöllön ensimmäistä kertaa elämässäni. Onnistuin
        saamaan siitä kuvan!
        <br />
        <br />
        Kokemus oli selittämättömällä tavalla niin voimakas, että se vei minut
        täysin mukanaan. Viirupöllöä ei ole tuon kohtaamisen jälkeen vielä
        uudelleen tullut vastaan, mutta luontokuvausharrastus on tarjonnut
        lukemattomia upeita elämyksiä. Uskon, että jonain päivänä viirupöllö
        näyttäytyy jälleen, kunhan vain muistan lähteä ulos riittävän usein.
      </p>
    ) : (
      <p className="textAbout">
        <b>Hi!</b>
        <br />
        <br />
        I&#39;m Antti Kortelainen, a photography enthusiast with a passion for
        nature photography, based in Leppävirta. My true interest in photography
        ignited when I got my first camera that allowed me to shoot in manual
        mode. On its very first use, on Independence Day in 2018, I took the
        camera with me on a walk — and during that walk, I encountered a Ural
        owl for the first time in my life. I managed to capture a photo of it!
        <br />
        <br />
        The experience was so powerful and almost indescribable that it
        completely drew me in. I haven&#39;t seen a Ural owl since that day, but
        this hobby has given me countless incredible nature experiences. I
        believe that one day I&#39;ll see a Ural owl again. I just have to
        remember to step outside often enough.
      </p>
    );

  const pictureAbout1 = "../../images/about/konnus.jpg";

  const textAbout2 =
    language === "fin" ? (
      <p className="textAbout">
        Valokuvauksen tekninen puoli, niin itse kamerassa, optiikassa kuin
        kuvankäsittelyssäkin, on yksi niistä asioista, jotka tekevät tästä
        harrastuksesta minulle niin mielekkään. Toki on hyvä muistaa, että edes
        paras kamera tai objektiivi ei itsessään takaa onnistunutta kuvaa. Mutta
        ei käy kieltäminen, etteikö nykytekniikasta olisi toisinaan suurta apua.
        <br />
        <br />
        Kuvauskalustoni on vuosien varrella laajentunut ja vaihtunut, ehkäpä
        välillä turhankin usein. Tällä hetkellä käytössäni on <b>
          Nikon Z9
        </b>{" "}
        sekä <b>Zfc</b> rungot. Objektiiveja käytössäni on{" "}
        <b>NIKKOR Z 600mm f/6.3 VR S</b>,{" "}
        <b>NIKKOR Z 100-400mm f/4.5-5.6 VR S</b>, <b>NIKKOR AF-S 50mm f/1.4G</b>
        , <b>Nikkor AF-S 300mm f/2.8G VR II</b>, <b>Samyang XP 14mm f/2.4</b> ja{" "}
        <b>Sigma 105mm f/2.8 EX DG makro</b>. Aktiivisessa käytössä ovat myös{" "}
        <b>Nikon Z TC-1.4X</b> telejatke sekä <b>Nikon FTZ II</b> adapteri.{" "}
        Lisäksi tarvikkeista mainittakoon, että olen havainnut
        hintalaatusuhteeltaan toimiviksi <b>Benron</b> jalustat sekä kamerapäät.
      </p>
    ) : (
      <p className="textAbout">
        The technical side of photography — whether it&#39;s the camera itself,
        optics, or post-processing — is one of the things that makes this hobby
        so enjoyable for me. Of course, it&#39;s important to remember that even
        the best camera or lens doesn&#39;t guarantee a successful shot. But
        there&#39;s no denying that modern technology can sometimes be a huge
        help.
        <br />
        <br />
        Over the years, my photography gear has expanded and changed, perhaps a
        bit too often. At the moment, I use <b>Nikon Z9</b> and <b>Z fc</b>{" "}
        camera bodies. My lenses include <b>NIKKOR Z 600mm f/6.3 VR S</b>,{" "}
        <b>NIKKOR Z 100-400mm f/4.5-5.6 VR S</b>, <b>NIKKOR AF-S 50mm f/1.4G</b>
        , <b>NIKKOR AF-S 300mm f/2.8G VR II</b>, <b>Samyang XP 14mm f/2.4</b>,
        and <b>Sigma 105mm f/2.8 EX DG Macro</b>. I also actively use the{" "}
        <b>Nikon Z TC-1.4X</b> teleconverter and the <b>Nikon FTZ II</b>{" "}
        adapter. Additionally, when it comes to accessories, I have found{" "}
        <b>Benro</b> tripods and tripod heads to offer a great balance of price
        and quality.
      </p>
    );

  const pictureAbout2 = "../../images/about/equipment.jpg";

  const textAbout3 =
    language === "fin" ? (
      <p className="textAbout">
        Kuvaajana olen itseoppinut ja kuvia napsin täysin harrastepohjalta
        omaksi iloksi. Kuvatessa pääsen luonnonhelmaan rentoutumaan. Silloin
        huolet ja murheet unohtuvat helposti. Kuvaaminen on minulle myös
        liikkeelle ajava voima eli syy nousta sohvalta ja lähteä ulos.
        <br />
        <br />
        Iso kiitos kuuluu myös vaimolle. Kiitos, että olet jaksanut lähteä
        mukaan retkille ja projekteihin. Kaiken lisäksi olet sietänyt
        havunneulasia eteisen lattialla...
        <br />
        <br />
        ...ja muissa mitä ihmeellisimmissä paikoissa.
        <br />
        <br />
        <b>-Antti-</b>
      </p>
    ) : (
      <p className="textAbout">
        I am a self-taught photographer, capturing moments purely as a hobby for
        my own enjoyment. Being out in nature with my camera helps me relax. For
        me it&#39;s a time when everyday worries fade away. Photography is also
        what pushes me to get moving, a reason to get off the couch and step
        outside.
        <br />
        <br />
        A huge thank you goes to my wife. Thank you for joining me on my trips
        and projects—and for patiently tolerating pine needles on the hallway
        floor...
        <br />
        <br />
        ...and in other most unexpected places.
        <br />
        <br />
        <b>-Antti-</b>
      </p>
    );

  const pictureAbout3 = "../../images/about/birds.jpg";

  return (
    <>
      <AboutHeader />
      <AboutContent
        headerAbout={headerAbout}
        textAbout={textAbout1}
        src={pictureAbout1}
        alt={"pictureAbout1"}
        classNamePrints={"prints2"}
        classNameElement={"reverse"}
      />
      <hr className="separatorLine" />
      <AboutContent
        textAbout={textAbout2}
        src={pictureAbout2}
        alt={"pictureAbout2"}
      />
      <hr className="separatorLine" />
      <AboutContent
        textAbout={textAbout3}
        src={pictureAbout3}
        alt={"pictureAbout3"}
        classNamePrints={"prints2"}
        classNameElement={"reverse"}
      />
    </>
  );
};

export default About;
