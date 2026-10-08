import { redirect } from "next/navigation";

export default function StoreRedirectPage() {
  redirect("/?store=1");
}
