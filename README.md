# Test Apollo GraphQl backend
backend created using Nodejs Express Sequelize Apollo-Graphql and connected to PostgreSQL DB.


## How to run
to create local database + migrate + seed thats already prepared
- `npm run config`

to redo migration with fresh seed
- `npm run redo-migrate`

### localhost:4000/graphql
to run with express in /graphql endpoint
- `npm start`
- `or npx sequelize index.js`

### localhost:4000
To run on normal mode or standalone mode
- `npm run standalone`
- `or npx sequelize app.js`

## How to Test
go to apollo sandbox
- `https://studio.apollographql.com/sandbox/explorer`