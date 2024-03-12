# pagoPA Shared Toolbox

The project is an aggregator of pagoPA platform application, make usable by a dedicated frontend interface.

## Prerequisites

- Install [yarn](https://classic.yarnpkg.com/en/docs/getting-started)
- Install lib dependencies

## Available Scripts

For install all the dependencies defined in `package.json`, you can run:

### `yarn`

In the project directory, you can run:

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

### `yarn generate`

It generates the client API scripts able to interact with the backend APIs according to the Swagger defined for each application.\


### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.\
It should be something like the following image

![](...)

The page will reload if you make edits and you will also see any lint errors in the console.


### `yarn start:local`

Runs the app in the development mode, pointing to backend service running in local.