import { useState } from 'react'

const Blog = ({ blog, addLike, removeBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const hidenWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  return (
    <div style={blogStyle} className='bloglist'>
      <div style={hidenWhenVisible} className="visibleContent">
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility} className="viewButton">
          View
        </button>
      </div>
      <div style={showWhenVisible} className="blog">
        <ul>
          <li>
            {blog.title} {blog.author}{' '}
            <button onClick={toggleVisibility}>Hide</button>
          </li>
          <li>{blog.url}</li>
          <li>
            {blog.likes}{' '}
            <button onClick={() => addLike(blog.id)} className="likeButton">
              Like
            </button>
          </li>
          <li>{blog.user ? blog.user.name : ''}</li>
          {blog.user && blog.user.name === user.name ? (
            <button
              onClick={() => removeBlog(blog.id)}
              className="removeButton"
            >
              Remove
            </button>
          ) : null}
        </ul>
      </div>
    </div>
  )
}

export default Blog
