import "./App.css"
import axios from "axios"
import { useState } from "react"
import jwt_decode from "jwt-decode"

function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [accessToken, setAccessToken] = useState("")
  // const [error, setError] = useState(false)
  // const [success, setSuccess] = useState(false)

  const refreshToken = async () => {
    try {
      const res = await axios.post("/refresh", { token: user.refreshToken })
      setUser({
        ...user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      })
      return res.data
    } catch (err) {
      console.log(err)
    }
  }

  const axiosJWT = axios.create()

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date()
      const decodedToken = jwt_decode(user.accessToken)
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken()
        config.headers["authorization"] = "Bearer " + data.accessToken
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("/login", { email, password })
      console.log(res.data)
      setUser(res.data)
      setAccessToken(res.data.accessToken)
    } catch (err) {
      console.log(err)
    }
  }

  // const handleDelete = async (id) => {
  //   setSuccess(false)
  //   setError(false)
  //   try {
  //     await axiosJWT.delete("/users/" + id, {
  //       headers: { authorization: "Bearer " + user.accessToken },
  //     })
  //     setSuccess(true)
  //   } catch (err) {
  //     setError(true)
  //   }
  // }

  return (
    <div className="container">
      {user ? (
        <div className="home">
          <tableau-viz
            id="tableauViz"
            src="https://10ax.online.tableau.com/t/developmentonlydev595736/views/EnergyMap/energymap"
            toolbar="Bottom"
            hide-tabs
            width="800px"
            height="600px"
            token={accessToken}
          ></tableau-viz>
          {/* {error && (
            <span className="error">
              You are not allowed to delete this user!
            </span>
          )}
          {success && (
            <span className="success">
              User has been deleted successfully...
            </span>
          )} */}
        </div>
      ) : (
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
      )}
    </div>
  )
}

export default App
