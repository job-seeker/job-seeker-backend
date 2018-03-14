# Job Seeker

## Status
[![Build Status](https://travis-ci.org/job-seeker/job-seeker-backend.svg?branch=staging)](https://travis-ci.org/job-seeker/job-seeker-backend)
[![Coverage Status](https://coveralls.io/repos/github/job-seeker/job-seeker-backend/badge.svg)](https://coveralls.io/github/job-seeker/job-seeker-backend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Technology Used
* **[Node.js](https://nodejs.org)**
  * Application dependencies:
    * [bcrypt](https://www.npmjs.com/package/bcrypt)
    * [body-parser](https://www.npmjs.com/package/body-parser)
    * [cors](https://www.npmjs.com/package/cors)
    * [coveralls](https://www.npmjs.com/package/coveralls)
    * [debug](https://www.npmjs.com/package/debug)
    * [del](https://www.npmjs.com/package/del)
    * [dotenv](https://www.npmjs.com/package/dotenv)
    * [eslint](https://www.npmjs.com/package/eslint)
    * [express](https://www.npmjs.com/package/express)
    * [http-errors](https://www.npmjs.com/package/http-errors)
    * [istanbul](https://www.npmjs.com/package/istanbul)
    * [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
    * [mongoose](https://www.npmjs.com/package/mongoose)
    * [morgan](https://www.npmjs.com/package/morgan)
  * Developer dependencies:
    * [faker](https://www.npmjs.com/package/faker)
    * [jest](https://www.npmjs.com/package/jest)
    * [superagent](https://www.npmjs.com/package/superagent)
* **[Heroku](https://www.heroku.com/)**
* **[MongoDB](https://www.mongodb.com)** & **[Mongoose](http://mongoosejs.com/)**
* **[TravisCI](https://travis-ci.org/)**
* **[Coveralls](https://coveralls.io)**

## Schema
<h4 align="center"><img src="./images/job-seeker-ERD.png" target="_blank" height="500px"></h4>

## Routes
### _User_
**POST**  
Create new user with a `username`, `email`, and `password`.
```
POST /api/signup
```

**GET**  
Log in as an existing user with a `username` and `password`.
```
GET /api/signin
```

### Profile
**POST**  
```
POST /api/profile
```

**GET**  
```
GET /api/profile/:profileId
```

**PUT**  
```
PUT /api/profile/:profileId
```

**DELETE**  
```
DELETE /api/profile/:profileId
```

### Company
**POST**  
```
POST /api/profile/:profileId/company
```

**GET**  
```
GET /api/profile/:profileId/company/:companyId
```

**PUT**  
```
PUT /api/profile/:profileId/company/:companyId
```

**DELETE**  
```
DELETE /api/profile/:profileId/company/:companyId
```

### Job
**POST**  
```
POST /api/profile/:profileId/company/:companyId/job
```

**GET**  
```
GET /api/profile/:profileId/company/:companyId/job/:jobId
```

**PUT**  
```
PUT /api/profile/:profileId/company/:companyId/job/:jobId
```

**DELETE**  
```
DELETE /api/profile/:profileId/company/:companyId/job/:jobId
```

### Event
**POST**  
```
POST /api/profile/:profileId/company/:companyId/event
```

**GET**  
```
GET /api/profile/:profileId/company/:companyId/event/:eventId
```

**PUT**  
```
PUT /api/profile/:profileId/company/:companyId/event/:eventId
```

**DELETE**  
```
DELETE /api/profile/:profileId/company/:companyId/event/:eventId
```

### Contact
**POST**  
```
POST /api/profile/:profileId/company/:companyId/contact
```

**GET**  
```
GET /api/profile/:profileId/company/:companyId/contact/:contactId
```

**PUT**  
```
PUT /api/profile/:profileId/company/:companyId/contact/:contactId
```

**DELETE**  
```
DELETE /api/profile/:profileId/company/:companyId/contact/:contactId
```

## Wireframes
<kbd><img src="./images/wireframes/Home%20Page%20-%20Sign%20Up.png" target="_blank" height="300px"></kbd>
<kbd><img src="./images/wireframes/Home%20Page%20-%20Log%20In.png" target="_blank" height="300px"></kbd>
<kbd><img src="./images/wireframes/Companies.png" target="_blank" height="300px"></kbd>
<kbd><img src="./images/wireframes/Company%20Page.png" target="_blank" height="300px"></kbd>

<kbd><img src="./images/wireframes/Event%20Page.png" target="_blank" height="300px"></kbd>
<kbd><img src="./images/wireframes/Contact%20Page.png" target="_blank" height="300px"></kbd>
<kbd><img src="./images/wireframes/Job%20Posting%20Page.png" target="_blank" height="300px"></kbd> 

## Contributors
[Ahmed Ali](https://github.com/AhmedAli93)  

[Alex Bowers](https://github.com/warlordlizard)  

[Melanie Cohen](https://github.com/melaniebcohen)  

[Christian Miller](https://github.com/ruskeezy)
