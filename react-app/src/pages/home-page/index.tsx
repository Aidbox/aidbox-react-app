import { reflect } from "@effector/reflect";
import { Home } from "./ui/home";
import { downloadData } from "./model";

export const HomePage = reflect({
  view: Home,
  bind: { text: "Hello World" },
  hooks: { mounted: downloadData },
});
