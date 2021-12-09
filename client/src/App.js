import "./App.css"
import axios from "axios"
import { useState } from "react"
import Login from "./components/Login"
import SignUp from "./components/SignUp"
// import jwt_decode from "jwt-decode"

function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [accessToken, setAccessToken] = useState("")
  // const [error, setError] = useState(false)
  // const [success, setSuccess] = useState(false)

  // const refreshToken = async () => {
  //   try {
  //     const res = await axios.post("/refresh", { token: user.refreshToken })
  //     setUser({
  //       ...user,
  //       accessToken: res.data.accessToken,
  //       refreshToken: res.data.refreshToken,
  //     })
  //     return res.data
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  // const axiosJWT = axios.create()

  // axiosJWT.interceptors.request.use(
  //   async (config) => {
  //     let currentDate = new Date()
  //     const decodedToken = jwt_decode(user.accessToken)
  //     if (decodedToken.exp * 1000 < currentDate.getTime()) {
  //       const data = await refreshToken()
  //       config.headers["authorization"] = "Bearer " + data.accessToken
  //     }
  //     return config
  //   },
  //   (error) => {
  //     return Promise.reject(error)
  //   }
  // )

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        "/logout",
        {},
        { headers: { authorization: `Bearer ${accessToken}` } }
      )
      setUser("")
      console.log(res.data)
    } catch (err) {
      console.log(err)
    }
  }

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
          <button className="logoutButton" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="form-wrapper">
          <SignUp
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            setUser={setUser}
            setAccessToken={setAccessToken}
          />
          <Login
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            setUser={setUser}
            setAccessToken={setAccessToken}
          />
        </div>
      )}
    </div>
  )
}

export default App
