const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Real Madrid Campeon",
    author: "Florentino Perez",
    url: "www.realmadrid.com",
    likes: 987654321,
  },
  {
    title: "River Campeon",
    author: "River",
    url: "www.river.com",
    likes: 987654,
  },
];

const nonExistingID = async () => {
  const blog = new Blog({
    title: "Hello",
    author: "Hello",
    url: "www.hellow.com",
    likes: 321654,
  });

  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = { initialBlogs, nonExistingID, blogsInDb, usersInDb };
