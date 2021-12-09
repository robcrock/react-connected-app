import React from "react"
import axios from "axios"

export default function Login({
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
      const res = await axios.post("/login", { email, password })
      console.log(res.data)
      setUser(res.data.userId)
      setAccessToken(res.data.accessToken)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <span className="formTitle">Lama Login</span>
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
          Login
        </button>
      </form>
    </div>
  )
}
