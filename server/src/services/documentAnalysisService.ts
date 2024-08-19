import {
  fillerWordsSet,
  getTopNWords,
  parseKeywordMacro,
} from '../utils/documentAnalysisHelper'

/**
 * Analyzes a given text to determine the top three words, excluding certain words or phrases,
 * and based on specific inclusion and exclusion criteria.
 *
 * @function
 * @param {string} text - The input text to be analyzed, consisting of multiple sentences.
 * @param {string} keyword_macro - A string defining the keywords to include and exclude,
 * separated by `+` for inclusion and `-` for exclusion.
 * @param {number} n - The number of top words to return.
 *
 * @returns {string[]} - An array of the top three words from the text, sorted by frequency
 * in descending order. If multiple words have the same frequency, they are sorted alphabetically in descending order.
 *
 * @example
 * const text = "This is a test. Testing is important. Test cases are essential.";
 * const keyword_macro = "test+important-testing";
 *
 * const result = topNWords(text, keyword_macro, 3);
 * console.log(result); // Output: ['cases', 'are', 'essential']
 */
export function topNWords(
  text: string,
  keyword_macro: string,
  n: number
): string[] {
  const { wordsToInclude, wordsToExclude } = parseKeywordMacro(keyword_macro)

  // Split the text into sentences and trim any extra whitespace
  const sentences = text.split('.').map((sentence) => sentence.trim())

  /**
   * Aggregate word frequencies across all sentences that meet the inclusion and exclusion criteria.
   *
   * @param {Object} acc - The accumulator object storing the merged word frequencies.
   * @param {string} sentence - The current sentence being processed.
   * @returns {Object} - The updated accumulator with merged word frequencies.
   */
  const mergedWordFrequency = sentences.reduce<{ [key: string]: number }>(
    (acc, sentence) => {
      const wordFrequency: { [key: string]: number } = {}

      // Split the sentence into words, clean them, and convert to lowercase
      const words = sentence.split(' ').map(
        (word) =>
          word
            .replace(/[^a-zA-Z]/g, '') // Remove non-alphabetic characters
            .toLowerCase() // Convert to lowercase
            .trim() // Trim whitespace
      )

      // Check if the sentence includes all words required by wordsToInclude
      const includeSentence = wordsToInclude.every((word) =>
        words.some((w) => w.includes(word))
      )

      // Check if the sentence should be excluded based on wordsToExclude or their subsequences
      const excludeSentence = wordsToExclude.some((word) =>
        words.some((w) => w.includes(word))
      )

      // If the sentence should not be included or should be excluded, skip it
      if (!includeSentence || excludeSentence) {
        return acc
      }

      // Count word frequencies in the sentence, excluding filler words
      words.forEach((word) => {
        if (word && !fillerWordsSet.has(word)) {
          wordFrequency[word] = (wordFrequency[word] || 0) + 1
        }
      })

      // Merge the current sentence's word frequencies into the accumulated frequencies
      Object.keys(wordFrequency).forEach((word) => {
        acc[word] = (acc[word] || 0) + wordFrequency[word]
      })

      return acc
    },
    {}
  )

  return getTopNWords(mergedWordFrequency, wordsToInclude, n)
}
