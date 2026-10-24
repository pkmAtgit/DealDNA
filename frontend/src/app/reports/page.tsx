import DynamicScreenPage from "@/app/screens/[screenId]/page";

export default function Page() {
  return <DynamicScreenPage params={{ screenId: "18" }} />;
}
