const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
let port = 3000;

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false
}));

const users = [];

// routes
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('dashboard', { username: req.session.user.username });
});
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});



app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.redirect('/login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.render('login', { error: 'Invalid username or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.render('login', { error: 'Invalid username or password' });
    }
    req.session.user = user;
    res.redirect('/dashboard');
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});