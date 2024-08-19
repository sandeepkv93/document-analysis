import express, { Application } from 'express'
import request from 'supertest'
import documentAnalysisRouter from '../routes/documentAnalysisRoutes'
import { IDocAnalysisInput } from '../types/doc-analysis/IDocAnalysisInput'
import { TDocAnalysisOutput } from '../types/doc-analysis/IDocAnalysisOutput'
const app: Application = express()
app.use(express.json())
app.use('/api', documentAnalysisRouter)

describe('Document Analysis Router', () => {
  it('should respond with 200 status and top words for a given document', async () => {
    const docAnalysisInput: IDocAnalysisInput = {
      text_body:
        'Confidentiality Agreement This Confidentiality Agreement ("Agreement") is made and entered into as of the ___ day of ___, 2024 ("Effective Date"), by and between ABC Corporation, a Delaware corporation with its principal place of business at 123 Main Street, Anytown, USA ("Disclosing Party"), and XYZ Inc, a California corporation with its principal place of business at 456 Elm Street, Othertown, USA ("Receiving Party"). Definition of Confidential Information. For purposes of this Agreement, "Confidential Information" means all non-public, confidential, or proprietary information disclosed by the Disclosing Party to the Receiving Party, whether disclosed orally or in writing, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure. Confidential Information includes, but is not limited to, business plans, technical data, trade secrets, know-how, research and development, product plans, products, services, customer lists, and financial information.',
      keyword_macros: ['confidential'],
      analysis_type: 'top_words',
    }

    const expectedResponse: TDocAnalysisOutput[] = [
      {
        keyword_macro: 'confidential',
        analysis_type: 'top_words',
        value: ['information', 'party', 'agreement'],
      },
    ]

    const response = await request(app)
      .post('/api/document-analysis')
      .send(docAnalysisInput)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(expectedResponse)
  })
})
