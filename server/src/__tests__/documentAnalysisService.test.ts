import { topNWords } from '../services/documentAnalysisService'

describe('topNWords', () => {
  test('should correctly when only one subword is present in the keyword macro', () => {
    const inputText =
      'Confidentiality Agreement This Confidentiality Agreement ("Agreement") is made and entered into as of the ___ day of ___, 2024 ("Effective Date"), by and between ABC Corporation, a Delaware corporation with its principal place of business at 123 Main Street, Anytown, USA ("Disclosing Party"), and XYZ Inc, a California corporation with its principal place of business at 456 Elm Street, Othertown, USA ("Receiving Party"). Definition of Confidential Information. For purposes of this Agreement, "Confidential Information" means all non-public, confidential, or proprietary information disclosed by the Disclosing Party to the Receiving Party, whether disclosed orally or in writing, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure. Confidential Information includes, but is not limited to, business plans, technical data, trade secrets, know-how, research and development, product plans, products, services, customer lists, and financial information.'
    const keywordMacro = 'confidential'
    const result: string[] = topNWords(inputText, keywordMacro, 3)
    expect(result).toEqual(['information', 'party', 'agreement'])
  })
})
