import Notification from './Notification'
import PropTypes from 'prop-types'

const LoginForm = ({
  handleLogin,
  username,
  password,
  message,
  handleUsernameChange,
  handlePasswordChange,
}) => {
  return (
    <div>
      <h2>Log in to Application</h2>
      <Notification message={message} />
      <form onSubmit={handleLogin}>
        <div>
          Username:
          <input
            type="text"
            value={username}
            name="username"
            onChange={handleUsernameChange}
            id='username'
          />
        </div>
        <div>
          Password:
          <input
            type="password"
            value={password}
            name="password"
            onChange={handlePasswordChange}
            id='password'
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired
}

export default LoginForm
