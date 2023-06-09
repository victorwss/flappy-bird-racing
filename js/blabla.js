"use strict";

const CHART_MESSAGES = 11;

class Lingua {
    #tagSom;
    #eraUmaVez;
    #finalFeliz;
    #mortes;
    #charts;
    #vitoria;
    #fase;
    #miau;
    #fim;
    #saudacoes;
    #xingamentos;
    #teclas;
    #voltei;

    constructor(tagSom, eraUmaVez, finalFeliz, mortes, charts, vitoria, fase, miau, fim, voltei, saudacoes, xingamentos, teclas) {
        if (charts.length !== CHART_MESSAGES) throw new Error();
        this.#tagSom = tagSom;
        this.#eraUmaVez = Object.freeze(eraUmaVez);
        this.#finalFeliz = Object.freeze(finalFeliz);
        this.#mortes = Object.freeze(mortes);
        this.#charts = Object.freeze(charts);
        this.#voltei = Object.freeze(voltei);
        this.#vitoria = vitoria;
        this.#fase = fase;
        this.#miau = miau;
        this.#fim = fim;
        this.#saudacoes = Object.freeze(saudacoes);
        this.#xingamentos = Object.freeze(xingamentos);
        this.#teclas = Object.freeze(teclas);
    }

    get tagSom() {
        return this.#tagSom;
    }

    get eraUmaVez() {
        return this.#eraUmaVez.randomElement();
    }

    get finalFeliz() {
        return this.#finalFeliz.randomElement();
    }

    get morte() {
        return this.#mortes.randomElement();
    }

    get voltei() {
        return this.#voltei.randomElement();
    }

    chart(i) {
        if (typeof i !== "number" || i !== i || i < 0 || i >= CHART_MESSAGES) throw new Error(`${i}`);
        return this.#charts[i];
    }

    static get randomChartId() {
        return randomInt(0, CHART_MESSAGES - 1);
    }

    get vitoria() {
        return this.#vitoria;
    }

    get miau() {
        return this.#miau;
    }

    get fim() {
        return this.#fim;
    }

    get saudacao() {
        return this.#saudacoes.randomElement();
    }

    get xingamento() {
        return this.#xingamentos.randomElement();
    }

    fase(i) {
        return this.#fase.replace("$$", `${i}`);
    }

    tecla(q) {
        return this.#teclas[q];
    }
}

