import MaintenanceScreen from "@/components/maintenance-screen";
import { getSettings } from "../actions";
import SubmitForm from "./submit-form";

export default async function SubmitPage() {
  const settings = await getSettings();

  if (settings?.accept_submissions !== true) {
    return (
      <MaintenanceScreen
        eyebrow="Submissions are paused"
        title="Name submissions are taking a short break."
        description="We are not accepting new names right now. Please check back soon."
        icon="✋"
      />
    );
  }

  return <SubmitForm />;
}
