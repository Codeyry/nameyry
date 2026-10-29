import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminDashboard from "../../components/admin-dashboard";
import { getTotalNames, getPendingNames, getPublishedNames, getSettings } from "@/app/actions"

async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return data.claims;
}

export default async function ProtectedPage() {
  const claims = await UserDetails();
  const adminEmail = typeof claims.email === "string" ? claims.email : undefined;
  const totalNames = await getTotalNames()
  const pending = await getPendingNames();
  const published = await getPublishedNames();
  const settings = await getSettings()

  console.log(settings)


  return <AdminDashboard pending={pending} published={published} adminEmail={adminEmail} totalNames={totalNames} settings={settings}/>;
}
