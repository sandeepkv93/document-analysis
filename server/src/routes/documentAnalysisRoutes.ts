import { Request, Response, Router } from 'express'
import { topNWords } from '../services/documentAnalysisService'
import { IDocAnalysisInput } from '../types/doc-analysis/IDocAnalysisInput'
import { TDocAnalysisOutput } from '../types/doc-analysis/IDocAnalysisOutput'

const documentAnalysisRouter: Router = Router()

/**
 * @route POST /api/document-analysis
 * @description Perform document analysis based on the provided input.
 *              Currently supports analysis of type 'top_words' which returns the top words
 *              from the text body based on the keyword macros provided.
 * @param {Request} req - The HTTP request object, containing the IDocAnalysisInput in the body.
 * @param {Response} res - The HTTP response object, used to send back the analysis result.
 * @returns {void} Returns a JSON response containing the analysis results.
 */

documentAnalysisRouter.post(
  '/document-analysis',
  (req: Request, res: Response): void => {
    const docAnalysisInput: IDocAnalysisInput = req.body

    /**
     * Validate the analysis type before proceeding.
     * Currently, only 'top_words' is supported. If an invalid type is provided,
     * return a 400 Bad Request response with an appropriate error message.
     */
    if (docAnalysisInput.analysis_type !== 'top_words') {
      res.status(400).json({ error: 'Invalid analysis type' })
    }

    /**
     * Perform the document analysis by mapping over each keyword_macro provided in the input.
     * The result will be an array of analysis outputs, each containing the keyword macro,
     * the type of analysis, and the resulting top words.
     */
    const result: TDocAnalysisOutput[] = docAnalysisInput.keyword_macros.map(
      (keyword_macro) => {
        const topWords: string[] = topNWords(
          docAnalysisInput.text_body,
          keyword_macro,
          3
        )
        return {
          keyword_macro,
          analysis_type: 'top_words',
          value: topWords,
        }
      }
    )

    /**
     * Send the result as a JSON response.
     */
    res.json(result)
  }
)

export default documentAnalysisRouter
