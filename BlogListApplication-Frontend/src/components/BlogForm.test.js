import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('The form calls the event handler you received as props with the correct details', async () => {
  const newBlog = jest.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm newBlog={newBlog} />)

  const inputTitle = container.querySelector('#title')
  const inputAuthor = container.querySelector('#author')
  const inputUrl = container.querySelector('#url')
  const createButton = container.querySelector('.createButton')

  await user.type(inputTitle, 'Roma Campeon')
  await user.type(inputAuthor, 'Roma')
  await user.type(inputUrl, 'www.roma.com')
  await user.click(createButton)

  expect(newBlog.mock.calls).toHaveLength(1)
  expect(newBlog.mock.calls[0][0].title).toBe('Roma Campeon')
  expect(newBlog.mock.calls[0][0].author).toBe('Roma')
  expect(newBlog.mock.calls[0][0].url).toBe('www.roma.com')
})