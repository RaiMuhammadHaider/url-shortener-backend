import express from 'express'
const router = express.Router()
import { shortenPostRequestBodySchema } from '../validation/request.validation.js'
import { nanoid, urlAlphabet } from 'nanoid'
import { db } from '../src/index.js'
import { urlTable } from '../model/url.model.js'
import { ensureAuthenticated } from '../middleware/auth.middleware.js'
import { createShortUrl } from '../service/user.service.js'
import { and, eq } from 'drizzle-orm'


router.post("/shorten", ensureAuthenticated, async (req, res) => {
  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(req.body);

  if (!validationResult.success) {  // ✅ fix here
    return res.status(400).json({
      error: validationResult.error.format(),
    });
  }

  const { url, code } = validationResult.data;
  const shortCode = code ?? nanoid(6); // ✅ define before use

  const { id, shortCode: finalCode, targetUrl } = await createShortUrl(
    url,
    shortCode,
    req.user.id
  );

  return res.status(200).json({
    id,
    shortCode: finalCode,
    targetUrl,
  });
});

router.get('/code' , async (req , res)=> {
const result = await db.select(  ).from(urlTable).where(eq(urlTable.userId , req.user.id))
return res.status(200).json({result})
})


router.get('/:shortCode' , ensureAuthenticated  , async function (req  , res) { 
    const code = req.params.shortCode // params take the value from url and store it
        const [result] =  await db.select({
            targetUrl : urlTable.targetUrl
         }).from(urlTable).where(eq(urlTable.shortCode , code))

         if (!result) {
            return res.status(404).json({
                error : 'Invalid URL'
            })
         }

         return res.redirect(result.targetUrl)
} )

router.delete('/:id' ,ensureAuthenticated,  async function ( req , res ) {
    const id = req.params.id
  await db.delete(urlTable).where(and(eq(urlTable.id , id), eq(urlTable.userId , req.user.id  )))

    return res.status(200).json({
        deleted : true
    })
} )

router.patch("/update", ensureAuthenticated, async (req, res) => {
  const validation = await shortenPostRequestBodySchema.safeParseAsync(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: validation.error.format(),
    });
  }

  const { url, code } = validation.data;

  // You need the current shortCode from query/body to know which record to update
  const { currentShortCode } = req.body; // or get from query params

  const [result] = await db
    .update(urlTable)
    .set({
      shortCode: code ?? currentShortCode, 
      targetUrl: url,                       
    })
    .where(
      and(
        eq(urlTable.shortCode, currentShortCode),
        eq(urlTable.userId, req.user.id)
      )
    )
    .returning({
      id: urlTable.id,
      shortCode: urlTable.shortCode,
      targetUrl: urlTable.targetUrl,
    });

  return res.status(200).json({ result });
});
export default router