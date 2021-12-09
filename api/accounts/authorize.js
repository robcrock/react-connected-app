import bcrypt from "bcryptjs"
const { compare } = bcrypt

export async function authorizeUser(email, password) {
  try {
    // Import user collection
    const { user } = await import("../user/user.js")
    // Look up user
    const userData = await user.findOne({
      email: email,
    })
    if (userData) {
      // Get user Password
      const savedPassword = userData.password
      // Compare password with one in database
      const isAuthorized = await compare(password, savedPassword)
      // Return boolean of if password is correct
      return { isAuthorized, userId: userData._id }
    }
    throw new Error(`Could not find the email in the User Collection: ${email}`)
  } catch (e) {
    console.error(e)
  }
}
