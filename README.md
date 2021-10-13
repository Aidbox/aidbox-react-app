# Dev

```sh
yarn install

make prepare

make up
```

After that add missing env variable values for:

```sh
AIDBOX_LICENSE_ID
AIDBOX_LICENSE_KEY
MALIGUN_API_KEY
```

To load synthea data go to AIDBOX_URL, open REST console and put the following data:

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

To login as portal admin use the following creds:

```sh
username: portal-admin
password: password
```

To login as super admin use the following creds:

```sh
username: AIDBOX_ADMIN_ID
password: AIDBOX_ADMIN_PASSWORD
```
