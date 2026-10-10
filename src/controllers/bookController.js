import { BookModel } from "../models/bookModel.js";

export const BookController = {
  async create(req, res) {
    try {
      const { title, author, isbn, stock } = req.body;
      const book = await BookModel.create(title, author, isbn, stock);
      res.status(201).json(book);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const books = await BookModel.getAll();
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const book = await BookModel.getById(id);
      res.json(book);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, author, isbn, stock } = req.body;
      const book = await BookModel.update(id, title, author, isbn, stock);
      res.json(book);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const result = await BookModel.remove(id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
