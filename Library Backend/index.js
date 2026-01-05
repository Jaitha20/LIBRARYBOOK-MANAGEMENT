const express = require("express");
require("./db");
const Book = require("./bookModel");

const app = express();
app.use(express.json());

/* CREATE – Insert book */
app.post("/books", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.send("Book added successfully");
  } catch {
    res.status(400).send("Error adding book");
  }
});

/* READ – All books */
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

/* READ – Books by category */
app.get("/books/category/:cat", async (req, res) => {
  const books = await Book.find({ category: req.params.cat });
  res.json(books);
});

/* READ – Books after 2015 */
app.get("/books/after2015", async (req, res) => {
  const books = await Book.find({ publishedYear: { $gt: 2015 } });
  res.json(books);
});

/* UPDATE – Increase / Decrease copies */
app.put("/books/copies/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send("Book not found");

  book.availableCopies += req.body.change;
  await book.save();
  res.send("Copies updated");
});

/* UPDATE – Change category */
app.put("/books/category/:id", async (req, res) => {
  const book = await Book.findByIdAndUpdate(
    req.params.id,
    { category: req.body.category },
    { new: true }
  );
  if (!book) return res.status(404).send("Book not found");
  res.send("Category updated");
});

/* DELETE – Remove if copies < 0 */
app.delete("/books/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send("Book not found");

  if (book.availableCopies < 0) {
    await Book.findByIdAndDelete(req.params.id);
    res.send("Book deleted");
  } else {
    res.send("Cannot delete, copies available");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});