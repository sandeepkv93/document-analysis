import {
  getTopNWords,
  mergeWordFrequencyArraysIntoOne,
  parseKeywordMacro,
} from '../utils/documentAnalysisHelper'

describe('parseKeywordMacro', () => {
  test('should correctly parse single word without any operators', () => {
    const result: { wordsToInclude: string[]; wordsToExclude: string[] } =
      parseKeywordMacro('word1')
    expect(result).toEqual({
      wordsToInclude: ['word1'],
      wordsToExclude: [],
    })
  })

  test('should correctly parse words to include with "+" operator', () => {
    const result: { wordsToInclude: string[]; wordsToExclude: string[] } =
      parseKeywordMacro('word1+word2')
    expect(result).toEqual({
      wordsToInclude: ['word1', 'word2'],
      wordsToExclude: [],
    })
  })

  test('should correctly parse words to exclude with "-" operator', () => {
    const result: { wordsToInclude: string[]; wordsToExclude: string[] } =
      parseKeywordMacro('word1-word2')
    expect(result).toEqual({
      wordsToInclude: ['word1'],
      wordsToExclude: ['word2'],
    })
  })

  test('should correctly parse multiple words to include and exclude', () => {
    const result: { wordsToInclude: string[]; wordsToExclude: string[] } =
      parseKeywordMacro('word1+word2-word3+word4-word5')
    expect(result).toEqual({
      wordsToInclude: ['word1', 'word2', 'word4'],
      wordsToExclude: ['word3', 'word5'],
    })
  })

  test('should trim whitespace around words', () => {
    const result: { wordsToInclude: string[]; wordsToExclude: string[] } =
      parseKeywordMacro(' word1 + word2 - word3 ')
    expect(result).toEqual({
      wordsToInclude: ['word1', 'word2'],
      wordsToExclude: ['word3'],
    })
  })

  test('should handle empty input', () => {
    const result: { wordsToInclude: string[]; wordsToExclude: string[] } =
      parseKeywordMacro('')
    expect(result).toEqual({
      wordsToInclude: [],
      wordsToExclude: [],
    })
  })

  test('should handle input with only "-" operator', () => {
    const result: { wordsToInclude: string[]; wordsToExclude: string[] } =
      parseKeywordMacro('word1-word2-word3')
    expect(result).toEqual({
      wordsToInclude: ['word1'],
      wordsToExclude: ['word2', 'word3'],
    })
  })

  test('should handle input with only "+" operator', () => {
    const result: { wordsToInclude: string[]; wordsToExclude: string[] } =
      parseKeywordMacro('word1+word2+word3')
    expect(result).toEqual({
      wordsToInclude: ['word1', 'word2', 'word3'],
      wordsToExclude: [],
    })
  })

  test('should handle input with leading and trailing operators', () => {
    const result: { wordsToInclude: string[]; wordsToExclude: string[] } =
      parseKeywordMacro('+word1-word2+word3-')
    expect(result).toEqual({
      wordsToInclude: ['word1', 'word3'],
      wordsToExclude: ['word2'],
    })
  })

  test('should correctly parse words with complex combinations', () => {
    const result: { wordsToInclude: string[]; wordsToExclude: string[] } =
      parseKeywordMacro('word1-word2+word3-word4+word5')
    expect(result).toEqual({
      wordsToInclude: ['word1', 'word3', 'word5'],
      wordsToExclude: ['word2', 'word4'],
    })
  })

  test('should handle repeated words in includes and excludes', () => {
    const result: { wordsToInclude: string[]; wordsToExclude: string[] } =
      parseKeywordMacro('word1+word1-word2-word2')
    expect(result).toEqual({
      wordsToInclude: ['word1', 'word1'],
      wordsToExclude: ['word2', 'word2'],
    })
  })
})

