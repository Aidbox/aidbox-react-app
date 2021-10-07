# Dev

```sh
yarn install

make prepare

make up
```

```yaml
POST /fhir/$import
Accept: text/yaml
Content-Type: text/yaml

id: synthea
inputFormat: application/fhir+ndjson
contentEncoding: gzip
mode: bulk
inputs:
- resourceType: AllergyIntolerance
  url: https://storage.googleapis.com/aidbox-public/synthea/100/AllergyIntolerance.ndjson.gz
- resourceType: CarePlan
  url: https://storage.googleapis.com/aidbox-public/synthea/100/CarePlan.ndjson.gz
- resourceType: Claim
  url: https://storage.googleapis.com/aidbox-public/synthea/100/Claim.ndjson.gz
- resourceType: Condition
  url: https://storage.googleapis.com/aidbox-public/synthea/100/Condition.ndjson.gz
- resourceType: DiagnosticReport
  url: https://storage.googleapis.com/aidbox-public/synthea/100/DiagnosticReport.ndjson.gz
- resourceType: Encounter
  url: https://storage.googleapis.com/aidbox-public/synthea/100/Encounter.ndjson.gz
- resourceType: ExplanationOfBenefit
  url: https://storage.googleapis.com/aidbox-public/synthea/100/ExplanationOfBenefit.ndjson.gz
- resourceType: Goal
  url: https://storage.googleapis.com/aidbox-public/synthea/100/Goal.ndjson.gz
- resourceType: ImagingStudy
  url: https://storage.googleapis.com/aidbox-public/synthea/100/ImagingStudy.ndjson.gz
- resourceType: Immunization
  url: https://storage.googleapis.com/aidbox-public/synthea/100/Immunization.ndjson.gz
- resourceType: MedicationAdministration
  url: https://storage.googleapis.com/aidbox-public/synthea/100/MedicationAdministration.ndjson.gz
- resourceType: MedicationRequest
  url: https://storage.googleapis.com/aidbox-public/synthea/100/MedicationRequest.ndjson.gz
- resourceType: Observation
  url: https://storage.googleapis.com/aidbox-public/synthea/100/Observation.ndjson.gz
- resourceType: Organization
  url: https://storage.googleapis.com/aidbox-public/synthea/100/Organization.ndjson.gz
- resourceType: Patient
  url: https://storage.googleapis.com/aidbox-public/synthea/100/Patient.ndjson.gz
- resourceType: Practitioner
  url: https://storage.googleapis.com/aidbox-public/synthea/100/Practitioner.ndjson.gz
- resourceType: Procedure
  url: https://storage.googleapis.com/aidbox-public/synthea/100/Procedure.ndjson.gz
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
