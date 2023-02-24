# E-BX Test - Greg Holt

## Install / Run

1. Clone the project:

```bash
git clone git@github.com:gr3gj3/e-bx.git
cd e-bx
```

(Checkout branch if desired;)

```bash
git checkout <branch>
```

2. (a) Run tests (Non Docker):

```bash
npm install
npx playwright test
```
(Note: Specify any desired Environment Variables appropriately as a precursor of the 'npx playwright test' command.)

2. (b) Run tests (Docker):
```bash
docker build . -t <name>:<tag>
docker run --env MY_VAR1=value1 --env MY_VAR2=value2 <name>:<tag> npx playwright test
```

2. (c) Run tests (Docker-Compose):
```bash
docker-compose up -d
```
(Amend Environment Variables in the docker-compose.yml file where desired.)

## Configuration

* tests/env.js includes the specification of default variables used for the tests.
* Environment Variables can be/should otherwise however be set at runtime - through the usual methods. (and outlined above) (tests/env.js caters for such)
* I have included the specified owner/repo etc information in this tests/env.js file as well as the docker-compose for convenience - in a production scenario this information would inevitably be omitted and need to be injected dynamically.