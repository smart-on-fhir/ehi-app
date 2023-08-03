# EHI Export API App: A client implementation for the FHIR EHI Export API (and more!)

A web application and client implementation for [Argonaut's EHI Export API Implementation Guide](https://build.fhir.org/ig/argonautproject/ehi-api/), used in conjunction with the [EHI Export Server Reference Implementation](https://github.com/smart-on-fhir/ehi-server).

Note that this project implements both a client implementation for EHI Export – the ["Second Opinion App"](https://ehi-app.herokuapp.com/jobs) – and a custom EHI-server admin UI for reviewing export requests – the ["EHI Export Admin App"](https://ehi-app.herokuapp.com/admin/jobs).

## Live Demo

To access the ["Second Opinion App"](https://ehi-app.herokuapp.com/jobs), you must login with the following test-patient credentials:

- Username: `patient`
- Password: `patient-password`

If these patient credentials aren't working, make sure they match the username and hashed password in the relevant `/backend/db/seeds.*.sql` for your deployment environment.

To access the ["EHI Export Admin App"](https://ehi-app.herokuapp.com/admin/jobs), you must login with the following test-admin credentials:

- Username: `admin`
- Password: `admin-password`

**Note**: if these admin credentials don't work, [leave an issue](https://github.com/smart-on-fhir/ehi-app/issues/new) to let us know and check the [ehi-server](https://github.com/smart-on-fhir/ehi-server) documentation for any changes that might have taken place; the credentials to access the EHI Export Admin App live on the ehi-server, so there's a chance they may change without being updated here.

Lastly, if you are encountering any issues running this project locally, make sure to check the [troubleshooting](#troubleshooting) section below before leaving any issues on the repo.

## Initial Setup

Here's how to download and set up the project locally for the first time.

1. Clone the repo

```sh
git clone https://github.com/smart-on-fhir/ehi-app.git
# Or clone using ssh if your account has ssh keys setup
git clone git@github.com:smart-on-fhir/ehi-app.git
```

2. Install dependencies in the project root

```sh
npm install
```

Additionally, there are some manual setup steps necessary in order for the project to run properly:

- Make sure you've already set up the [ehi-server](https://github.com/smart-on-fhir/ehi-server), and have noted the port the server is running on.
- Duplicate the `.env` file, naming the copy `.env.local`
- Change the `REACT_APP_EHI_SERVER` ENV variable to point to your local EHI-server instance. For example if your server is running on localhost with port 8888 you should update your `.env.local` file to include following:

```bash
REACT_APP_EHI_SERVER='http://127.0.0.1:8888'
```

## Running the project locally

Here are post-install instructions for running the project's frontend and backend from the root directory

1. Start the project's frontend

```sh
npm run start
```

2. In a separate tab, start the project's backend from the same directory

```sh
npm run start:server:dev
```

Once that's complete, you can access the EHI Export API App at [http://127.0.0.1:3000](http://127.0.0.1:3000/). From this landing page, click the two primary buttons to open up two tabs – one for accessing the patient-facing ["Second Opinion App"](http://127.0.0.1:3000/jobs), the other for accessing the admin-facing ["EHI Export Review App"](http://127.0.0.1:3000/admin/jobs). Credentials should be the same as those mentioned [above](#live-demo).

## Testing locally

There are several testing suites that can be run locally to ensure the application is working as expected:

- Backend tests: `npm run test:server:watch` will run the tests found in `/backend` in watchmode, rerunning tests as files in `/backend` are updated.
- Frontend code tests: `npm run test` will run the tests found in `/src` in watchmode, rerunning tests as files in `/src` are updated.
- Frontend UI tests: `npm run storybook` will run our [storybook](https://storybook.js.org/docs/react/get-started/install/) stories on [http://localhost:6006/](http://localhost:6006/), allowing developers to review several frontend components in isolation from the full web application.

## Troubleshooting

- `Proxy error: Could not proxy request ... from 127.0.0.1:3000 to http://127.0.0.1:5005.`
  - This usually happens when the backend server is either not running or has crashed. Make sure you've run `npm run start:server:dev` & try restarting the backend server, then reopen the application on [http://127.0.0.1:3000](http://127.0.0.1:3000)
- I see `Authorization error` when I select an institution
  - This is usually due to opening the web application on localhost:3000 instead of 127.0.0.1:3000. Because our site uses cookies to manage auth session ids, there are often issues passing those cookies from localhost:3000/institutionSelect to 127.0.0.1:5005/institution/:id. To avoid this, only interact with the application through 127.0.0.1 instead of localhost.
- Why doesn't `npm start` open the application in a browser?
  - This is intended behavior. Due to the buggy localhost-cookie behavior above, we want to limit the number of times developers accidentally open the application via localhost. While [one can specify a custom HOST ENV variable](https://stackoverflow.com/questions/66910287/react-npm-start-127-0-0-1-instead-of-localhost-on-windows) to launch the app on a non-localhost HOST, this [causes conflicts with our request proxying](https://stackoverflow.com/questions/70374005/invalid-options-object-dev-server-has-been-initialized-using-an-options-object) that would require more complicated proxying middleware then is appropriate at this time. For your local build, you should feel free to experiment with the approached detailed in the second link.
