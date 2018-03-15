<h3 align="center"><img src="./images/logo.png" target="_blank"></h3>

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
    * [dotenv](https://www.npmjs.com/package/dotenv)
    * [express](https://www.npmjs.com/package/express)
    * [http-errors](https://www.npmjs.com/package/http-errors)
    * [istanbul](https://www.npmjs.com/package/istanbul)
    * [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
    * [mongoose](https://www.npmjs.com/package/mongoose)
    * [morgan](https://www.npmjs.com/package/morgan)
  * Developer dependencies:
    * [eslint](https://www.npmjs.com/package/eslint)
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
### **_User_**
#### POST
Create new user with a `username`, `email`, and `password`.
```
POST /api/signup
```
From this POST request, user will receive the following:
```javascript
{
  res.text: < token >
}
```
- With no request body, the server will return a 400 error  

#### GET
Log in as an existing user with a `username` and `password`.
```
GET /api/signin
```
From this GET request, user will receive the following:
```javascript
{
  res.text: < token >
}
```
- With an invalid request body, the server will return a 401 error
- With an invalid username and/or password, the server will return a 500 error

### **_Profile_**
**POST**  
Create a new profile with a valid token, existing `username` and `password`, as well as the new user's `name` and `email`.
```
POST /api/profile
```
From this POST request, user will receive the following:
```javascript
{
  name: 'Peter Parker',
  email: 'peter.parker@definitelynotspiderman.com',
  companies: [],
  userId: ' < userId >',
  _id: < new profileId >,
}
```
- With no request body, the server will return a 400 error
- With an invalid username and/or password, the server will return a 404 error
- Without a valid token provided, the server will return a 401 error

#### GET
Fetch an existing user's profile with a valid token and the user's `profileId`.
```
GET /api/profile/:profileId
```
From this GET request, user will receive the following:
```javascript
{
  name: 'Wanda Maximoff',
  email: 'wanda@avengers.com',
  companies: [],
  userId: < userId >,
  _id: < queried profileId >,
}
```
- With an invalid profile ID, the server will return a 404 error
- Without a valid token provided, the server will return a 401 error

#### PUT
Update an existing user's profile with a valid token and the user's `profileId`, as well as the user's new `name` and `email`.
```
PUT /api/profile/:profileId
```
From this PUT request, user will receive the following:
```javascript
{ 
  name: 'Peter Parker',
  email: 'peter.parker@avengers.com',
  companies: [],
  userId: < userId >,
  _id: < queried profileId >,
}
```
- With an invalid profile ID, the server will return a 404 error
- Without a valid token provided, the server will return a 401 error
- Without a request body, the server will return a 400 error
  
### **_Company_**
#### POST
Create a new company with a valid token, `profileId`, `companyName`, and `website`. `streetAddress`, `city`, `state`, `zip`, `phone`, and `companyNotes` are optional.
```
POST /api/profile/:profileId/company
```
From this POST request, user will receive the following:
```javascript
{
  companyName: 'Stark Industries',
  website: 'http://www.starkindustries.com',
  profileId: < profileId > ,
  userId: < userId >,
  contacts: [],
  jobPosting: [],
  events: [],
  created: '2018-03-15T17:11:41.552Z',
  _id: < companyId >,
}
```
- With no request body, the server will return a 400 error
- With an invalid request, the server will return a 404 error
- Without a valid token provided, the server will return a 401 error

#### GET (single company)
Fetch an existing company with a valid token, the user's `profileId`, and a specific `companyId`.
```
GET /api/profile/:profileId/company/:companyId
```
From this GET request, user will receive the following:
```javascript
{ 
  companyName: 'Stark Industries',
  website: 'http://www.starkindustries.com',
  profileId: < profileId > ,
  userId: < userId >,
  contacts: [],
  jobPosting: [],
  events: [],
  created: '2018-03-15T17:11:41.552Z',
  _id: < companyId >,
}
```
- With an invalid company ID, the server will return a 404 error
- Without a valid token provided, the server will return a 401 error

#### GET (all companies)
Fetch _all_ companies associated with a specific profile using a valid token and the user's `profileId`.
```
GET /api/profile/:profileId/company
```
From this GET request, user will receive the following:
```javascript
{ 
  name: 'Scott Lang',
  email: 'scottlang@hotmail.com',
  companies: 
    [{ 
      companyName: 'Alias Investigations',
      website: 'http://www.aliasinvestigations.net',
      profileId: < profileId > ,
      userId: < userId >,
      contacts: [],
      jobPosting: [],
      events: [],
      created: '2018-03-15T17:34:57.866Z',
      _id: < companyId >,
    },
    {
      companyName: 'Hogarth, Chao, and Benowitz',
      website: 'https://www.hcb.com',
      profileId: < profileId > ,
      userId: < userId >,
      contacts: [],
      jobPosting: [],
      events: [],
      created: '2018-03-15T17:34:57.872Z',
      _id: < companyId >,
    }],
  userId: < userId>,
  _id: < profileId >,
}
```
- With an invalid profile ID, the server will return a 404 error
- Without a valid token provided, the server will return a 401 error

#### PUT
Update an existing company's information with a valid token and the user's `profileId`, as well as the `companyId` and relevant company information.
```
PUT /api/profile/:profileId/company/:companyId
```
From this PUT request, user will receive the following:
```javascript
{ 
  companyName: 'Stark Industries',
  website: 'https://www.starkindustries.com/careers/',
  profileId: < profileId > ,
  userId: < userId >,
  contacts: [],
  jobPosting: [],
  events: [],
  created: '2018-03-15T17:11:41.552Z',
  _id: < companyId >,
}
```
- With an invalid profile ID, the server will return a 404 error
- Without a valid token provided, the server will return a 401 error
- Without a valid request body provided, the server will return a 400 error

#### DELETE
Remove an existing company from the database with a valid token, the user's `profileId`, and the `companyId`.

```
DELETE /api/profile/:profileId/company/:companyId
```
User will not receive any data, but should expect a 204 status.

### Job
#### POST
Create a new job with a valid token, `profileId`, `companyId`, `title`, `link`, `status`, and `type`. `notes` and `tags` are optional.
```
POST /api/profile/:profileId/company/:companyId/job
```
From this POST request, user will receive the following:
```javascript
{ 
  title: 'Web Developer',
  link: 'http://www.nelsonandmurdoch.org',
  status: 'Submitted Application',
  type: 'Front-End',
  tags: [],
  userId: < userId >,
  profileId: < profileId >,
  companyId: < companyId >,
  created: '2018-03-15T17:59:17.369Z',
  _id: < jobId >,
}
```
- With no request body, the server will return a 400 error
- Without a valid token provided, the server will return a 401 error

#### GET (single job)
Fetch an existing job with a valid token, the user's `profileId`, a specific `companyId`, and a specific `jobId`.

```
GET /api/profile/:profileId/company/:companyId/job/:jobId
```
From this GET request, user will receive the following:
```javascript
{ 
  title: 'Web Developer',
  link: 'http://www.nelsonandmurdoch.org',
  status: 'Submitted Application',
  type: 'Front-End',
  tags: [],
  userId: < userId >,
  profileId: < profileId >,
  companyId: < companyId >,
  created: '2018-03-15T17:59:17.369Z',
  _id: < jobId >,
}
```
- With an invalid company ID, the server will return a 404 error
- Without a valid token provided, the server will return a 401 error

#### GET (all jobs from profile)
Fetch _all_ jobs associated with a specific profile using a valid token and the user's `profileId`.
```
GET /api/profile/:profileId/allProfileJobs
```
From this GET request, user will receive the following:
```javascript
[{ 
    title: 'Web Developer',
    link: 'http://www.nelsonandmurdoch.org',
    status: 'Submitted Application',
    type: 'Front-End',
    tags: [],
    userId: < userId >,
    profileId: < profileId >,
    companyId: < companyId >,
    created: '2018-03-15T17:59:17.369Z',
    _id: < jobId >,
  },
  { 
    title: 'Back-End Developer',
    link: 'http://www.nelsonandmurdoch.org/careers/job1',
    status: 'Submitted Application',
    type: 'Back-End',
    tags: [],
    userId: < userId >,
    profileId: < profileId >,
    companyId: < companyId >,
    created: '2018-03-15T17:59:17.369Z',
    _id: < jobId >,
  },
  { 
    title: 'Software Engineer - React',
    link: 'http://www.nelsonandmurdoch.org/careers/job2',
    status: 'Submitted Application',
    type: 'Front-End',
    tags: [],
    userId: < userId >,
    profileId: < profileId >,
    companyId: < companyId >,
    created: '2018-03-15T17:59:17.369Z',
    _id: < jobId >,
  }]
```
- With an invalid company ID, the server will return a 404 error
- Without a valid token provided, the server will return a 401 error

#### GET (all jobs from single company)
Fetch _all_ jobs associated with a specific profile _and company_ using a valid token, the user's `profileId`, and the `companyId`.
```
GET: /api/profile/:profileId/company/:companyId/allCompanyJobs
```
From this GET request, user will receive the following:
```javascript
[{ 
    title: 'Back-End Developer',
    link: 'http://www.nelsonandmurdoch.org/careers/job1',
    status: 'Submitted Application',
    type: 'Back-End',
    tags: [],
    userId: < userId >,
    profileId: < profileId >,
    companyId: < companyId >,
    created: '2018-03-15T17:59:17.369Z',
    _id: < jobId >,
  },
  { 
    title: 'Software Engineer - React',
    link: 'http://www.nelsonandmurdoch.org/careers/job2',
    status: 'Submitted Application',
    type: 'Front-End',
    tags: [],
    userId: < userId >,
    profileId: < profileId >,
    companyId: < companyId >,
    created: '2018-03-15T17:59:17.369Z',
    _id: < jobId >,
  }]
```
- With an invalid company ID, the server will return a 404 error
- Without a valid token provided, the server will return a 401 error

#### PUT
Update an existing job's information with a valid token,the user's `profileId`, the `companyId`, the `jobId`, and relevant company information.
```
PUT /api/profile/:profileId/company/:companyId/job/:jobId
```
From this PUT request, user will receive the following:
```javascript
{ 
  title: 'Web Developer - React',
  link: 'http://www.nelsonandmurdoch.org',
  status: 'Evaluating Offer',
  type: 'Front-End',
  tags: [],
  userId: < userId >,
  profileId: < profileId >,
  companyId: < companyId >,
  created: '2018-03-15T17:59:17.369Z',
  _id: < jobId >,
}
```
- With an invalid company ID, the server will return a 404 error
- Without a valid token provided, the server will return a 401 error
- With no request body, the server will return a 400 error

#### DELETE
Remove an existing company from the database with a valid token, the user's `profileId`, the `companyId`, and the `jobId`.
```
DELETE /api/profile/:profileId/company/:companyId/job/:jobId
```
User will not receive any data, but should expect a 204 status.


### **_Event_**
#### POST
```
POST /api/profile/:profileId/company/:companyId/event
```

#### GET
```
GET /api/profile/:profileId/company/:companyId/event/:eventId
```

Fetch _all_ events associated with a specific profile using a valid token and the user's `profileId`.
```
GET /api/profile/:profileId/allProfileEvents
```

Fetch _all_ events associated with a specific profile _and company_ using a valid token, the user's `profileId`, and the `companyId`.
```
GET: /api/profile/:profileId/company/:companyId/allCompanyEvents
```

#### PUT
```
PUT /api/profile/:profileId/company/:companyId/event/:eventId
```

#### DELETE
```
DELETE /api/profile/:profileId/company/:companyId/event/:eventId
```

### **_Contact_**
#### POST
```
POST /api/profile/:profileId/company/:companyId/contact
```

#### GET
```
GET /api/profile/:profileId/company/:companyId/contact/:contactId
```

#### PUT
```
PUT /api/profile/:profileId/company/:companyId/contact/:contactId
```

#### DELETE
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
