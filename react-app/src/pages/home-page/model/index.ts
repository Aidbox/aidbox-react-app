import { createDomain, sample } from "effector";
const domain = createDomain("home-page");

const downloadDataFx = domain.createEffect(async () => {
  const res = await fetch("http://localhost:8888/testApi", {
    headers: {
      Authorization: "Basic cm9vdDpzZWNyZXQ=",
    },
  });
  return res.json();
});

const $patient = domain.createStore({});

$patient.on(downloadDataFx.doneData, (_, payload) => payload);
$patient.watch((store) => console.log("PATIENT STORE ->", store));

export const downloadData = domain.createEvent();

sample({
  clock: downloadData,
  source: $patient,
  target: downloadDataFx,
});
