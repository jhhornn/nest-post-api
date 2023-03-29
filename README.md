<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Test

```bash
# unit tests
$ npm run test

```

## Env

change `.env.example.dev` to `.env.stage.dev` and update the values in it.


## Doc
```
http://localhost:<PORT>/api-doc
```
## Routes

<pre>
root route - `api/v1/`
</pre>
### API Endpoints - Posts
| Endpoint | Method | Description              |
|----------|--------|--------------------------|
|posts/    |GET     |Get posts(include filters)|
|posts/:id |GET     |Get a post                |
|posts/    |POST    |Create a posts            |
|posts/    |DELETE  |Delete a post             |
|posts/:id |PATCH   |Update a post             |



### API Endpoints - Auth
| Endpoint    | Method | Description |
|-------------|--------|-------------|
|auth/signup/ |POST    |Sign up      |
|auth/signin/ |POST    |Sign in      |



## Description of Flow
1. Client sends a request to the API server
2. API server checks if the request requires authentication
3. If authentication is required, API server checks if the client has a valid token
4. If the client has a valid token, API server proceeds with the request
5. If the client does not have a valid token, API server sends a 401 Unauthorized response
6. If authentication is not required, API server proceeds with the request
7. API server processes the request based on the HTTP method (GET, POST, DELETE, or PATCH)
8. If the request is GET, API server retrieves the resource and sends it back to the client
9. If the request is POST, API server creates a new resource and sends a 201 Created response with the URI of the new resource
10. If the request is DELETE, API server deletes the resource and sends a 204 No Content response
11. If the request is PATCH, API server updates the resource and sends a 200 OK response with the updated resource

Note: The client obtains a valid token through an authentication process and sends the token with each request in the Authorization header. The API server validates the token using a token validation service or a similar mechanism.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
