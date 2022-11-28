import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLine,
  faFacebook,
  faGoogle,
} from '@fortawesome/free-brands-svg-icons'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLineLogin = () => {}

  const handleFacebookLogin = () => {}

  const handleGoogleLogin = () => {}

  return (
    <div className="login-page">
      <main class="form-signin w-100 m-auto">
        <form>
          <h1 class="h3 mb-3 fw-normal">Please Login</h1>

          <div class="form-floating">
            <input
              type="email"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
            <label for="floatingInput">Email address</label>
          </div>
          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            <label for="floatingPassword">Password</label>
          </div>
          <button class="w-100 btn btn-lg btn-secondary" type="button">
            Login
          </button>
        </form>

        <hr />

        <div>
          <button
            class="w-100 btn btn-lg btn-success mb-2"
            type="button"
            onClick={handleLineLogin}
          >
            <FontAwesomeIcon icon={faLine} /> LINE Login
          </button>

          <button
            class="w-100 btn btn-lg btn-primary mb-2"
            type="button"
            onClick={handleFacebookLogin}
          >
            <FontAwesomeIcon icon={faFacebook} /> Facebook Login
          </button>

          <button
            class="w-100 btn btn-lg btn-danger mb-2"
            type="button"
            onClick={handleGoogleLogin}
          >
            <FontAwesomeIcon icon={faGoogle} /> Google Login
          </button>
        </div>
      </main>
    </div>
  )
}
