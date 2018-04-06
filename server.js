'use strict';

// REVIEW: required module organization looks good - nice job keeping the file clean and segmenting 3rd party/internal modules
const express = require('express');
const debug = require('debug')('job-seeker:server');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const userRouter = require('./route/user-router.js');
const profileRouter = require('./route/profile-router.js');
const companyRouter = require('./route/company-router.js');
const contactRouter = require('./route/contact-router.js');
const jobRouter = require('./route/job-router.js');
const eventRouter = require('./route/event-router.js');
const errors = require('./lib/error-middleware.js');

dotenv.load();

// REVIEW: module constants look good
const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI);

// REVIEW: application level middleware usage looks good
app.use(cors());
app.use(morgan('dev'));
app.use(userRouter);
app.use(profileRouter);
app.use(companyRouter);
app.use(contactRouter);
app.use(eventRouter);
app.use(jobRouter);
app.use(errors);

// REVIEW: server definition and toggle on/off flag look good
const server = module.exports = app.listen(PORT, () => {
  debug(`server up: ${PORT}`);
});

server.isRunning = true;