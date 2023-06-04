"use strict";

class Lingua {
    #eraUmaVez;
    #mortes;
    #charts;
    #vitoria;
    #fase;
    #miau;
    #saudacoes;
    #xingamentos;
    #teclas;
    #voltei;

    constructor(eraUmaVez, mortes, charts, vitoria, fase, miau, voltei, saudacoes, xingamentos, teclas) {
        this.#eraUmaVez = Object.freeze(eraUmaVez);
        this.#mortes = Object.freeze(mortes);
        this.#charts = Object.freeze(charts);
        this.#voltei = Object.freeze(voltei);
        this.#vitoria = vitoria;
        this.#fase = fase;
        this.#miau = miau;
        this.#saudacoes = Object.freeze(saudacoes);
        this.#xingamentos = Object.freeze(xingamentos);
        this.#teclas = Object.freeze(teclas);
    }

    get eraUmaVez() {
        return this.#eraUmaVez.randomElement();
    }

    get morte() {
        return this.#mortes.randomElement();
    }

    get voltei() {
        return this.#voltei.randomElement();
    }

    get chart() {
        return this.#charts.randomElement();
    }

    get vitoria() {
        return this.#vitoria;
    }

    get miau() {
        return this.#miau;
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
        ["Once upon a time,\nthere was a bird", "A long time ago,\nin a galaxy far, far away..."],
        ["💀", "💩", "😡", "Aaaaaa!", "💣🔪💢💥!" , "Argh!" , "Ugh!" , "Fuuuuu...", "NOOOOOO!", "Yikes!"    , "Ouch!"   , "Dang!" , "Dammit!"    , "This sucks!"    , "Oooff!"   , "Hell!"     , "WTF!?"      ],
        ["Yearly sales", "CO2 emissions", "Median salary", "Biodiversity increase", "Ozone layer hole size", "Flappy Bird births", "Horse racing speed", "Flappy Birds yearly deaths", "Pikachu's voltage", "Vulpix vs Charmander fire hazard", "Average flapping wing area"],
        "I WON!", "Level $$", "Meow",
        ["Did you miss me?", "Now, I'm lookin' to the sky to save me\nLookin' for a sign of life\nLookin' for somethin' to\nhelp me burn out bright", "And I'm lookin' for a complication\nLookin' cause I'm tired of lyin'\nMake my way back home\nwhen I learn to fly high", "My loneliness is killing me\nI must confess, I still believe\nWhen I'm not with you, I lose my mind\nGive me a sign\nHit me, baby, one more time"],
        ["I am a british bird.", "I am an american bird.", "I am an australian bird.", "I am a canadian bird."],
        ["Idiot!", "I hate\nyou!", "Stupid\nbird!", "Don't\ndisturb me!", "Leave me\nalone!", "Jerk!", "Go to\nhell!"],
        {"Space": "Spacebar", "Enter": "Enter key", "Numpad5": "Numpad key 5", "KeyQ": "Key Q", "KeyP": "Key P", "KeyT": "Key T"}
    ),
    pt: new Lingua(
        ["Era uma vez,\num belo passarinho...", "Há muito tempo atrás,\nem uma galáxia muito, muito distante..."],
        ["💀", "💩", "😡", "Aaaaaa!", "💣🔪💢💥!" , "Argh!" , "Ugh!" , "Fuuuuu...", "NÃÃOOOO!", "Droga!"    , "Puxa!"   , "Ai!"   , "Diacho!"    , "Que saco!"      , "Dãããã!"   , "Inferno!"  , "KCT!"       ],
        ["Vendas anuais", "Emissões de CO2", "Salário mediano", "Aumento de biodiversidade", "Tamanho do buraco na camada de ozônio", "Nascimentos de Flappy Birds", "Velocidade do cavalo de corrida", "Mortes anuais de Flappy Birds", "Voltagem do Pikachu", "Perigo de incêndio de Vulpix vs Charmander", "Área de asa média"],
        "GANHEI!", "Fase $$", "Miau",
        ["Sentiu saudades?", "Eu voltei agora pra ficar\nPorque aqui, aqui é meu lugar", "As andorinhas voltaram\nE eu também voltei"],
        ["Eu sou um pássaro brasileiro.", "Eu sou um pássaro português.", "Eu sou um pássaro angolano."],
        ["Idiota!", "Odeio\nvocê!", "Passarinho\nburro!", "Não me\nperturbe!", "Não me\nenche!", "Babaca!", "Vá pro\ninferno!"],
        {"Space": "Barro de espaço", "Enter": "Tecla enter", "Numpad5": "Tecla 5 do teclado numérico", "KeyQ": "Tecla Q", "KeyP": "Tecla P", "KeyT": "Tecla T"}
    ),
    fr: new Lingua(
        ["Il était une fois\nun magnifique petit oiseau...", "Il y a bien longtemps,\ndans une galaxie lointaine, très lointaine..."],
        ["💀", "💩", "😡", "Aaaaaa !", "💣🔪💢💥 !" , "Argh !" , "Ugh !" , "Fuuuuu...", "NOOONNN !", "Quoi ?!"    , "Ouïe !"   , "Aíe !"  , "Malchance"  , "Quelle douleur !", "Diable !"  , "Enfer !"    , "Je déteste !"],
        ["Chiffre d'affaires annuel", "Emissions de CO2", "Salaire médian", "Augmentation de la biodiversité", "Taille du trou dans la couche d'ozone", "Naissances des Flappy Birds", "Vitesse du cheval de course", "Décès annuels de Flappy Birds", "Tension de Pikachu", "Risque d'incendie de Goupix contre Salamèche", "Surface alaire moyenne"],
        "J'AI GAGNÉ !", "Niveau $$", "Miaou",
        ["Vous ai-je manqué ?", "Et c'est ainsi que\nle phénix revient à la vie !"],
        ["Je suis un oiseau français.", "Je suis un oiseau algérien.", "Je suis un oiseau belge."],
        ["Idiot!", "Je te\ndéteste !", "Oiseau\nmuet !", "Ne me\ndérange pas !", "Laisse-moi !", "Connard !", "Va au\ndiable !"],
        {"Space": "Barre d'espace", "Enter": "Touche entrée", "Numpad5": "Touche 5 du pavé numérique", "KeyQ": "Touche Q", "KeyP": "Touche P", "KeyT": "Touche T"}
    ),
    de: new Lingua(
        ["Es war einmal\nein wunderschöner kleiner Vogel...", "Vor langer Zeit,\nin einer weit, weit entfernten Galaxie ..."],
        ["💀", "💩", "😡", "Aaaaaa!", "💣🔪💢💥!" , "Argh!" , "Ugh!" , "Fuuuuu...", "NEEIINN!", "Nanu!"     , "Dort!"   , "Ach!"  , "Pech!"      , "Was zum Teufel!", "Pfui!"    , "Hölle!"    , "Hunf!"      ],
        ["Jahresumsatz", "CO2-Emissionen", "Mittleres Gehalt", "Erhöhte Artenvielfalt", "Größe des Lochs in der Ozonschicht", "Geburten von Flappy Birds", "Rennpferdgeschwindigkeit", "Jährliche Todesfälle von Flappy Birds", "Pikachus Spannung", "Brandgefahr durch Vulpix vs. Glumanda", "Durchschnittliche Flügelfläche"],
        "ICH HABE GEWONNEN!", "Level $$", "Miau",
        ["Hast du mich vermisst?", "Doch falls mal alles schief geht\nkomm doch bitte gerne schnell zurück", "O Freunde, nicht diese töne!\nSondern lasst uns angenehmere anstimmen\nund freudenvollere!"],
        ["Ich bin ein deutscher Vogel.", "Ich bin ein österreichischer Vogel.", "Ich bin ein schweizer Vogel."],
        ["Idiot!", "Ich hasse\ndich!", "Dummer\nVogel!", "Stör mich\nnicht!", "Lassen Sie\nmich allein!", "Täuschen!", "Fahr zur\nHölle!"],
        {"Space": "Eingabetaste", "Enter": "Leertaste", "Numpad5": "Zifferntaste 5", "KeyQ": "Q-Taste", "KeyP": "P-Taste", "KeyT": "T-Taste"}
    ),
    it: new Lingua(
        ["C'era una volta\nun bellissimo uccellino...", "Tanto tempo fa,\nin una galassia molto, molto lontana..."],
        ["💀", "💩", "😡", "Aaaaaa!", "💣🔪💢💥!" , "Argh!" , "Ugh!" , "Fuuuuu...", "NOOOOOO!", "Mannaggia" , "Caspita!", "Cazzo!", "Dannazione!", "Que diavolo!"   , "Caspita!" , "Inferno!"  , "Che cavolo!"],
        ["Saldi annuali", "Emissioni di CO2", "Stipendio medio", "Aumento della biodiversità", "Dimensioni del buco nello strato di ozono", "Nascite di Flappy Birds", "Velocità del cavallo da corsa", "Uccisioni annuali di Flappy Birds", "Voltaggio di Pikachu", "Rischio di incendio Vulpix vs Charmander", "Superficie alare media"],
        "HO VINTO!", "Fase $$", "Miao",
        ["Ti sono mancato?", "Volare, oh-oh\nCantare, oh-oh, oh-oh\nNel blu dipinto di blu\nFelice di stare lassù.","Funiculí, funiculá\nFuniculí, funiculá\nNcoppa jammo ja\nFuniculí, funiculá"],
        ["Sono un uccello italiano.", "Sono un uccello svizzero."],
        ["Idiota!", "Ti odio!", "Uccello\nmuto!", "Non\ndisturbarmi!", "Lasciami\nin pace!", "Stronzo!", "Vai all'inferno!"],
        {"Space": "Barra spaziatrice", "Enter": "Tasto Invio", "Numpad5": "Tasto 5 del tastierno numerico", "KeyQ": "Tasto Q", "KeyP": "Tasto P", "KeyT": "Tasto T"}
    ),
    es: new Lingua(
        ["Había una vez\nun hermoso pajarito...", "Hace mucho tiempo,\nen una galaxia muy, muy lejana..."],
        ["💀", "💩", "😡", "¡Aaaaa!", "¡💣🔪💢💥!", "¡Argh!", "¡Ugh!", "Fuuuuu...", "¡NOOOOO!", "¡Que odio!", "¡Guau!"  , "¡Ay!"  , "¡Odio eso!" , "¡Qué diablos!"  , "¡Caramba!", "¡Infierno!", "¡Qué rabia!"],
        ["Ventas anuales", "Emisiones de CO2", "Salario medio", "Aumento de la biodiversidad", "Tamaño del agujero en la capa de ozono", "Nacimientos de Flappy Birds", "Velocidade del caballo de carrera", "Muertes anuales de Flappy Birds", "Voltaje de Pikachu", "Peligro de incendio de Vulpix vs Charmander", "Área promedio de ala"],
        "¡GANÉ!", "Nivel $$", "Miau",
        ["¿Me extrañaste?", "Por eso espérame, porque\nEsto no puede suceder\nEs imposible separar así\nLa historia de los dos", "Y volando, volando feliz\nYo me encuentro más alto\nMás alto que el Sol"],
        ["Soy un pájaro español.", "Soy un pájaro mexicano.", "Soy un pájaro argentino.", "Soy un pájaro peruano."],
        ["¡Estúpido!", "¡Yo te\nodio!", "¡Pájaro\ntonto!", "¡No me molestes!", "¡Sal de aqui!", "¡Boludo!", "¡Vete al\ninfierno!"],
        {"Space": "Barra espaciadora", "Enter": "Tecla enter", "Numpad5": "Tecla 5 del teclado numérico", "KeyQ": "Tecla Q", "KeyP": "Tecla P", "KeyT": "Tecla T"}
    )
};
Object.freeze(LINGUAS);