import { StaticImageData } from "next/image";
import * as africaImg from "./africa";
import * as americaImg from "./america";
import * as asiaImg from "./asia";
import * as europeImg from "./europe";
import * as oceaniaImg from "./oceania";

let _id = 0;
function id() {
  return ++_id;
}

export type Country = {
  id: number;
  name: string;
  alias?: string[];
  flag: StaticImageData;
};

export const africa = [
  {
    id: id(),
    name: "África do Sul",
    flag: africaImg.africadosul,
  },
  {
    id: id(),
    name: "Angola",
    flag: africaImg.angola,
  },
  {
    id: id(),
    name: "Argélia",
    flag: africaImg.argelia,
  },
  {
    id: id(),
    name: "Benim",
    flag: africaImg.benim,
  },
  {
    id: id(),
    name: "Botswana",
    alias: ["Botsuana"],
    flag: africaImg.botswana,
  },
  {
    id: id(),
    name: "Burkina Faso",
    flag: africaImg.burkinafaso,
  },
  {
    id: id(),
    name: "Burundi",
    flag: africaImg.burundi,
  },
  {
    id: id(),
    name: "Cabo Verde",
    flag: africaImg.caboverde,
  },
  {
    id: id(),
    name: "Camarões",
    flag: africaImg.camaroes,
  },
  {
    id: id(),
    name: "Chade",
    flag: africaImg.chade,
  },
  {
    id: id(),
    name: "Comores",
    flag: africaImg.comores,
  },
  {
    id: id(),
    name: "Costa do Marfim",
    flag: africaImg.costadomarfim,
  },
  {
    id: id(),
    name: "Djibouti",
    flag: africaImg.djibouti,
  },
  {
    id: id(),
    name: "Egito",
    flag: africaImg.egito,
  },
  {
    id: id(),
    name: "Eritréia",
    flag: africaImg.eritreia,
  },
  {
    id: id(),
    name: "Etiópia",
    flag: africaImg.etiopia,
  },
  {
    id: id(),
    name: "Gabão",
    flag: africaImg.gabao,
  },
  {
    id: id(),
    name: "Gambia",
    flag: africaImg.gambia,
  },
  {
    id: id(),
    name: "Gana",
    flag: africaImg.gana,
  },
  {
    id: id(),
    name: "Guiné-Bissau",
    flag: africaImg.guinebissau,
  },
  {
    id: id(),
    name: "Guiné Equatorial",
    flag: africaImg.guineequatorial,
  },
  {
    id: id(),
    name: "Guiné",
    flag: africaImg.guine,
  },
  {
    id: id(),
    name: "Lesoto",
    flag: africaImg.lesoto,
  },
  {
    id: id(),
    name: "Libéria",
    flag: africaImg.liberia,
  },
  {
    id: id(),
    name: "Líbia",
    flag: africaImg.libia,
  },
  {
    id: id(),
    name: "Madagascar",
    flag: africaImg.madagascar,
  },
  {
    id: id(),
    name: "Malawi",
    flag: africaImg.malawi,
  },
  {
    id: id(),
    name: "Mali",
    flag: africaImg.mali,
  },
  {
    id: id(),
    name: "Marrocos",
    flag: africaImg.marrocos,
  },
  {
    id: id(),
    name: "Maurício",
    alias: ["Maurícia", "Mauritius"],
    flag: africaImg.mauricia,
  },
  {
    id: id(),
    name: "Mauritânia",
    flag: africaImg.mauritania,
  },
  {
    id: id(),
    name: "Moçambique",
    flag: africaImg.mocambique,
  },
  {
    id: id(),
    name: "Namíbia",
    flag: africaImg.namibia,
  },
  {
    id: id(),
    name: "Níger",
    flag: africaImg.niger,
  },
  {
    id: id(),
    name: "Nigéria",
    flag: africaImg.nigeria,
  },
  {
    id: id(),
    name: "Quênia",
    flag: africaImg.quenia,
  },
  {
    id: id(),
    name: "República Centro Africana",
    alias: ["África Central"],
    flag: africaImg.republicacentroafricana,
  },
  {
    id: id(),
    name: "República Democrática do Congo",
    alias: ["DR Congo", "Congo", "DROC"],
    flag: africaImg.republicademocraticadocongo,
  },
  {
    id: id(),
    name: "República do Congo",
    alias: ["Congo"],
    flag: africaImg.republicadocongo,
  },
  {
    id: id(),
    name: "Ruanda",
    flag: africaImg.ruanda,
  },
  {
    id: id(),
    name: "São Tomé e Príncipe",
    alias: ["São Tomé"],
    flag: africaImg.saotomeeprincipe,
  },
  {
    id: id(),
    name: "Senegal",
    flag: africaImg.senegal,
  },
  {
    id: id(),
    name: "Serra Leoa",
    flag: africaImg.serraleoa,
  },
  {
    id: id(),
    name: "Seychelles",
    flag: africaImg.seychelles,
  },
  {
    id: id(),
    name: "Somália",
    flag: africaImg.somalia,
  },
  {
    id: id(),
    name: "Suazilândia",
    alias: ["Essuatíni"],
    flag: africaImg.suazilandia,
  },
  {
    id: id(),
    name: "Sudão do Sul",
    flag: africaImg.sudaodosul,
  },
  {
    id: id(),
    name: "Sudão",
    flag: africaImg.sudao,
  },
  {
    id: id(),
    name: "Tanzânia",
    flag: africaImg.tanzania,
  },
  {
    id: id(),
    name: "Togo",
    flag: africaImg.togo,
  },
  {
    id: id(),
    name: "Tunísia",
    flag: africaImg.tunisia,
  },
  {
    id: id(),
    name: "Uganda",
    flag: africaImg.uganda,
  },
  {
    id: id(),
    name: "Zâmbia",
    flag: africaImg.zambia,
  },
  {
    id: id(),
    name: "Zimbábue",
    flag: africaImg.zimbabue,
  },
];

