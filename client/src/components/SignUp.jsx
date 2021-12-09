import React from "react"
import axios from "axios"

export default function Signup({
  email,
  password,
  setUser,
  setAccessToken,
  setEmail,
  setPassword,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("/signup", { email, password })
      setUser(res.data.userId)
      setAccessToken(res.data.accessToken)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="signup">
      <form onSubmit={handleSubmit}>
        <span className="formTitle">Lama Signup</span>
        <input
          type="text"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="submitButton">
          Signup
        </button>
      </form>
    </div>
  )
}
