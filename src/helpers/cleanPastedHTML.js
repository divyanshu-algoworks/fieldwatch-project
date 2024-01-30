export default function cleanPastedHTML(input) {
  let output = null,
    tabStripper = /\t/g,
    tagStripper = /( )*<(\/)*(meta|link|\\?xml:|st1:|o:|w:)(.*?)>( )*/gi,
    classStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)|style=""/g,
    commentStripper = /<!--(.*?)-->/g,
    phrasesStripper = /(\w+)\n(\w+)/gi;

  output = input.replace(tabStripper, '&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(phrasesStripper, '$1 $2')
    .replace(classStripper, '')
    .replace(commentStripper, '')
    .replace(tagStripper, '')

  return output;
};
