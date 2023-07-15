const express = require('express');
let books = require('./booksdb.js');
const { setTimeout } = require('timers/promises');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

const getBooks = async () => {
	await setTimeout(500); //simulating async request
	return books;
};
const getBookByISBN = async (isbn) => {
	await setTimeout(500); //simulating async request
	return books[isbn];
};
const getBooksByAuthor = async (author) => {
	await setTimeout(500); //simulating async request
	const authorBooks = [];
	for (const key in books) {
		if (books[key]['author'] === author) {
			authorBooks.push({
				isbn: key,
				title: books[key].title,
				reviews: books[key].reviews,
			});
		}
	}
	return authorBooks;
};

const getBooksByTitle = async (isbn) => {
	await setTimeout(500); //simulating async request
	const titleBooks = [];
	for (const key in books) {
		if (books[key]['title'] === title) {
			titleBooks.push({
				isbn: key,
				author: books[key].author,
				reviews: books[key].reviews,
			});
		}
	}
	return titleBooks;
};

public_users.post('/register', (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res
			.status(422)
			.json({ message: 'Username &/ password are not provided' });
	}
	if (!isValid()) {
		return res.status(422).json({ message: 'Username already exists' });
	}
	users.push({ username: username, password: password });
	return res.status(300).json({
		message: 'Customer successfully registered. Login to continue',
	});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
	//Write your code here
	const allBooks = await getBooks();
	return res.status(200).json({ books: allBooks });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
	const isbn = req.params.isbn;
	const book = await getBookByISBN(isbn);
	return res.status(200).json(book);
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
	const author = req.params.author;
	const authorBooks = await getBooksByAuthor(author);
	return res.status(200).json({ booksByAuthor: authorBooks });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
	//Write your code here
	const title = req.params.title;
	const titleBooks = await getBooksByTitle(title);
	return res.status(200).json({ booksByTitle: titleBooks });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
	const isbn = req.params.isbn;
	return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;