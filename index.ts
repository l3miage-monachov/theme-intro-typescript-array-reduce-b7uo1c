// Import stylesheets
import './style.css';
import './utils';
import { LogTests } from './utils';

/***********************************************************************************************************************
 * Somme pondérée des éléments d'un tableau
 * Chaque élément est pondéré par l'index auquel il se trouve
 * On fait la somme de ces éléments pondérés.
 * On renvoie 0 en cas de tableau vide.
 */
function SommePondérée(...L: number[]): number {
  return L.reduce((acc, v, i) => {
    return v * i + acc;
  }, 0);
}
LogTests<Parameters<typeof SommePondérée>, ReturnType<typeof SommePondérée>>(
  'Somme pondéré des éléments multipliés par leur index',
  SommePondérée,
  'SommePondérée',
  [
    { args: [8674], expectedResult: 0 },
    { args: [6, 7], expectedResult: 7 },
    { args: [6, 7, 2, 9, 3, 6, 8], expectedResult: 128 },
    { args: [], expectedResult: 0 },
    { args: [5, 4, 3, 2, 1, 0], expectedResult: 20 },
  ]
);

/***********************************************************************************************************************
 * Taille de la plus grande string
 * Renvoie -1 si le tableau est vide.
 */
function tailleMax(...L: string[]): number {
  return L.reduce((acc, v) => {
    return acc < v.length ? v.length : acc;
  }, -1);
}
LogTests<Parameters<typeof tailleMax>, ReturnType<typeof tailleMax>>(
  'Taille de la plus grande string',
  tailleMax,
  'tailleMax',
  [
    { args: ['a', 'coucou ça va', 'bob', 'oui oui'], expectedResult: 12 },
    { args: [], expectedResult: -1 },
  ]
);

/***********************************************************************************************************************
 * Fonction qui renvoie un objet à partir d'un tableau
 * Chaque valeur du tableau devient un attribut de l'objet
 * La valeur de cet attribut est l'index de l'élément dans le tableau.
 * Si obj est un objet, k une string et i un index,
 * alors il est possible d'ajouter l'attribut k à obj avec la valeur i de la sorte :
 * obj[k] = i
 */
function toStrangeObject(...L: string[]): { [key: string]: number } {
  return L.reduce((obj, value, index) => {
    obj[value] = index;
    return obj;
  }, {});
}
LogTests<
  Parameters<typeof toStrangeObject>,
  ReturnType<typeof toStrangeObject>
>("Object étrange à partir d'un tableau", toStrangeObject, 'toStrangeObject', [
  { args: [], expectedResult: {} },
  {
    args: ['arf'],
    expectedResult: {
      arf: 0,
    },
  },
  {
    args: ['a', 'blob'],
    expectedResult: {
      a: 0,
      blob: 1,
    },
  },
  {
    args: ['a', 'coucou ça va', 'bob', 'oui oui'],
    expectedResult: {
      a: 0,
      'coucou ça va': 1,
      bob: 2,
      'oui oui': 3,
    },
  },
]);
