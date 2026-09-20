// Noto Sans covers Latin/Cyrillic/Greek/Vietnamese. The other families are
// large and only loaded when a card contains their script. Add a row here and
// the family to the Google Fonts <link> in index.html to support another script.
const BASE_FONT = 'Noto Sans'

const SCRIPT_FONTS: { name: string; test: RegExp }[] = [
  { name: 'Noto Sans Arabic', test: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFC]/ },
  { name: 'Noto Sans Hebrew', test: /[֐-׿]/ },
  { name: 'Noto Sans Devanagari', test: /[ऀ-ॿ]/ },
  { name: 'Noto Sans SC', test: /[㐀-䶿一-鿿]/ },
  { name: 'Noto Sans JP', test: /[぀-ヿ]/ },
  { name: 'Noto Sans KR', test: /[가-힣]/ },
]

export function fontFamiliesFor(text: string): string[] {
  return [BASE_FONT, ...SCRIPT_FONTS.filter(({ test }) => test.test(text)).map(({ name }) => name)]
}

export function fontStackFor(families: string[]): string {
  return families.map((f) => `"${f}"`).join(',') + ',sans-serif'
}
