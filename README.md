# API Design Assignment

## Project Name

Video Game Sales API

## Objective

This is a GraphQL API that allows the users to retrieve and manage information from the Video Game Sales dataset. The API includes JWT authentication, automated testing through Postman/Newman in a CI/CD pipeline and is publicly deployed on Railway.

The API serves the data from [Kaggle Video Game Sales dataset](https://www.kaggle.com/datasets/gregorut/videogamesales/data) that contains over 16,500 video game sales records. The users can query games, publishers, platforms and also perform full CRUD operations on the games by using JWT authentication.

## Implementation Type

GraphQL

## Links and Testing

| | URL / File |
|---|---|
| **Production API** | https://1dv027-api-design-graphql-production.up.railway.app/graphql |
| **API Documentation** | https://studio.apollographql.com/sandbox/explorer?endpoint=https://1dv027-api-design-graphql-production.up.railway.app/graphql (Apollo Sandbox) |
| **GraphQL Playground** (GraphQL only) | https://1dv027-api-design-graphql-production.up.railway.app/graphql |
| **Postman Collection** | `postman/videogame-api.postman_collection.json` |
| **Production Environment** | `postman/production.postman_environment.json` |

**Examiner can verify tests in one of the following ways:**

1. **CI/CD pipeline** — check the pipeline output in the GitHub repository for test results.
2. **Run manually** — no setup needed:
   ```
   npx newman run postman/videogame-api.postman_collection.json -e postman/production.postman_environment.json
   newman
   ```

## Dataset

*Describe the dataset you chose:*

| Field | Description |
|---|---|
| **Dataset source** | Kaggle - [Video Game Sales](https://www.kaggle.com/datasets/gregorut/videogamesales/data) |
| **Primary resource (CRUD)** | Games (id, name, platform, year, genre, publisher, naSales, euSales, jpSales, otherSales, globalSales) |
| **Secondary resource 1 (read-only)** | Publishers (id, name, totalGames, totalGlobalSales) |
| **Secondary resource 2 (read-only)** | Platforms (id, name, totalGames, genres, releaseYears) |


## Design Decisions

### Authentication

A JSON Web Token (JWT) is used for authentication. The users can register and log in through the different GraphQL mutations (register, login) and will then receive a signed token that expires after 90 days and must be included as a Bearer token in the Authorization header for the createGame, updateGame and deleteGame operations. The alternative solution would have been a session-based authentication, but JWT is better because it is stateless and better suited for APIs since it does not require a server-side session storage. The trade-off with a JWT token is that the tokens cannot be invalidated before they expire.

### API Design

**GraphQL students:**
The API uses a single */graphql* endpoint where all of the queries and mutations are processed and the schema is organized around three main types which is **Game**, **Publisher** and **Platform**.

**Schema:**

- games(limit, offset, genre, platform, year) - a paginated and filterable list of all the games

- game(id) - fetches a single game by the ID

- publishers(limit, offset) - a paginated list of all publishers with collected status

- publisher (id) - fetches a single publisher by the ID

- platforms(limit, offset) - a paginated list of all platforms with collected status

- platform(id) - fetches a single platform by the ID

- register(username, password) - creates a new user account

- login(username, password) - authenticates the user and receives a JWT token

- createGame(...) - creates a new game (authentication is required)

- updateGame(...) - updates an existing game (authentication is required)

- deleteGame(id) - deletes a game (authentication is required)

**Nested queries:**

Nested queries are supported by allowing users to fetch a game and its publisher in one single request. This approach means that all requests go to *graphql* as POST requests. The advantage with GraphQL unlike REST is that users can request exactly the data they need, avoiding over-fetching and under-fetching.

### Error Handling
I chose to have HTTP 200 OK as status codes for all the operations and then errors are returned in the errors field of the response-body. All of the errors include a descriptive message.

- Authentication errors returns: Authentication required

- Not-found errors returns: [Resource] not found

- Invalid ID format errors returns: Invalid ID format

- Invalid MongoDB IDs are validated in the *#validateId* method before reaching the database by returning a clear error message to the client.

## Core Technologies Used

**Node.js + Express:** The framework that I am most familiar with, and it has a large environment for building APIs. Express also provides a flexible foundation for mounting Apollo Server.

**Apollo Server:** It was recommended in the course and what I have understood it is also a standard GraphQL server for Node.js with built-in support for handling schema, definition, resolvers and context.

**MongoDB + Mongoose:** It is the only database that I have used before and I think MongoDB handles missing fields well, which I think suits my dataset well. Mongoose also adds schema validation and cleaner query interface.

**JWT:** It is a stateless authentication that does not require server-side session storage. The JWT is signed with a secret and verified on each request.

**bcryptjs:** Used it for secure password hashing using the bcrypt algorithm before storing the password in the database.

**Docker + Docker Compose:** I have used it before and it also ensures a consistent development environment across the machines. Docker Compose can also start the MongoDB, the API and the seed script with a single command.

**Railway:** I thought that it was hard to deploy on CSCloud in previous courses and I didn't want to go through that again with Cumulus so I chose Railway. Railway has a simple cloud deployment with a built-in MongoDB support and automatic deploys on every GitHub push so that the production environment is always up to date.

**Newman:** It was recommended in the course and also provides a CLI runner for Postman collections. This then allows the test suite to be executed in a CI/CD pipeline without a graphical interface.

**GitHub Actions:** Automates the test pipeline on every push and pull request to main, which ensures that no tests fails.

## Getting Started
#### Prerequisites:
- Docker and Docker Compose

- Node.js 22+

- The CSV dataset file from Kaggle (see the Seed Instructions)

#### Run Locally with Docker:
```bash
# Clone the repository
git clone <https://github.com/fatimaalkashaf/1DV027---API-design-GraphQL-.git>
cd assignment api-design

# Create a .env file with a JWT secret
echo "JWT_SECRET=your_secret_here" > .env

# Starts the application (MongoDB + API + automatic seed script)
docker-compose up --build
```

#### Seed Instructions
1. Download *vgsales.csv* from [Kaggle](https://www.kaggle.com/datasets/gregorut/videogamesales/data)

2. Place the file in *seed/data* folder

3. Run:

```bash
npm run seed
```

## Reflection
**What was hard?:**

I think the hardest thing for me was to learn how to deploy the project Railway because I have never done it before. It turns out that MongoDB uses different connection strings for connections inside Railway and connections from a local computer, which caused some confusions for me in the beginning. The MongoDB service also crashed twice during the development so the database had to be seeded again.

Another problem for me that took some time to figure out was the bug in the JWT authentication middleware for all of the request that required authentication in Postman. It turned out that I had forgot to add a space in startsWith('Bearer ') in src/middleware/auth.js so instead it read startsWith('Bearer') and caused all of the authenticated request to fail. It took time to figure this out because the error message only said "Authentication required" so it was difficult to find the real problem.

**What did I learn?:**

Before this assignment I have never had prior experience with GraphQL so a large part of the work in the beginning went into understanding how it works. This included learning the differences between queries and mutations, how to define a schema with types, and how the resolvers connects the schema to the database. Understanding how context works in Apollo Server took also some time. Then the GraphQLs single-endpoint approach simplified the routing because all of the queries and mutations goes through */graphql*, although it requires more careful schema design from the beginning compared to REST where you can add endpoints gradually if I am not mistaken.

**What would I do differently?:**

The things that I would have done differently is first of all add more thorough input validation on mutations, for example checking that the string fields like *name* and *genre* are not empty, instead of relying only on GraphQLs type system to reject missing required fields. The second thing that I would have done differently is to be more careful with reviewing each file thoroughly before moving on to the next file. This because several bugs and typos, such as wrong variable names and an incorrect field type were hard to find later in the testing progress.

## Acknowledgements
- [Video Game Sales](https://www.kaggle.com/datasets/gregorut/videogamesales/data)

- [Apollo Docs](https://www.apollographql.com/docs)

- All of the course material for this assignment

- Claude.ai

## Requirements

See [all requirements in Issues](../../issues/). Close issues as you implement them. Create additional issues for any custom functionality. See [TESTING.md](TESTING.md) for detailed testing requirements.

### Functional Requirements — Common

| Requirement | Issue | Status |
|---|---|---|
| Data acquisition — choose and document a dataset (1000+ data points) | [#1](../../issues/1) | :✅: |
| Full CRUD for primary resource, read-only for secondary resources | [#2](../../issues/2) | :✅: |
| JWT authentication for write operations | [#3](../../issues/3) | :✅: |
| Error handling (400, 401, 404 with consistent format) | [#4](../../issues/4) | :✅: |
| Filtering and pagination for large result sets | [#17](../../issues/17) | :✅: |

### Functional Requirements — GraphQL

| Requirement | Issue | Status |
|---|---|---|
| Queries and mutations via single `/graphql` endpoint | [#14](../../issues/14) | :✅: |
| At least one nested query | [#15](../../issues/15) | :✅: |
| GraphQL Playground available | [#16](../../issues/16) | :✅: |

### Non-Functional Requirements

| Requirement | Issue | Status |
|---|---|---|
| API documentation (Swagger/OpenAPI or Postman) | [#6](../../issues/6) | :✅: |
| Automated Postman tests (20+ test cases, success + failure) | [#7](../../issues/7) | :✅: |
| CI/CD pipeline running tests on every commit/MR | [#8](../../issues/8) | :✅: |
| Seed script for sample data | [#5](../../issues/5) | :✅: |
| Code quality (consistent standard, modular, documented) | [#10](../../issues/10) | :✅: |
| Deployed and publicly accessible | [#9](../../issues/9) | :✅: |
| Peer review reflection submitted on merge request | [#11](../../issues/11) | :white_large_square: |


