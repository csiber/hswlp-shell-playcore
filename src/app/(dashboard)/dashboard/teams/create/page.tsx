import { getSessionFromCookie } from "@/utils/auth";
import { redirect } from "next/navigation";
import { CreateTeamForm } from "@/components/teams/create-team-form";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Csapat létrehozása",
  description: "Új csapat létrehozása a szervezeted számára",
};

export default async function CreateTeamPage() {
  // Check if the user is authenticated
  const session = await getSessionFromCookie();

  if (!session) {
    redirect("/sign-in?redirect=/dashboard/teams/create");
  }

  return (
    <>
      <PageHeader
        items={[
          {
            href: "/dashboard/teams",
            label: "Csapatok"
          },
          {
            href: "/dashboard/teams/create",
            label: "Csapat létrehozása"
          }
        ]}
      />
      <div className="container mx-auto px-5 pb-12">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mt-4">Új csapat létrehozása</h1>
            <p className="text-muted-foreground mt-2">
              Hozz létre csapatot, hogy másokkal együtt dolgozhass projektekben és megoszthasd az erőforrásokat.
            </p>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <CreateTeamForm />
          </div>
        </div>
      </div>
    </>
  );
}
