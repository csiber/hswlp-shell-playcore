import { Metadata } from "next";
import ForgotPasswordClientComponent from "./forgot-password.client";

export const metadata: Metadata = {
  title: "Elfelejtett jelszó",
  description: "Jelszó visszaállítása",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClientComponent />;
}
