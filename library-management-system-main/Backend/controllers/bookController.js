const Book = require("../models/Book");

// 1. GET all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
};

// 2. POST add book
exports.addBook = async (req, res) => {
  try {
    const { title, author, publishedYear, price } = req.body;
    const newBook = new Book({ title, author, publishedYear, price });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding book", error: error.message });
  }
};

// 3. PUT update book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, publishedYear, price } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, publishedYear, price },
      { new: true }
    );

    if (!updatedBook)
      return res.status(404).json({ message: "Book not found" });

    res.json(updatedBook);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating book", error: error.message });
  }
};

// 4. DELETE book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook)
      return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
};
