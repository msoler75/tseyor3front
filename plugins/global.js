import { LoremIpsum } from "lorem-ipsum";

export default ({ app }, inject) => {
  const ucFirst = texto => {
    return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : "";
  };
  const teaser = (texto, len) => {
    if (texto && texto.length < len) return texto;
    return texto?texto.substr(0, len) + "...":'';
  };
  /**
   *
   * @param {*} param >0 -> sentences / <0 -> paragraphs
   * @param {*} wordsMin
   * @param {*} wordsMax
   * @returns
   */
  const lorem = (param, wordsMin, wordsMax) => {
    if (!wordsMin) wordsMin = 5;
    if (!wordsMax) wordsMax = 14;
    const mylorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 7,
        min: 3
      },
      wordsPerSentence: {
        max: wordsMax,
        min: wordsMin
      },
    }, param>0?"plain":"html");
    if (param > 0) return mylorem.generateSentences(param);
    else return mylorem.generateParagraphs(-param);
  };

  const slugify = (str) => {
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    const to = "aaaaeeeeiiiioooouuuunc------";

    for (let i = 0, l = from.length; i < l; i++)
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  }
  inject("ucFirst", ucFirst);
  inject("teaser", teaser);
  inject("lorem", lorem);
  inject("slugify", slugify)
};