const LINGUAS = {
    en: new Lingua(
        "en",
        ["Once upon a time,\nthere was a bird", "A long time ago,\nIn a galaxy far, far away..."],
        ["And they lived happily ever after.\nTHE  END"],
        ["💀", "💩", "😡", "Aaaaaa!", "💣🔪💢💥!" , "Argh!" , "Ugh!" , "Fuuuuu...", "NOOOOOO!", "Yikes!"    , "Ouch!"   , "Dang!" , "Dammit!"    , "This sucks!"    , "Oooff!"   , "Hell!"     , "WTF!?"      ],
        ["Yearly sales", "CO2 emissions", "Median salary", "Biodiversity increase", "Ozone layer hole size", "Flappy Bird births", "Horse racing speed", "Flappy Birds yearly deaths", "Pikachu's voltage", "Vulpix vs Charmander fire hazard", "Average flapping wing area"],
        "I WON!",
        "Level $$",
        "Meow",
        "THE END",
        [
            "Did you miss me?", "And that is how\nthe phoenix comes back to life!",
            "Now, I'm lookin' to the sky to save me\nLookin' for a sign of life\nLookin' for somethin' to\nhelp me burn out bright",
            "And I'm lookin' for a complication\nLookin' cause I'm tired of lyin'\nMake my way back home\nwhen I learn to fly high",
            "My loneliness is killing me\nI must confess, I still believe\nWhen I'm not with you, I lose my mind\nGive me a sign\nHit me, baby, one more time"
        ],
        ["I am a British bird.", "I am an American bird.", "I am an Australian bird.", "I am a Canadian bird.", "I am a New Zealander bird."],
        ["Idiot!", "I hate\nyou!", "Stupid\nbird!", "Don't\ndisturb me!", "Leave me\nalone!", "Jerk!", "Go to\nhell!"],
        {"Space": "Spacebar", "Enter": "Enter key", "Numpad5": "Numpad key 5", "KeyQ": "Key Q", "KeyP": "Key P", "KeyT": "Key T"}
    ),
    pt: new Lingua(
        "pt",
        ["Era uma vez,\num belo passarinho...", "Há muito tempo atrás,\nem uma galáxia muito, muito distante..."],
        ["E viveram felizes para sempre.\nFIM"],
        ["💀", "💩", "😡", "Aaaaaa!", "💣🔪💢💥!" , "Argh!" , "Ugh!" , "Fuuuuu...", "NÃÃOOOO!", "Droga!"    , "Puxa!"   , "Ai!"   , "Diacho!"    , "Que saco!"      , "Dãããã!"   , "Inferno!"  , "KCT!"       ],
        ["Vendas anuais", "Emissões de CO2", "Salário mediano", "Aumento de biodiversidade", "Tamanho do buraco na camada de ozônio", "Nascimentos de Flappy Birds", "Velocidade do cavalo de corrida", "Mortes anuais de Flappy Birds", "Voltagem do Pikachu", "Perigo de incêndio de Vulpix vs Charmander", "Área de asa média"],
        "GANHEI!",
        "Fase $$",
        "Miau",
        "FIM",
        [
            "Sentiu saudades?", "E é assim que\na fênix volta à vida!",
            "Eu voltei agora pra ficar\nPorque aqui, aqui é meu lugar",
            "As andorinhas voltaram\nE eu também voltei",
            "Até mesmo a asa branca\nbateu asas do sertão\nPor falta d'água, perdi meu gado\nmorreu de sede, meu alazão"
        ],
        ["Eu sou um pássaro brasileiro.", "Eu sou um pássaro português.", "Eu sou um pássaro angolano.", "Eu sou um pássaro de moçambique."],
        ["Idiota!", "Odeio\nvocê!", "Passarinho\nburro!", "Não me\nperturbe!", "Não me\nenche!", "Babaca!", "Vá pro\ninferno!"],
        {"Space": "Barro de espaço", "Enter": "Tecla enter", "Numpad5": "Tecla 5 do teclado numérico", "KeyQ": "Tecla Q", "KeyP": "Tecla P", "KeyT": "Tecla T"}
    ),
    fr: new Lingua(
        "fr",
        ["Il était une fois\nun magnifique petit oiseau...", "Il y a bien longtemps,\ndans une galaxie lointaine, très lointaine..."],
        ["Et il vécurent heureux pour l'éternité.\nFIN"],
        ["💀", "💩", "😡", "Aaaaaa !", "💣🔪💢💥 !" , "Argh !" , "Ugh !" , "Fuuuuu...", "NOOONNN !", "Quoi ?!"    , "Ouïe !"   , "Aíe !"  , "Malchance"  , "Quelle douleur !", "Diable !"  , "Enfer !"    , "Je déteste !"],
        ["Chiffre d'affaires annuel", "Emissions de CO2", "Salaire médian", "Augmentation de la biodiversité", "Taille du trou dans la couche d'ozone", "Naissances des Flappy Birds", "Vitesse du cheval de course", "Décès annuels de Flappy Birds", "Tension de Pikachu", "Risque d'incendie de Goupix contre Salamèche", "Surface alaire moyenne"],
        "J'AI GAGNÉ !",
        "Niveau $$",
        "Miaou",
        "FIN",
        [
            "Vous ai-je manqué ?", "Et c'est ainsi que\nle phénix revient à la vie !",
            "L'amour, hum hum, pas pour moi",
            "Les oiseaux du Bon Dieu\nHum, hum\nViennent du monde entier\nPour bavarder entre eux"
        ],
        ["Je suis un oiseau français.", "Je suis un oiseau algérien.", "Je suis un oiseau belge.", "Je suis un oiseau québecois."],
        ["Idiot!", "Je te\ndéteste !", "Oiseau\nmuet !", "Ne me\ndérange pas !", "Laisse-moi !", "Connard !", "Va au\ndiable !"],
        {"Space": "Barre d'espace", "Enter": "Touche entrée", "Numpad5": "Touche 5 du pavé numérique", "KeyQ": "Touche Q", "KeyP": "Touche P", "KeyT": "Touche T"}
    ),
    de: new Lingua(
        "de",
        ["Es war einmal\nein wunderschöner kleiner Vogel...", "Vor langer Zeit,\nin einer weit, weit entfernten Galaxie ..."],
        ["Und sie lebten glücklich bis ans Ende."],
        ["💀", "💩", "😡", "Aaaaaa!", "💣🔪💢💥!" , "Argh!" , "Ugh!" , "Fuuuuu...", "NEEIINN!", "Nanu!"     , "Dort!"   , "Ach!"  , "Pech!"      , "Was zum Teufel!", "Pfui!"    , "Hölle!"    , "Hunf!"      ],
        ["Jahresumsatz", "CO2-Emissionen", "Mittleres Gehalt", "Erhöhte Artenvielfalt", "Größe des Lochs in der Ozonschicht", "Geburten von Flappy Birds", "Rennpferdgeschwindigkeit", "Jährliche Todesfälle von Flappy Birds", "Pikachus Spannung", "Brandgefahr durch Vulpix vs. Glumanda", "Durchschnittliche Flügelfläche"],
        "ICH HABE GEWONNEN!",
        "Level $$",
        "Miau",
        "ENDE",
        [
            "Hast du mich vermisst?", "Und so erwacht\nder Phönix wieder zum Leben!",
            "Doch falls mal alles schief geht\nkomm doch bitte gerne schnell zurück",
            "O Freunde, nicht diese töne!\nSondern lasst uns angenehmere anstimmen\nund freudenvollere!",
            "Du willst mich für dich und du willst mich ganz\nDoch auf dem niveau macht's mir keinen spaß"
        ],
        ["Ich bin ein deutscher Vogel.", "Ich bin ein österreichischer Vogel.", "Ich bin ein schweizer Vogel."],
        ["Idiot!", "Ich hasse\ndich!", "Dummer\nVogel!", "Stör mich\nnicht!", "Lassen Sie\nmich allein!", "Täuschen!", "Fahr zur\nHölle!"],
        {"Space": "Leertaste", "Enter": "Eingabetaste", "Numpad5": "Zifferntaste 5", "KeyQ": "Q-Taste", "KeyP": "P-Taste", "KeyT": "T-Taste"}
    ),
    it: new Lingua(
        "it",
        ["C'era una volta\nun bellissimo uccellino...", "Tanto tempo fa,\nin una galassia molto, molto lontana..."],
        ["E vissero felici e contenti.\nFINE"],
        ["💀", "💩", "😡", "Aaaaaa!", "💣🔪💢💥!" , "Argh!" , "Ugh!" , "Fuuuuu...", "NOOOOOO!", "Mannaggia" , "Caspita!", "Cazzo!", "Dannazione!", "Que diavolo!"   , "Caspita!" , "Inferno!"  , "Che cavolo!"],
        ["Saldi annuali", "Emissioni di CO2", "Stipendio medio", "Aumento della biodiversità", "Dimensioni del buco nello strato di ozono", "Nascite di Flappy Birds", "Velocità del cavallo da corsa", "Uccisioni annuali di Flappy Birds", "Voltaggio di Pikachu", "Rischio di incendio Vulpix vs Charmander", "Superficie alare media"],
        "HO VINTO!",
        "Fase $$",
        "Miao",
        "FINE",
        [
            "Ti sono mancato?", "Ed è così che\nla fenice torna in vita!",
            "Volare, oh-oh\nCantare, oh-oh, oh-oh\nNel blu dipinto di blu\nFelice di stare lassù.",
            "Funiculí, funiculá\nFuniculí, funiculá\nNcoppa jammo ja\nFuniculí, funiculá",
            "Cara\nTi voglio tanto bene\nNon ho nessuno al mondo\nPiù cara\nDi te"
        ],
        ["Sono un uccello italiano.", "Sono un uccello svizzero."],
        ["Idiota!", "Ti odio!", "Uccello\nmuto!", "Non\ndisturbarmi!", "Lasciami\nin pace!", "Stronzo!", "Vai all'inferno!"],
        {"Space": "Barra spaziatrice", "Enter": "Tasto Invio", "Numpad5": "Tasto 5 del tastierno numerico", "KeyQ": "Tasto Q", "KeyP": "Tasto P", "KeyT": "Tasto T"}
    ),
    es: new Lingua(
        "es",
        ["Había una vez\nun hermoso pajarito...", "Hace mucho tiempo,\nen una galaxia muy, muy lejana..."],
        ["Y ellos vivieron felices para siempre.\nFIN"],
        ["💀", "💩", "😡", "¡Aaaaa!", "¡💣🔪💢💥!", "¡Argh!", "¡Ugh!", "Fuuuuu...", "¡NOOOOO!", "¡Que odio!", "¡Guau!"  , "¡Ay!"  , "¡Odio eso!" , "¡Qué diablos!"  , "¡Caramba!", "¡Infierno!", "¡Qué rabia!"],
        ["Ventas anuales", "Emisiones de CO2", "Salario medio", "Aumento de la biodiversidad", "Tamaño del agujero en la capa de ozono", "Nacimientos de Flappy Birds", "Velocidade del caballo de carrera", "Muertes anuales de Flappy Birds", "Voltaje de Pikachu", "Peligro de incendio de Vulpix vs Charmander", "Área promedio de ala"],
        "¡GANÉ!",
        "Nivel $$",
        "Miau",
        "FIN",
        [
            "¿Me extrañaste?", "¡Y así es como\nla fénix vuelve a la vida!",
            "Por eso espérame, porque\nEsto no puede suceder\nEs imposible separar así\nLa historia de los dos",
            "Y volando, volando feliz\nYo me encuentro más alto\nMás alto que el Sol",
            "Despacito\nQuiero respirar tu cuello despacito\nDeja que te diga cosas al oído\nPara que te acuerdes si no estás conmigo"
        ],
        ["Soy un pájaro español.", "Soy un pájaro mexicano.", "Soy un pájaro argentino.", "Soy un pájaro peruano."],
        ["¡Estúpido!", "¡Yo te\nodio!", "¡Pájaro\ntonto!", "¡No me molestes!", "¡Sal de aqui!", "¡Boludo!", "¡Vete al\ninfierno!"],
        {"Space": "Barra espaciadora", "Enter": "Tecla enter", "Numpad5": "Tecla 5 del teclado numérico", "KeyQ": "Tecla Q", "KeyP": "Tecla P", "KeyT": "Tecla T"}
    ),
    nl: new Lingua(
        "nl",
        ["Er was eens\ner was een mooie kleine vogel...", "Lang geleden,\nin een melkwegstelsel ver, ver weg..."],
        ["En ze leven nog lang en gelukkig.\nEINDE"],
        ["💀", "💩", "😡", "Aaaaaa!", "💣🔪💢💥!" , "Argh!" , "Ugh!" , "Fuuuuu...", "NEEEEE!", "Jakkes!"    , "Ouch!"   , "Dang!" , "Verdomme!"    , "Dit is klote!"    , "Dat doet pijn!"   , "Hel!"     , "Wat saai!"      ],
        ["Jaarlijkse verkoop", "CO2 uitstoot", "Gemiddeld salaris", "Verhoging van de biodiversiteit", "Grootte van het gat in de ozonlaag", "Flappy Birds komen uit", "Snelheid van het racepaard", "Jaarlijkse Flappy Bird Sterfgevallen", "Pikachu-spanning", "Brandgevaar van Vulpix vs Charmander", "Gemiddeld klapperend vleugeloppervlak"],
        "IK WON!",
        "Niveau $$",
        "Mauw!",
        "HET EINDE",
        [
            "Heb je mij gemist?", "En zo komt\nde feniks weer tot leven!",
            "HET IS GELD! waarvoor iedereen z'n waarde verlaagd\nHET IS GELD! waardoor iedereen zich raarder gedraagd\nHET IS GELD! wat de macht heeft over vele principes\nHET IS GELD! wat de mensen maakt tot hebberige types",
            //"Y volando, volando feliz\nYo me encuentro más alto\nMás alto que el Sol",
            //"Despacito\nQuiero respirar tu cuello despacito\nDeja que te diga cosas al oído\nPara que te acuerdes si no estás conmigo"
        ],
        ["Ik ben een Hollandse vogel.", "Ik ben een belgische vogel."],
        ["Idioot!", "ik haat\nje!", "Stomme\nvogel!", "Stoor\nme niet!", "Laat me\nalleen!", "Eikel!", "Loop naar\nde hel!"],
        {"Space": "Spatiebalk", "Enter": "Enter toets", "Numpad5": "Numpad-toets 5", "KeyQ": "Toets Q", "KeyP": "Toets P", "KeyT": "Toets T"}
    ),
};
Object.freeze(LINGUAS);