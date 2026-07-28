import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth/get-session";

export default async function HomePage() {
  const session = await getSessionFromCookies();
  redirect(session ? "/photos" : "/login");
}
