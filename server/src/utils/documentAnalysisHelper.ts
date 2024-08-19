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

/**
 * Parses a keyword macro and returns an object containing the words to include and exclude.
 *
 * @param keyword_macro - The keyword macro to parse.
 * @returns An object with the following properties:
 *   - wordsToInclude: An array of strings representing the words to include.
 *   - wordsToExclude: An array of strings representing the words to exclude.
 */
export function parseKeywordMacro(keyword_macro: string): {
  wordsToInclude: string[]
  wordsToExclude: string[]
} {
  const wordsToInclude: string[] = []
  const wordsToExclude: string[] = []

  const includeParts: string[] = keyword_macro.split('+')

  includeParts.forEach((part: string) => {
    const excludeWords: string[] = part.split('-').slice(1)

    const firstWord = part.split('-')[0].trim()
    if (firstWord) {
      wordsToInclude.push(firstWord)
    }

    excludeWords.forEach((word: string) => {
      if (word) {
        wordsToExclude.push(word.trim())
      }
    })
  })

  return { wordsToInclude, wordsToExclude }
}

/**
 * Merges an array of word frequency objects into a single word frequency object.
 *
 * @param wordFrequencyArrays - An array of word frequency objects.
 * @returns The merged word frequency object.
 */
export function mergeWordFrequencyArraysIntoOne(
  wordFrequencyArrays: { [key: string]: number }[]
): { [key: string]: number } {
  const mergedWordFrequency: { [key: string]: number } = {}

  wordFrequencyArrays.forEach((wordFrequency: { [key: string]: number }) => {
    Object.entries(wordFrequency).forEach(([word, frequency]) => {
      mergedWordFrequency[word] = (mergedWordFrequency[word] || 0) + frequency
    })
  })

  return mergedWordFrequency
}