export const america = [
  {
    id: id(),
    name: "Antígua e Barbuda",
    alias: ["Antígua", "Barbuda"],
    flag: americaImg.antiguaebarbuda,
  },
  {
    id: id(),
    name: "Argentina",
    flag: americaImg.argentina,
  },
  {
    id: id(),
    name: "Bahamas",
    flag: americaImg.bahamas,
  },
  {
    id: id(),
    name: "Barbados",
    flag: americaImg.barbados,
  },
  {
    id: id(),
    name: "Belize",
    flag: americaImg.belize,
  },
  {
    id: id(),
    name: "Bolívia",
    flag: americaImg.bolivia,
  },
  {
    id: id(),
    name: "Brasil",
    flag: americaImg.brasil,
  },
  {
    id: id(),
    name: "Canadá",
    flag: americaImg.canada,
  },
  {
    id: id(),
    name: "Chile",
    flag: americaImg.chile,
  },
  {
    id: id(),
    name: "Colômbia",
    flag: americaImg.colombia,
  },
  {
    id: id(),
    name: "Costa Rica",
    flag: americaImg.costarica,
  },
  {
    id: id(),
    name: "Cuba",
    flag: americaImg.cuba,
  },
  {
    id: id(),
    name: "Dominica",
    flag: americaImg.dominica,
  },
  {
    id: id(),
    name: "El Salvador",
    flag: americaImg.elsalvador,
  },
  {
    id: id(),
    name: "Equador",
    flag: americaImg.equador,
  },
  {
    id: id(),
    name: "Estados Unidos da América",
    alias: ["Estados Unidos", "EUA"],
    flag: americaImg.estadosunidos,
  },
  {
    id: id(),
    name: "Granada",
    flag: americaImg.granada,
  },
  {
    id: id(),
    name: "Guatemala",
    flag: americaImg.guatemala,
  },
  {
    id: id(),
    name: "Guiana",
    flag: americaImg.guiana,
  },
  {
    id: id(),
    name: "Haiti",
    flag: americaImg.haiti,
  },
  {
    id: id(),
    name: "Honduras",
    flag: americaImg.honduras,
  },
  {
    id: id(),
    name: "Jamaica",
    flag: americaImg.jamaica,
  },
  {
    id: id(),
    name: "México",
    flag: americaImg.mexico,
  },
  {
    id: id(),
    name: "Nicarágua",
    flag: americaImg.nicaragua,
  },
  {
    id: id(),
    name: "Panamá",
    flag: americaImg.panama,
  },
  {
    id: id(),
    name: "Paraguai",
    flag: americaImg.paraguai,
  },
  {
    id: id(),
    name: "Peru",
    flag: americaImg.peru,
  },
  {
    id: id(),
    name: "República Dominicana",
    alias: ["Dominicana"],
    flag: americaImg.republicadominicana,
  },
  {
    id: id(),
    name: "Santa Lúcia",
    flag: americaImg.santalucia,
  },
  {
    id: id(),
    name: "São Cristóvão e Nevis",
    alias: ["São Cristóvão", "Nevis"],
    flag: americaImg.saocristovaoenevis,
  },
  {
    id: id(),
    name: "São Vicente e Granadinas",
    alias: ["São Vicente", "Granadinas"],
    flag: americaImg.saovicenteegranadinas,
  },
  {
    id: id(),
    name: "Suriname",
    flag: americaImg.suriname,
  },
  {
    id: id(),
    name: "Trinidad e Tobago",
    alias: ["Trinidad", "Tobago"],
    flag: americaImg.trinidadetobago,
  },
  {
    id: id(),
    name: "Uruguai",
    flag: americaImg.uruguai,
  },
  {
    id: id(),
    name: "Venezuela",
    flag: americaImg.venezuela,
  },
];

