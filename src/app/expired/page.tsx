import { redirect } from "next/navigation";

export default function Expired() {
  return redirect("/login");
}
