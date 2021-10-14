# SMART App launch module

This page provides general context for SMART Launch and the flows implemented in this module. For code details please see the [Codebase page](https://github.com/Aidbox/aidbox-react-app/wiki/Codebase).

# Overview

The following SMART app launch scenarios are supported at the moment:

- [EHR patient launch](#ehr-patient-launch)
- [EHR practitioner launch](#ehr-practitioner-launch)
- [Standalone practitioner launch](#standalone-practitioner-launch)

The front-end application serves as a sample of what a Patient Portal may look like. A Patient Portal is an environment where SMART applications can be accessed and launched by an authenticated user (e.g. EHR).

# EHR patient launch

The portal administrator picks a patient and enrolls them. Patient logs in to the Patient Portal with provided credentials, selects a SMART application, then gives this application permission to access their data.

Step-by-step guide:

1. Portal admin logs in to the portal.
2. Portal admin goes to the Patients page.
3. Portal admin selects a patient.
4. Portal admin fills in email and password for the patient and finishes the enrollment.
5. Patient logs in with credentials provided via email.
6. Patient goes to the Smart Apps page.
7. Patient selects a smart app.
8. Patient is redirected to the smart app launch URL.
9. Patient securely grants permission for the smart app to fetch their data.

# EHR practitioner launch

The portal administrator picks a practitioner and enrolls them. Practitioner logs in to the Patient Portal with provided credentials, selects a patient then selects and launches a SMART application.

Step-by-step guide:

1. Portal admin logs in to the portal.
2. Portal admin goes to the Practitioners page.
3. Portal admin selects a practitioner.
4. Portal admin fills in email and password for the practitioner and finishes the enrollment.
5. Practitioner logs in with credentials provided via email.
6. Practitioner selects a patient.
7. Practitioner launches a smart app.
8. Practitioner is redirected to the smart app launch URL.

# Standalone practitioner launch

The portal administrator picks a practitioner and enrolls them. Practitioner logs in to the Patient Portal with provided credentials, selects and launches a SMART application, then selects a patient whose data needs to be accessed.

Step-by-step guide:

1. Portal admin logs in to the portal.
2. Portal admin goes to the Practitioners page.
3. Portal admin selects a practitioner.
4. Portal admin fills in email and password for the practitioner and finishes the enrollment.
5. Practitioner logs in with credentials provided via email.
6. Practitioner goes to the Smart Apps page.
7. Practitioner launches a smart app.
8. Practitioner selects a patient.
9. Practitioner is redirected to the smart app launch URL.

_Currently we assume that all smart apps are trusted clients and do not create grant for them._

For more information on SMART Launch please see the [SMART Application Launch Implementation Guide](http://www.hl7.org/fhir/Smart-App-launch/).