export const asia = [
  {
    id: id(),
    name: "Afeganistão",
    flag: asiaImg.afeganistao,
  },
  {
    id: id(),
    name: "Arábia Saudita",
    flag: asiaImg.arabiasaudita,
  },
  {
    id: id(),
    name: "Armênia",
    flag: asiaImg.armenia,
  },
  {
    id: id(),
    name: "Azerbaijão",
    flag: asiaImg.azerbaijao,
  },
  {
    id: id(),
    name: "Bahrein",
    flag: asiaImg.bahrein,
  },
  {
    id: id(),
    name: "Bangladesh",
    flag: asiaImg.bangladesh,
  },
  {
    id: id(),
    name: "Myanmnar",
    alias: ["Burma", "Birmânia"],
    flag: asiaImg.birmania,
  },
  {
    id: id(),
    name: "Brunei",
    flag: asiaImg.brunei,
  },
  {
    id: id(),
    name: "Butão",
    flag: asiaImg.butao,
  },
  {
    id: id(),
    name: "Camboja",
    alias: ["Cambodja"],
    flag: asiaImg.camboja,
  },
  {
    id: id(),
    name: "Catar",
    flag: asiaImg.catar,
  },
  {
    id: id(),
    name: "Cazaquistão",
    flag: asiaImg.cazaquistao,
  },
  {
    id: id(),
    name: "China",
    flag: asiaImg.china,
  },
  {
    id: id(),
    name: "Chipre",
    flag: asiaImg.chipre,
  },
  {
    id: id(),
    name: "Coréia do Norte",
    flag: asiaImg.coreiadonorte,
  },
  {
    id: id(),
    name: "Coréia do Sul",
    flag: asiaImg.coreiadosul,
  },
  {
    id: id(),
    name: "Emirados Árabes Unidos",
    alias: ["EAU"],
    flag: asiaImg.emiradosarabesunidos,
  },
  {
    id: id(),
    name: "Filipinas",
    flag: asiaImg.filipinas,
  },
  {
    id: id(),
    name: "Geórgia",
    flag: asiaImg.georgia,
  },
  {
    id: id(),
    name: "Iêmen",
    flag: asiaImg.iemen,
  },
  {
    id: id(),
    name: "Índia",
    flag: asiaImg.india,
  },
  {
    id: id(),
    name: "Indonésia",
    flag: asiaImg.indonesia,
  },
  {
    id: id(),
    name: "Iran",
    alias: ["Irão"],
    flag: asiaImg.iran,
  },
  {
    id: id(),
    name: "Iraque",
    flag: asiaImg.iraque,
  },
  {
    id: id(),
    name: "Israel",
    flag: asiaImg.israel,
  },
  {
    id: id(),
    name: "Japão",
    flag: asiaImg.japao,
  },
  {
    id: id(),
    name: "Jordânia",
    alias: ["Reino Haxemita da Jordânia"],
    flag: asiaImg.jordania,
  },
  {
    id: id(),
    name: "Kuwait",
    alias: ["Kuaite", "Cuaite"],
    flag: asiaImg.kuwait,
  },
  {
    id: id(),
    name: "Laos",
    flag: asiaImg.laos,
  },
  {
    id: id(),
    name: "Líbano",
    flag: asiaImg.libano,
  },
  {
    id: id(),
    name: "Malásia",
    flag: asiaImg.malasia,
  },
  {
    id: id(),
    name: "Maldivas",
    flag: asiaImg.maldivas,
  },
  {
    id: id(),
    name: "Mongólia",
    flag: asiaImg.mongolia,
  },
  {
    id: id(),
    name: "Nepal",
    flag: asiaImg.nepal,
  },
  {
    id: id(),
    name: "Omã",
    alias: ["Omão", "Sultanato de Omã"],
    flag: asiaImg.oma,
  },
  {
    id: id(),
    name: "Paquistão",
    flag: asiaImg.paquistao,
  },
  {
    id: id(),
    name: "Quirguistão",
    alias: ["Quirguizistão", "Quirguízia", "República Quirguiz"],
    flag: asiaImg.quirguistao,
  },
  {
    id: id(),
    name: "Singapura",
    flag: asiaImg.singapura,
  },
  {
    id: id(),
    name: "Síria",
    flag: asiaImg.siria,
  },
  {
    id: id(),
    name: "Sri Lanka",
    flag: asiaImg.srilanka,
  },
  {
    id: id(),
    name: "Tailândia",
    flag: asiaImg.tailandia,
  },
  {
    id: id(),
    name: "Taiwan",
    flag: asiaImg.taiwan,
  },
  {
    id: id(),
    name: "Tajiquistão",
    alias: ["Tadjiquistão"],
    flag: asiaImg.tajiquistao,
  },
  {
    id: id(),
    name: "Timor-Leste",
    flag: asiaImg.timorleste,
  },
  {
    id: id(),
    name: "Turcomenistão",
    alias: ["Turquemenistão"],
    flag: asiaImg.turcomenistao,
  },
  {
    id: id(),
    name: "Turquia",
    flag: asiaImg.turquia,
  },
  {
    id: id(),
    name: "Uzbequistão",
    alias: ["Usbequistão"],
    flag: asiaImg.uzbequistao,
  },
  {
    id: id(),
    name: "Vietnã",
    alias: ["Vietname"],
    flag: asiaImg.vietna,
  },
];

