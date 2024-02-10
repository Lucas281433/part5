const mongoose = require("mongoose");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);

const getToken = async () => {
  const result = await api
    .post("/api/login")
    .send({ username: "Root", password: "sekret" });
  return result.body.token;
};

let token;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "Root", passwordHash });
  await user.save();
  token = await getToken();

  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

describe("Tests to get the blogs", () => {
  test("The blog list application returns blogs in JSON", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Blog list app return correct number of blog posts", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("The id property of blog posts is called id", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].id).toBeDefined();
  });
});

describe("Tests when creating a new blog", () => {
  test("A new blog post is successfully created", async () => {
    const newBlog = {
      title: "Roma Campeon",
      author: "Mourinho",
      url: "www.roma.com",
      likes: 321654,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain("Roma Campeon");
  });

  test("If the Like property is missing from the request, the default value is 0", async () => {
    const newBlog = {
      title: "Chelsea Campeon",
      author: "Chelsea",
      url: "www.chelsea.com",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const likes = blogsAtEnd.map((blog) => blog.likes);
    expect(likes).toContain(0);
  });

  test("If the title and URL properties are missing from the request data, it responds with the status code 400 Bad Request", async () => {
    const newBlog = {
      author: "Hello",
      likes: 321654,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(400);
  });

  test("If the blog title is missing", async () => {
    const newBlog = {
      author: "Hello",
      url: "www.hello.com",
      likes: 321654,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(400);
  });

  test("If the blog url is missing", async () => {
    const newBlog = {
      title: "Hello",
      author: "Hello",
      likes: 321654,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(400);
  });
  test("Adding a blog fails with the appropriate status code 401 Unauthorized if a token is not provided", async () => {
    const newBlog = {
      title: "Hello",
      author: "Hello",
      likes: 321654,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });
});

test("Only the user who created the blog can delete it", async () => {
  const newBlog = {
    title: "Chelsea Campeon",
    author: "Chelsea",
    url: "www.chelsea.com",
    likes: 321654,
  };

  const result = await api
    .post("/api/blogs")
    .send(newBlog)
    .set({ Authorization: `Bearer ${token}` });

  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = result.body.id;

  await api
    .delete(`/api/blogs/${blogToDelete}`)
    .set({ Authorization: `Bearer ${token}` })
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

  const titles = blogsAtEnd.map((blog) => blog.title);
  expect(titles).not.toContain("Chelsea Campeon");
});

test("The likes information of a blog is updated", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  const updatedBlog = {
    title: "Real Madrid Campeon",
    author: "Florentino Perez",
    url: "www.realmadrid.com",
    likes: 9999999,
  };

  await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog);

  const blogsAtEnd = await helper.blogsInDb();
  const likes = blogsAtEnd.map((blog) => blog.likes);
  expect(likes).toContain(9999999);
});

describe("Operations with users", () => {
  test("Creation of a valid user", async () => {
    usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Lord Bellingham",
      name: "Jud Bellingham",
      password: "best",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const users = usersAtEnd.map((user) => user.username);
    expect(users).toContain("Lord Bellingham");
  });

  test("Creation of an invalid user by short name, status and error message", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Vi",
      name: "Vini",
      password: "jogo",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "Username and password must be at least 3 characters"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("Creation of an invalid user by short password, status and error message", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Vini",
      name: "Vini Jr",
      password: "jo",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "Username and password must be at least 3 characters"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("Creating an invalid user because the username already exists", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Root",
      name: "Superuser",
      password: "hello123",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
