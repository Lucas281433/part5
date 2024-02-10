import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogListAppUser',
        JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setMessage('Wrong Username or Password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogListAppUser')
    setUser(null)
  }

  const addBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      const blogWithUser = {
        ...createdBlog,
        user: {
          username: user.username,
          name: user.name,
          id: user.id,
        },
      }
      setBlogs(blogs.concat(blogWithUser))
      blogFormRef.current.toggleVisibility()

      setMessage(`A new blog ${blogWithUser.title} By ${blogWithUser.author}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setMessage('Error could not create blog')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const addLike = async (id) => {
    const blogToUpdate = blogs.find((b) => b.id === id)

    const updatedBlog = {
      ...blogToUpdate,
      likes: (blogToUpdate.likes += 1),
    }
    await blogService.update(id, updatedBlog)
    setBlogs(blogs.map((blog) => (blog.id !== id ? blog : updatedBlog)))
  }

  const removeBlog = async (id) => {
    const blogToDelete = blogs.find((blog) => blog.id === id)
    if (
      window.confirm(
        `Remove Blog ${blogToDelete.title} By ${blogToDelete.author}`
      )
    ) {
      await blogService.remove(id)
      setBlogs(blogs.filter((b) => b.id !== id))
    }
  }

  const blogsSorted = [...blogs].sort((a, b) => b.likes - a.likes)

  if (user === null) {
    return (
      <LoginForm
        handleLogin={handleLogin}
        message={message}
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
      />
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} />
      <p>
        {user.name} Logged In <button onClick={handleLogout}>Logout</button>
      </p>
      <Togglable buttonLabel="New Blog" ref={blogFormRef}>
        <BlogForm newBlog={addBlog} />
      </Togglable>
      {blogsSorted.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          addLike={addLike}
          removeBlog={removeBlog}
          user={user}
        />
      ))}
    </div>
  )
}

export default App
