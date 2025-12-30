import { redirect } from "next/navigation";
import "./css/login.css"
export default function Home() {
  redirect("/login");
}
