import Path from "path";
// import sizeOf from "image-size";
// import { LoremIpsum } from "lorem-ipsum";

export default ({ app, $config, $md, $img }, inject) => {
  const ucFirst = texto => {
    return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : "";
  };
  const teaser = (texto, len) => {
    if(!texto) return ''
    if (texto.length < len) return texto;
    return texto.substr(0, len) + "...";
  };

  /**
   * Generate Lorem Ipsum text
   * @param {*} param >0 -> sentences / <0 -> paragraphs
   * @param {*} wordsMin
   * @param {*} wordsMax
   * @returns
   */
  /* const lorem = (param, wordsMin, wordsMax) => {
    if (!wordsMin) wordsMin = 5;
    if (!wordsMax) wordsMax = 14;
    const mylorem = new LoremIpsum(
      {
        sentencesPerParagraph: {
          max: 7,
          min: 3
        },
        wordsPerSentence: {
          max: wordsMax,
          min: wordsMin
        }
      },
      param > 0 ? "plain" : "html"
    );
    if (param > 0) return mylorem.generateSentences(param);
    else return mylorem.generateParagraphs(-param);
  }; */

  const slugify = str => {
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
  };

  const renderMarkdownServer = (md, images, keepTitle) => {
    if(!md) return ""
    if(!keepTitle)
    {
      const pos = md.search('----')
      if(pos>-1 && pos<200)
        md = md.replace(/.*\n---+\n/m, '')
    }
    var html = $md.render(md);
    // console.warn(html);
    html = html
      .replace(/(<img[^>]+>)<br \/>\n?\s*(<img)/gm, "$1\n$2")
      .replace(/(<img[^>]+>)<br \/>\n?\s*(<img)/gm, "$1\n$2")
      .replace(
        /<p[^>]*>(?:<strong>)?((?:\s*<img[^>]+>[\s\n]*)+)(?:<\/strong>)?<\/p>/gm,
        "$1"
      )
      .replace(
        /<p[^>]*>(<img[^>]+>)<br\s*\/?>\n(.+?)<\/p>/g,
        "<figure>$1<figcaption>$2</figcaption></figure>"
      )
      .replace(/<img[^>]+>/g, p0 => {
        const data = p0.match(/src=['"]([^'"]+)['"]/);
        if (!data || !data[1]) return p0;
        const src = data[1];
        var sizes = "xs:100vw xm:100vw sm:100vw md:100vw lg:100vw";
        const opts = {
          format: "webp",
          quality: 80
        };
        if (images && src.charAt(0) === "/") {
          // console.warn('publicFolder', $config)
          const img = images.find(x => x.url === src);
          if (img) {
            console.log("found img", img);
            // console.log('dimensions', dimensions)
            const screens = {
              xs: 320,
              xm: 480,
              sm: 640,
              md: 768,
              lg: 1024
              // xl: 1280,
              // xxl: 1536,
              // '2xl': 1536
            };
            sizes = [];
            for (const s in screens) {
              if (img.width >= screens[s]) sizes.push(`${s}:100vw`);
              else {
                sizes.push(`${s}:${img.width}px`);
                break;
              }
            }
            sizes = sizes.join(" ");
            console.log("sizes for width", img.width, "are", sizes);
            opts.width = img.width;
            opts.height = img.height;
          }
          const imgr = $img.getSizes(src, {
            sizes,
            modifiers: opts
          });
          console.warn(imgr);

          return `<img
            loading="lazy"
            src="${$img(src, { quality: 70 })}"
            srcset="${imgr.srcset}"
            sizes="${imgr.sizes}"
          >`;
        }

        return p0;
      });

    return html;
  };

  inject("ucFirst", ucFirst);
  inject("teaser", teaser);
  // inject("lorem", lorem);
  inject("slugify", slugify);
  inject("renderMarkdownServer", renderMarkdownServer);
};
