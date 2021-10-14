# SMART App launch module

If you are not familiar with the code structure, you can go to [this wiki page](https://github.com/Aidbox/aidbox-react-app/wiki/code-structure) and find out what is going on.

This module is an implementation of [SMART Application Launch Framework Implementation Guide](http://www.hl7.org/fhir/Smart-App-launch/) and implement the following launch scenarious:
* [EHR patient launch](#ehr-patient)
* [EHR practitioner launch](#ehr-practitioner)
* [Standalone practitioner launch](#standalone-practitioner)


# EHR patient

Patient has to be enrolled.
Patient goes to patient portal, logs in via credentials, picks needed smart application and gives this application access to his own data.

To make this flow possible you need to do the following steps:
1. Portal admin logs in to portal.
2. Portal admin go to patients page.
3. Portal admin picks a patient.
4. Poratl amdin enrolls patient with filled email and password (email was sent via mailgun to entered email).
5. Patient logs in via credentials from the email.
6. Patient picks appropriate smart app.
7. Patient has redirected to smart app url and securely grants permission to fetch his data to smart app.

# EHR practitioner

Practitioner has to be enrolled.
Practitioner goes to patient portal, logs in via credentials, picks needed patient and launch app on patient data.

To make this flow possible you need to do the following steps:
1. Portal admin logs in to portal.
2. Portal admin go to practitioner page.
3. Portal admin picks a practitioner.
4. Poratl amdin enrolls practitioner with filled email and password (email was sent via mailgun to entered email).
5. Practitioner logs in via credentials from the email.
6. Practitioner picks needed patient.
7. Practitioner launch smart app on patient data.
8. Practitioner has redirected to smart app url and securely grants permission to fetch patient data to smart app.

# Standalone practitioner

Practitioner has to be enrolled.
Practitioner goes to patient portal, logs in via credentials, chooses smart app then chooses patient and then the application retrievs this patient's data

To make this flow possible you need to do the following steps:
1. Portal admin logs in to portal.
2. Portal admin go to practitioner page.
3. Portal admin picks a practitioner.
4. Poratl amdin enrolls practitioner with filled email and password (email was sent via mailgun to entered email).
5. Practitioner logs in via credentials from the email.
6. Practitioner goes to smart apps page.
7. Practitioner run smart app.
8. Practitioner was redirected to pick patient page.
9. Practitioner chooses patient.
10. Practitioner has redirected to smart app url and.

_Currently we assume that all smart apps are trusted clients and do not create grant for them._
