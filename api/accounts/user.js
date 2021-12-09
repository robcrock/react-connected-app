import { createTokens } from "./tokens.js"

export async function refreshTokens(userId, reply) {
  try {
    // Create JWT
    const { accessToken } = await createTokens(userId)
    // Set Cookie
    // reply.cookie("accessToken", accessToken, {
    //   path: "/",
    //   domain: "localhost",
    //   httpOnly: true,
    //   secure: true,
    // })

    reply.cookie("accessToken", accessToken, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      secure: true,
    })

    return { accessToken }
  } catch (e) {
    console.error(e)
  }
}
