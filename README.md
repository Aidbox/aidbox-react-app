# Aidbox React Sample App

This is a sample frontend application that uses Aidbox as backend.

## The project includes

- SMART On FHIR Patient Portal module

## Development Stack

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/) - UI framework
- [Effector](https://effector.dev/) - state management

## Requirements

- [NodeJS](https://nodejs.org/en/) >=14
- [Docker](https://www.docker.com/) latest
- [Docker Compose](https://docs.docker.com/compose/) latest
- [Make](https://www.gnu.org/software/make/) latest
- [yarn](https://yarnpkg.com/) latest

## Installation

1. Prepare environment

   ```sh
   make install

   make prepare
   ```

2. Acquire devbox license (https://license-ui.aidbox.app/)
3. Fill _AIDBOX_LICENSE_ID_ and _AIDBOX_LICENSE_KEY_ with the acquired credentials in _./.env_
4. Acquire a Mailgun API Key (https://documentation.mailgun.com/en/latest/api-intro.html#authentication)
5. Fill _MAILGUN_API_KEY_ with your key in _./.env_
6. Start the application

   ```sh
   make up
   ```

7. Go to http://localhost:3000/ in your browser

   If everything works, you should see an Aidbox login page.

   ### Credentials

   #### Portal admin

   Go to http://localhost:3000/ (you will be redirected to login form) and log in using: portal-admin / password

   #### Aidbox admin

   Go to http://localhost:8888/auth/login and log in using: admin / secret

8. You might want to load some data to display on UI. For that, log in as Aidbox admin, then select _REST Console_ in the menu on the left, enter the following snippet and press Ctrl + Enter or "Send" button

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

After you have loaded the sample data, you should be able to see patients and practitioners on the Patient Portal running on localhost:3000 when logged in as a Portal admin (don't forget to log out of your Aidbox admin session!).

## Monitoring

To view database logs run:
```sh
docker logs aidbox-react-app_devbox-db_1
```

To view Aidbox logs run:
```sh
docker logs aidbox-react-app_devbox_1
