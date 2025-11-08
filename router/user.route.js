import express from 'express'
import { db } from '../src/index.js'
import { usersTable } from '../model/index.ts'
import jwt from 'jsonwebtoken'
// import { randomBytes , createHmac } from 'crypto'
import { eq } from 'drizzle-orm'
import { signupPostRequestBodySchema , loginPostRequestBodySchema } from '../validation/request.validation.js'
import { HashedPasswordWithSalt } from '../util/hash.util.js'
import { getUserByEmail } from '../service/user.service.js'
import { createUserToken } from '../util/token.js' 

const router = express.Router()

router.post('/signup' , async( req , res ) => {
            const validationResult =    await signupPostRequestBodySchema.safeParseAsync(req.body) // for validation 
    // const {firstName , lastName , email  , password } = req.body
    if (validationResult.error) {
        return res.status(400).json({
            error : validationResult.error.format()
        })
    }
        const {firstName , lastName , email , password} =    validationResult.data
    // const [existingUser] = await db.select(
    //   {
    //       id : usersTable.id,
    //     }

    // ).from(usersTable).where(eq(usersTable.email , email))
    // if (existingUser) return res.status(400).json({
    //         error : `User with ${email} , already exist`
    //     })
            const existingUser = await getUserByEmail(email)
             if (existingUser) return res.status(400).json({
                error : `User with ${email} , already exist`
            })
    
   const {salt , password : hashedPassword }  = HashedPasswordWithSalt(password) // this one is the function that we have made in utils as this function is returning 2 thing so we destructure it
//  const salt = randomBytes(256).toString('hex')
//     const hashedPassword = createHmac('sha256', salt).update(password).digest('hex')
    const [newUser] = await db.insert(usersTable).values({
        firstName,
        lastName,
        email,
        salt,
        password: hashedPassword,
    }).returning({
        id : usersTable.id
    })

    return res.status(201).json({
        status : 'SUCCESS',
        data : {
      userId : newUser.id
        }
    })
    

} )

router.post('/login'  , async(req , res) => {
    const validateResult = await loginPostRequestBodySchema.safeParseAsync(req.body)
    if (validateResult.error) {
        return res.status(400).json({error : validateResult.error.format()})
    }

    const {email , password}  = validateResult.data
    const user = await getUserByEmail(email)
    if (!user) {
        return res.status(404).json({
            errror : "User does not Exist"
        })
    }


    const {password : hashedPassword } = HashedPasswordWithSalt(password , user.salt)
    if (user.password !== hashedPassword) {
         console.log(user.password);
    console.log(hashedPassword);
        return res.status(400).json({error : 'Invalid password'})
    }
   
    
    
    const payload = {
        id : user.id
    }
    // const token = jwt.sign(payload , process.env.jwt_secret)
    const token = await createUserToken(payload)

    return res.json({
        token
    })

    

} )

export default router