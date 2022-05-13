# My car value
API for figuring out a price for used cars build with NestJS.

## Available resources
- Auth

| Query Type | Endpoint         | Action                               |
|------------|------------------|------------------------------------- |
| GET        | /api/**auth**/whoami | Get the currently signed in user |
| POST       | /api/**auth**/signup | Register a new user              |
| Post       | /api/**auth**/signup | Log in with credentials          |

- Reports

| Query Type | Endpoint             | Action                          |
|------------|----------------------|---------------------------------|
| GET        | /api/**reports**     | Get an estimate for an used car |
| POST       | /api/**reports**     | Report selling a vehicle        |
| PATCH      | /api/**reports**/:id | Approve a car's report          |

## Technologies
Project is created with:
* NestJS
* typescript
* postgresql
* typeorm
* docker-compose
* class-validator
* cookie-session
* dotenv
