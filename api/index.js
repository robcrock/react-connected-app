import "./env.js"
import express from "express"
const app = express()
import path from "path"
import { fileURLToPath } from "url"
import { connectDb } from "./db.js"
import { registerUser } from "./accounts/register.js"
import { authorizeUser } from "./accounts/authorize.js"
import { logUserIn } from "./accounts/logUserIn.js"
import jwt from "jsonwebtoken"
app.use(express.json())

const CONNECTED_APP_SECRET = process.env.CONNECTED_APP_SECRET_VALUE

async function startApp() {
  try {
    const generateRefreshToken = (userId) => {
      return jwt.sign({ id: userId }, "myRefreshSecretKey")
    }

    app.post("/api/signup", async (req, res) => {
      try {
        // Return the newly created userId
        const userId = await registerUser(req.body.email, req.body.password)
        // Log the new user in
        const { accessToken } = await logUserIn(userId, req, res)
        const refreshToken = generateRefreshToken(userId)
        res.json({
          userId,
          accessToken,
          refreshToken,
        })
      } catch (e) {
        console.error(e)
      }
    })

    app.post("/api/login", async (req, res) => {
      try {
        const { isAuthorized, userId } = await authorizeUser(
          req.body.email,
          req.body.password
        )
        if (isAuthorized) {
          const { accessToken } = await logUserIn(userId, req, res)
          const refreshToken = generateRefreshToken(userId)
          res.json({
            userId,
            accessToken,
            refreshToken,
          })
        }
      } catch (e) {
        console.error(e)
        res.status(400).json("Username or password incorrect!")
      }
    })

    app.post("/api/refresh", (req, res) => {
      //take the refresh token from the user
      const refreshToken = req.body.token

      //send error if there is no token or it's invalid
      if (!refreshToken)
        return res.status(401).json("You are not authenticated!")
      if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh token is not valid!")
      }
      jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
        err && console.log(err)
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken)

        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)

        refreshTokens.push(newRefreshToken)

        res.status(200).json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        })
      })

      //if everything is ok, create new access token, refresh token and send to user
    })

    const verify = (req, res, next) => {
      const authHeader = req.headers.authorization
      if (authHeader) {
        const token = authHeader.split(" ")[1]

        jwt.verify(token, CONNECTED_APP_SECRET, (err, user) => {
          if (err) {
            return res.status(403).json("Token is not valid!")
          }

          req.user = user
          next()
        })
      } else {
        res.status(401).json("You are not authenticated!")
      }
    }

    app.post("/api/logout", verify, (req, res) => {
      res.clearCookie("accessToken")
      res.status(200).json("You logged out successfully.")
    })

    await app.listen(5000)
    console.log("🚀 Server Listening at port: 5000")
  } catch (e) {
    console.error(e)
  }
}

connectDb().then(() => {
  startApp()
})
