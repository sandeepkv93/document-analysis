import { Request, Response, Router } from 'express'
import { topThreeWords } from '../services/documentAnalysisService'
import { IDocAnalysisInput } from '../types/doc-analysis/IDocAnalysisInput'
import { TDocAnalysisOutput } from '../types/doc-analysis/IDocAnalysisOutput'

const documentAnalysisRouter: Router = Router()

// POST /api/document-analysis endpoint
documentAnalysisRouter.post(
  '/document-analysis',
  (req: Request, res: Response): void => {
    const input: IDocAnalysisInput = req.body

    let result: TDocAnalysisOutput[] = []

    // Perform analysis for each keyword_macro
    input.keyword_macros.forEach((keyword_macro) => {
      switch (input.analysis_type) {
        case 'top_words': {
          const topWords: string[] = topThreeWords(
            input.text_body,
            keyword_macro
          )
          result.push({
            keyword_macro,
            analysis_type: 'top_words',
            value: topWords,
          })
          break
        }
        default:
          return res.status(400).json({ error: 'Invalid analysis type' })
      }
    })

    res.json(result)
  }
)

export default documentAnalysisRouter
