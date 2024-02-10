import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('The blog component shows the title and author of the blog, but does not show its URL or number of likes', () => {
  const blog = {
    title: 'Real Madrid Campeon',
    author: 'Florentino',
    url: 'www.realmadrid.com',
    likes: 98765431,
  }

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.visibleContent')

  expect(div).toHaveTextContent('Real Madrid Campeon Florentino')
  expect(div).not.toHaveTextContent('www.realmadrid.com')
  expect(div).not.toHaveTextContent('98765431')
  expect(div).not.toHaveStyle('display: none')
})

test('Blog URL and number of likes are displayed when the View button is clicked', async () => {
  const blog = {
    title: 'River Campeon',
    author: 'River',
    url: 'www.river.com',
    likes: 32165498,
  }

  const { container } = render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const divVisible = container.querySelector('.visibleContent')
  const viewButton = container.querySelector('.viewButton')
  await user.click(viewButton)

  const divHidden = container.querySelector('.blog')

  expect(divHidden).not.toHaveStyle('display: none')
  expect(divVisible).toHaveStyle('display: none')
  expect(divHidden).toHaveTextContent('www.river.com')
  expect(divHidden).toHaveTextContent('32165498')
})

test('The like button is clicked twice', async () => {
  const blog = {
    title: 'Chelsea Campeon',
    author: 'Chelsea',
    url: 'www.chelsea.com',
    likes: 0,
  }

  const addLike = jest.fn()
  const { container } = render(<Blog blog={blog} addLike={addLike} />)
  const user = userEvent.setup()

  const likeButton = container.querySelector('.likeButton')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(addLike.mock.calls).toHaveLength(2)
})
