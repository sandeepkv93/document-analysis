export const fillerWordsSet: Set<string> = new Set([
  'and',
  'the',
  'a',
  'an',
  'of',
  'in',
  'to',
  'or',
])

export function parseKeywordMacro(keyword_macro: string): {
  wordsToInclude: string[]
  wordsToExclude: string[]
} {
  const wordsToInclude: string[] = []
  const wordsToExclude: string[] = []

  const includeParts: string[] = keyword_macro.split('+')

  includeParts.forEach((part: string) => {
    const [firstWord, ...excludeWords]: string[] = part.split('-')

    if (firstWord) {
      wordsToInclude.push(firstWord.trim())
    }

    excludeWords.forEach((word: string) => {
      if (word) {
        wordsToExclude.push(word.trim())
      }
    })
  })

  return { wordsToInclude, wordsToExclude }
}

export function mergeWordFrequencyArraysIntoOne(
  wordFrequencyArrays: { [key: string]: number }[]
): { [key: string]: number } {
  const mergedWordFrequency: { [key: string]: number } = {}

  wordFrequencyArrays.forEach((wordFrequency: { [key: string]: number }) => {
    Object.keys(wordFrequency).forEach((word: string) => {
      if (mergedWordFrequency[word]) {
        mergedWordFrequency[word] += wordFrequency[word]
      } else {
        mergedWordFrequency[word] = wordFrequency[word]
      }
    })
  })

  return mergedWordFrequency
}
