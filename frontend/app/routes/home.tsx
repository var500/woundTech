import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Wound Tech" },
    { name: "description", content: "Welcome to Wound Tech" },
  ];
}

export default function Home() {
  return <Welcome />;
}
