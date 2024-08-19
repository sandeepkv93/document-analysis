import {
  fillerWordsSet,
  mergeWordFrequencyArraysIntoOne,
  parseKeywordMacro,
} from '../utils/documentAnalysisHelper'

export function topThreeWords(text: string, keyword_macro: string): string[] {
  const { wordsToInclude, wordsToExclude } = parseKeywordMacro(keyword_macro)

  console.log('wordsToInclude', wordsToInclude)
  console.log('wordsToExclude', wordsToExclude)

  // Split the text into sentences and store them in an array
  const sentences: string[] = text.split('.')

  // Create a array of hashmaps to store the words and their frequency for each sentence
  const sentenceWordFrequency: { [key: string]: number }[] = []

  // Iterate over each sentence in the text
  sentences.forEach((sentence: string) => {
    // Create a hashmap to store the frequency of each word in the sentence
    const wordFrequency: { [key: string]: number } = {}

    console.log('Sentence => ', sentence)

    // Split the sentence into words and store them in an array
    const words: string[] = sentence.split(' ')

    // Iterate over each word in the sentence
    words.forEach((word: string) => {
      if (!word) {
        return
      }

      // Remove any special characters and symbols from the word
      word = word.replace(/[^a-zA-Z ]/g, '').toLowerCase()

      // Skip the word if it is a filler word
      if (fillerWordsSet.has(word)) {
        return
      }

      // Increment the frequency of the word in the hashmap
      if (wordFrequency[word]) {
        wordFrequency[word]++
      } else {
        wordFrequency[word] = 1
      }
    })

    // parse through the wordsToExclude, if the hashmap contains any of the words, skip the forEach loop and continue to the next sentence
    let skipSentence = false
    wordsToExclude.forEach((word) => {
      if (wordFrequency[word]) {
        skipSentence = true
      }
    })

    if (skipSentence) {
      return // Skip the current sentence
    }

    // Check if the sentence contains all the words in the wordsToInclude array and add it to the sentenceWordFrequency array
    let includeSentence = true
    wordsToInclude.forEach((word) => {
      if (!wordFrequency[word]) {
        includeSentence = false
      }

      // check if word is a subsequence of any key in the wordFrequency hashmap and in that case set includeSentence to true
      Object.keys(wordFrequency).forEach((key) => {
        if (key.includes(word)) {
          includeSentence = true
        }
      })
    })

    if (!includeSentence) {
      return // Skip the current sentence
    }

    console.log('Sentence => ', sentence, ' ~~~ is not skipped')
    sentenceWordFrequency.push(wordFrequency)
  })

  console.log('sentenceWordFrequency', sentenceWordFrequency)

  let mergedWordFrequency: { [key: string]: number } =
    mergeWordFrequencyArraysIntoOne(sentenceWordFrequency)

  Object.keys(mergedWordFrequency).forEach((key) => {
    if (!key) {
      delete mergedWordFrequency[key]
    }
  })

  console.log('mergedWordFrequency', mergedWordFrequency)

  // Remove the wordsToInclude from the mergedWordFrequency
  wordsToInclude.forEach((word) => {
    delete mergedWordFrequency[word]
  })

  const sortedWords: string[] = Object.keys(mergedWordFrequency).sort(
    (a: string, b: string) => mergedWordFrequency[b] - mergedWordFrequency[a]
  )

  let topThreeWordsResult: string[] = sortedWords.slice(0, 3)
  console.log('topThreeWordsResult', topThreeWordsResult)
  return topThreeWordsResult
}
