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
From this GET request, user will receive the following:
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
```
POST /api/profile/:profileId/company
```

#### GET
Fetch an existing company with a valid token, the user's `profileId`, and a specific `companyId`.
```
GET /api/profile/:profileId/company/:companyId
```

Fetch _all_ companies associated with a specific profile using a valid token and the user's `profileId`.
```
GET /api/profile/:profileId/company
```


#### PUT
```
PUT /api/profile/:profileId/company/:companyId
```

#### DELETE
```
DELETE /api/profile/:profileId/company/:companyId
```

### Job
#### POST
```
POST /api/profile/:profileId/company/:companyId/job
```

#### GET
```
GET /api/profile/:profileId/company/:companyId/job/:jobId
```

Fetch _all_ jobs associated with a specific profile using a valid token and the user's `profileId`.
```
GET /api/profile/:profileId/allProfileJobs
```

Fetch _all_ jobs associated with a specific profile _and company_ using a valid token, the user's `profileId`, and the `companyId`.
```
GET: /api/profile/:profileId/company/:companyId/allCompanyJobs
```


#### PUT
```
PUT /api/profile/:profileId/company/:companyId/job/:jobId
```

#### DELETE
```
DELETE /api/profile/:profileId/company/:companyId/job/:jobId
```

### **_Event_**
#### POST
```
POST /api/profile/:profileId/company/:companyId/event
```
From this POST request, user will recieve the following response:
```javascript
    { eventType: 'Interview',
      eventTitle: 'Interview with Jewel',
      eventDate: '2018-03-15T01:51:17.262Z',
      userId: '<userId>',
      profileId: '<profileId>',
      companyId: '<companyId>',
      created: '2018-03-15T17:32:26.292Z',
      _id: '<._id>',
      __v: 0 }
```
 - With an invalid token, the server will return a 401 error
 - With an invalid body, the server will return a 400 error
 - With an invalid request, the server will return a 404 error


#### GET
```
GET /api/profile/:profileId/company/:companyId/event/:eventId
```
From this GET request, user will recieve the following response: 
```javascript
    { created: '2018-03-15T17:32:26.502Z',
      _id: '5aaaae2ae7120b5c4fad8f31',
      eventType: 'Interview',
      eventTitle: 'Interview with Jewel',
      eventDate: '2018-03-15T01:51:17.262Z',
      userId: '<userId>',
      profileId: '<profileId>',
      companyId: '<companyId>',
      __v: 0 }
```

 - With an invalid token, the server will return a 401 error
 - With an invalid request, the server will return a 404 error

Fetch _all_ events associated with a specific profile using a valid token and the user's `profileId`.
```
GET /api/profile/:profileId/allProfileEvents
```
From this GET request, user will recieve the following response:
```javascript
    [ { created: '2018-03-15T17:32:26.635Z',
        _id: '<._id>',
        eventType: 'Interview',
        eventTitle: 'Interview with Jewel',
        eventDate: '2018-03-15T01:51:17.262Z',
        userId: '<userId>',
        profileId: '<profileId>',
        companyId: '<companyId>',
        __v: 0 } ]
```

 - With an invalid token, the server will return a 401 error
 - With an invalid request, the server will return a 404 error

Fetch _all_ events associated with a specific profile _and company_ using a valid token, the user's `profileId`, and the `companyId`.
```
GET: /api/profile/:profileId/company/:companyId/allCompanyEvents
```
From this GET request, user will recieve the following response: 
```javascript
    [ { created: '2018-03-15T17:32:26.847Z',
        _id: '<._id>',
        eventType: 'Interview',
        eventTitle: 'Interview with Jewel',
        eventDate: '2018-03-15T01:51:17.262Z',
        userId: '<userId>',
        profileId: '<profileId>',
        companyId: '<companyId>',
        __v: 0 },
      { created: '2018-03-15T17:32:26.849Z',
        _id: '<._id>',
        eventType: 'Interview',
        eventTitle: 'Test event title',
        eventDate: '2018-03-15T01:51:17.262Z',
        userId: '<userId>',
        profileId: '<profileId>',
        companyId: '<companyId>',
        __v: 0 } ]
```

 - With an invalid token, the server will return a 401 error
 - With an invalid request, the server will return a 404 error


#### PUT
```
PUT /api/profile/:profileId/company/:companyId/event/:eventId
```
From this PUT request, user will recieve the following response:
```javascript
    { created: '2018-03-15T17:32:26.954Z',
      _id: '<._id>',
      eventType: 'Interview',
      eventTitle: 'drinks',
      eventDate: '2018-03-15T01:51:17.262Z',
      userId: '<userId>',
      profileId: '<profileId>',
      companyId: '<companyId>',
      __v: 0 }
```

  - With an invalid ID, the server will return a 404 error
  - With an invalid token, the server will return a 401 error
  - With an invalid body, the server will return a 400 error

#### DELETE
```
DELETE /api/profile/:profileId/company/:companyId/event/:eventId
```
From this DELETE request, user will recieve the following response: 
```javascript
    {}
```

  - On successful deletion, the user will recieve a 204 status code
  
### **_Contact_**
#### POST
```
POST /api/profile/:profileId/company/:companyId/contact
```
From this POST request, user will recieve the following response:
```javascript
    { name: 'Willy Witting',
      jobTitle: 'Central Mobility Producer',
      email: 'Oleta_Berge74@yahoo.com',
      phone: '515-164-8293',
      linkedIn: 'https://krystal.name',
      userId: '<userId>',
      profileId: '<profileId>',
      companyId: '<companyId>',
      created: '2018-03-15T17:11:19.793Z',
      _id: '<._id>',
      __v: 0 }
```
  - With an invald token, the server will return a 401 error
  - Without sending a body, the server will return a 400 error
  - With an invalid request, the server will return a 404 error

#### GET
```
GET /api/profile/:profileId/company/:companyId/contact/:contactId
```
From this GET request, user will recieve the following response: 
```javascript
    { created: '2018-03-15T17:11:19.986Z',
      _id: '<._id>',
      name: 'Willy Witting',
      jobTitle: 'Central Mobility Producer',
      email: 'Oleta_Berge74@yahoo.com',
      phone: '515-164-8293',
      linkedIn: 'https://krystal.name',
      userId: '<userId>',
      profileId: '<profileId>',
      companyId: '<companyId>',
      __v: 0 }
```

  - With an invald token, the server will return a 401 error
  - With an invalid request, the server will return a 404 error

#### PUT
```
PUT /api/profile/:profileId/company/:companyId/contact/:contactId
```
From this PUT request, user will recieve the following response: 
```javascript
    { created: '2018-03-15T17:11:20.098Z',
      _id: '<._id>',
      name: 'updated name',
      jobTitle: 'Central Mobility Producer',
      email: 'Oleta_Berge74@yahoo.com',
      phone: '515-164-8293',
      linkedIn: 'https://krystal.name',
      userId: '<userId>',
      profileId: '<profileId>',
      companyId: '<companyId>',
      __v: 0 }
```
  - With an invald token, the server will return a 401 error
  - Without sending a body, the server will return a 400 error
  - With an invalid request, the server will return a 404 error

#### DELETE
```
DELETE /api/profile/:profileId/company/:companyId/contact/:contactId
```
From this delete request, user will recieve the following response: 
```javascript
    {}
```

  - On successful deletion, the user will recieve a 204 status code. 
  
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
