const app = require('./src/app');
const express = require('./src/app');
const PORT = 3000;


const books = [
  {
    id: 1,
    title: "the little prince",
    author: "Antoine de Saint-Exupéry",
    year: "1943"
  },
  {
    id: 2,
    title: "100 años de soledad",
    author: "Gabriel García Márquez",
    year: "1967"
  },
  {
    id: 3,
    title: "Terapia para el alma",
    author: "Miguel Ruiz",
    year: "2001"
  },
];

app.get('/books', (req, res) => {
  res.json(books);
});

app.get('/books/:id', (req, res) => {
  const book= books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(book);
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