export const europe = [
  {
    id: id(),
    name: "Albânia",
    flag: europeImg.albania,
  },
  {
    id: id(),
    name: "Alemanha",
    flag: europeImg.alemanha,
  },
  {
    id: id(),
    name: "Andorra",
    flag: europeImg.andorra,
  },
  {
    id: id(),
    name: "Áustria",
    flag: europeImg.austria,
  },
  {
    id: id(),
    name: "Bélgica",
    flag: europeImg.belgica,
  },
  {
    id: id(),
    name: "Belarus",
    alias: ["Bielorússia"],
    flag: europeImg.bielorussia,
  },
  {
    id: id(),
    name: "Bósnia e Herzegovina",
    alias: ["Bósnia", "Herzegovina"],
    flag: europeImg.bosniaeherzegovina,
  },
  {
    id: id(),
    name: "Bulgária",
    flag: europeImg.bulgaria,
  },
  {
    id: id(),
    name: "Croácia",
    flag: europeImg.croacia,
  },
  {
    id: id(),
    name: "Dinamarca",
    flag: europeImg.dinamarca,
  },
  {
    id: id(),
    name: "Eslováquia",
    flag: europeImg.eslovaquia,
  },
  {
    id: id(),
    name: "Eslovênia",
    flag: europeImg.eslovenia,
  },
  {
    id: id(),
    name: "Espanha",
    flag: europeImg.espanha,
  },
  {
    id: id(),
    name: "Estônia",
    flag: europeImg.estonia,
  },
  {
    id: id(),
    name: "Finlândia",
    flag: europeImg.finlandia,
  },
  {
    id: id(),
    name: "França",
    flag: europeImg.franca,
  },
  {
    id: id(),
    name: "Grécia",
    flag: europeImg.grecia,
  },
  {
    id: id(),
    name: "Hungria",
    flag: europeImg.hungria,
  },
  {
    id: id(),
    name: "Irlanda",
    flag: europeImg.irlanda,
  },
  {
    id: id(),
    name: "Islândia",
    flag: europeImg.islandia,
  },
  {
    id: id(),
    name: "Itália",
    flag: europeImg.italia,
  },
  {
    id: id(),
    name: "Kosovo",
    flag: europeImg.kosovo,
  },
  {
    id: id(),
    name: "Letônia",
    flag: europeImg.letonia,
  },
  {
    id: id(),
    name: "Liechtenstein",
    flag: europeImg.liechtenstein,
  },
  {
    id: id(),
    name: "Lituânia",
    flag: europeImg.lituania,
  },
  {
    id: id(),
    name: "Luxemburgo",
    flag: europeImg.luxemburgo,
  },
  {
    id: id(),
    name: "Macedônia do Norte",
    alias: ["Macedonia"],
    flag: europeImg.macedoniadonorte,
  },
  {
    id: id(),
    name: "Malta",
    flag: europeImg.malta,
  },
  {
    id: id(),
    name: "Moldávia",
    flag: europeImg.moldavia,
  },
  {
    id: id(),
    name: "Mônaco",
    flag: europeImg.monaco,
  },
  {
    id: id(),
    name: "Montenegro",
    flag: europeImg.montenegro,
  },
  {
    id: id(),
    name: "Noruega",
    flag: europeImg.noruega,
  },
  {
    id: id(),
    name: "Países Baixos",
    alias: ["Holanda"],
    flag: europeImg.paisesbaixos,
  },
  {
    id: id(),
    name: "Polônia",
    flag: europeImg.polonia,
  },
  {
    id: id(),
    name: "Portugal",
    flag: europeImg.portugal,
  },
  {
    id: id(),
    name: "Reino Unido",
    flag: europeImg.reinounido,
  },
  {
    id: id(),
    name: "República Tcheca",
    alias: ["Chéquia", "Tchéquia", "Tcheca"],
    flag: europeImg.republicatcheca,
  },
  {
    id: id(),
    name: "Romênia",
    flag: europeImg.romenia,
  },
  {
    id: id(),
    name: "Rússia",
    flag: europeImg.russia,
  },
  {
    id: id(),
    name: "San Marino",
    alias: ["São Marino", "São Marinho"],
    flag: europeImg.sanmarino,
  },
  {
    id: id(),
    name: "Sérvia",
    flag: europeImg.servia,
  },
  {
    id: id(),
    name: "Suécia",
    flag: europeImg.suecia,
  },
  {
    id: id(),
    name: "Suíça",
    flag: europeImg.suica,
  },
  {
    id: id(),
    name: "Ucrânia",
    flag: europeImg.ucrania,
  },
  {
    id: id(),
    name: "Vaticano",
    flag: europeImg.vaticano,
  },
];

