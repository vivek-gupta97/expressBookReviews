const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	//returns boolean
	//write code to check is the username is valid
	for (const user of users) {
		if (user.username === username) {
			return false;
		}
	}
	return true;
};

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	for (const user of users) {
		if (user.username === username && user.password === password) {
			return true;
		}
	}
	return false;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
	//Write your code here
	const { username, password } = req.body;
	if (!username || !password) {
		return res
			.status(404)
			.json({ message: 'Username &/ password are not provided' });
	}
	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign(
			{
				data: password,
			},
			'access',
			{ expiresIn: 60 * 60 }
		);
		req.session.authorization = {
			accessToken,
			username,
		};
		return res.status(200).send('Customer successfully logged in');
	} else {
		return res
			.status(208)
			.json({ message: 'Invalid username or password' });
	}
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
	const isbn = req.params.isbn;
	const review = req.query.review;
	const user = req.session.authorization['username'];
	if (!review) {
		return res.status(404).json({ message: 'Provide review query param' });
	}
	const book = books[isbn];
	if (!book) {
		return res
			.status(404)
			.json({ message: 'No book found for the given ISBN' });
	}
	book.reviews[user] = review;
	return res.status(404).json({ message: 'Review added successfully' });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
	const isbn = req.params.isbn;
	const user = req.session.authorization['username'];
	const book = books[isbn];
	if (!book) {
		return res
			.status(404)
			.json({ message: 'No book found for the given ISBN' });
	}
	book.reviews[user] = undefined;
	return res.status(404).json({ message: 'Review deleted successfully' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;