describe('mergeWordFrequencyArraysIntoOne', () => {
  test('should merge a single frequency array correctly', () => {
    const wordFrequencyArrays: { [key: string]: number }[] = [
      { word1: 2, word2: 3 },
    ]
    const result: { [key: string]: number } =
      mergeWordFrequencyArraysIntoOne(wordFrequencyArrays)
    expect(result).toEqual({ word1: 2, word2: 3 })
  })

  test('should handle arrays with zero frequencies correctly', () => {
    const wordFrequencyArrays: { [key: string]: number }[] = [
      { word1: 0, word2: 0 },
      { word1: 3, word2: 0 },
    ]
    const result: { [key: string]: number } =
      mergeWordFrequencyArraysIntoOne(wordFrequencyArrays)
    expect(result).toEqual({ word1: 3, word2: 0 })
  })

  test('should correctly merge when all words are identical across arrays', () => {
    const wordFrequencyArrays: { [key: string]: number }[] = [
      { word1: 1, word2: 2 },
      { word1: 1, word2: 2 },
      { word1: 1, word2: 2 },
    ]
    const result: { [key: string]: number } =
      mergeWordFrequencyArraysIntoOne(wordFrequencyArrays)
    expect(result).toEqual({ word1: 3, word2: 6 })
  })

  test('should handle a large number of arrays and words correctly', () => {
    const wordFrequencyArrays: { [key: string]: number }[] = Array(1000).fill({
      word1: 1,
      word2: 2,
    })
    const result: { [key: string]: number } =
      mergeWordFrequencyArraysIntoOne(wordFrequencyArrays)
    expect(result).toEqual({ word1: 1000, word2: 2000 })
  })
})

describe('getTopNWords', () => {
  test('should return the top N words sorted by frequency', () => {
    const mergedWordFrequency = {
      apple: 3,
      banana: 2,
      cherry: 4,
      date: 1,
    }
    const result = getTopNWords(mergedWordFrequency, [], 3)
    expect(result).toEqual(['cherry', 'apple', 'banana'])
  })

  test('should return fewer than N words if there are not enough unique words', () => {
    const mergedWordFrequency = {
      apple: 3,
      banana: 2,
    }
    const result = getTopNWords(mergedWordFrequency, [], 5)
    expect(result).toEqual(['apple', 'banana'])
  })

  test('should exclude words specified in wordsToInclude', () => {
    const mergedWordFrequency = {
      apple: 3,
      banana: 2,
      cherry: 4,
      date: 1,
    }
    const result = getTopNWords(mergedWordFrequency, ['banana'], 3)
    expect(result).toEqual(['cherry', 'apple', 'date'])
  })

  test('should return an empty array if all words are excluded', () => {
    const mergedWordFrequency = {
      apple: 3,
      banana: 2,
    }
    const result = getTopNWords(mergedWordFrequency, ['apple', 'banana'], 3)
    expect(result).toEqual([])
  })

  test('should handle empty mergedWordFrequency gracefully', () => {
    const mergedWordFrequency = {}
    const result = getTopNWords(mergedWordFrequency, [], 3)
    expect(result).toEqual([])
  })

  test('should return top N words sorted alphabetically if frequencies are equal', () => {
    const mergedWordFrequency = {
      apple: 2,
      banana: 2,
      cherry: 2,
    }
    const result = getTopNWords(mergedWordFrequency, [], 3)
    expect(result).toEqual(['cherry', 'banana', 'apple'])
  })

  test('should correctly exclude words and return top N from remaining', () => {
    const mergedWordFrequency = {
      apple: 3,
      banana: 2,
      cherry: 2,
      date: 4,
    }
    const result = getTopNWords(mergedWordFrequency, ['date', 'banana'], 2)
    expect(result).toEqual(['apple', 'cherry'])
  })

  test('should handle large numbers of words and frequencies correctly', () => {
    const mergedWordFrequency = {
      apple: 100,
      banana: 90,
      cherry: 80,
      date: 70,
      elderberry: 60,
    }
    const result = getTopNWords(mergedWordFrequency, [], 3)
    expect(result).toEqual(['apple', 'banana', 'cherry'])
  })

  test('should handle a case where N is 0 and return an empty array', () => {
    const mergedWordFrequency = {
      apple: 3,
      banana: 2,
      cherry: 4,
      date: 1,
    }
    const result = getTopNWords(mergedWordFrequency, [], 0)
    expect(result).toEqual([])
  })

  test('should not break when wordsToInclude contains words not in mergedWordFrequency', () => {
    const mergedWordFrequency = {
      apple: 3,
      banana: 2,
      cherry: 4,
      date: 1,
    }
    const result = getTopNWords(mergedWordFrequency, ['grape'], 3)
    expect(result).toEqual(['cherry', 'apple', 'banana'])
  })
})