export const oceania = [
  {
    id: id(),
    name: "Austrália",
    flag: oceaniaImg.australia,
  },
  {
    id: id(),
    name: "Fiji",
    alias: ["Ilhas Fiji"],
    flag: oceaniaImg.fiji,
  },
  {
    id: id(),
    name: "Ilhas Marshall",
    alias: ["Marshall"],
    flag: oceaniaImg.ilhasmarshall,
  },
  {
    id: id(),
    name: "Ilhas Salomão",
    alias: ["Salomão"],
    flag: oceaniaImg.ilhassalomao,
  },
  {
    id: id(),
    name: "Kiribati",
    alias: ["Quiribati"],
    flag: oceaniaImg.kiribati,
  },
  {
    id: id(),
    name: "Estados Federados da Micronésia",
    alias: ["Micronésia", "EFM"],
    flag: oceaniaImg.micronesia,
  },
  {
    id: id(),
    name: "Nauru",
    flag: oceaniaImg.nauru,
  },
  {
    id: id(),
    name: "Nova Zelândia",
    flag: oceaniaImg.novazelandia,
  },
  {
    id: id(),
    name: "Palau",
    flag: oceaniaImg.palau,
  },
  {
    id: id(),
    name: "Papua-Nova Guiné",
    alias: ["Papuásia-Nova Guiné"],
    flag: oceaniaImg.papuanovaguine,
  },
  {
    id: id(),
    name: "Samoa",
    flag: oceaniaImg.samoa,
  },
  {
    id: id(),
    name: "Tonga",
    flag: oceaniaImg.tonga,
  },
  {
    id: id(),
    name: "Tuvalu",
    flag: oceaniaImg.tuvalu,
  },
  {
    id: id(),
    name: "Vanuatu",
    flag: oceaniaImg.vanuatu,
  },
];

export const all = [...africa, ...america, ...asia, ...europe, ...oceania];
