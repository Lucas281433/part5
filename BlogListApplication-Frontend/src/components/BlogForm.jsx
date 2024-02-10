import { useState } from 'react'

const BlogForm = ({ newBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    newBlog({
      title,
      author,
      url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <h2>Create a new Blog </h2>
      <div>
        Title:{' '}
        <input
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
          id='title'
        />
      </div>
      <div>
        Author:{' '}
        <input
          type="text"
          value={author}
          name="author"
          onChange={({ target }) => setAuthor(target.value)}
          id='author'
        />
      </div>
      <div>
        Url:{' '}
        <input
          type="text"
          value={url}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
          id='url'
        />
      </div>
      <button type="submit" className='createButton'>Create</button>
    </form>
  )
}

export default BlogForm
