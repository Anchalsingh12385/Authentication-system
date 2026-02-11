const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
app.set('view engine', 'ejs');