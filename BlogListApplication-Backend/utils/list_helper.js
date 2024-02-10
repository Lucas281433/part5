const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const likes = blogs.map((blog) => blog.likes);
  const addition = likes.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  return addition;
};

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce(
    (max, blog) => (blog.likes > max.likes ? blog : max),
    blogs[0]
  );
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  const blogsByAuthor = {};

  blogs.forEach((blog) => {
    if (blogsByAuthor[blog.author]) {
      blogsByAuthor[blog.author]++;
    } else {
      blogsByAuthor[blog.author] = 1;
    }
  });

  let maxAuthor = "";
  let maxBlogs = 0;

  for (const author in blogsByAuthor) {
    if (blogsByAuthor[author] > maxBlogs) {
      maxAuthor = author;
      maxBlogs = blogsByAuthor[author];
    }
  }

  return {
    author: maxAuthor,
    blogs: maxBlogs,
  };
};

const mostLikes = (blogs) => {
  const likesByAuthor = {};

  blogs.forEach((blog) => {
    if (likesByAuthor[blog.author]) {
      likesByAuthor[blog.author] += blog.likes;
    } else {
      likesByAuthor[blog.author] = blog.likes;
    }
  });

  let maxAuthor = "";
  let maxLikes = 0;

  for (const aunthor in likesByAuthor) {
    if (likesByAuthor[aunthor] > maxLikes) {
      maxAuthor = aunthor;
      maxLikes = likesByAuthor[aunthor];
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes,
  };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
