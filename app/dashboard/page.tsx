import { BarChartSection } from "../components/BarChartSection";
import { DataTable } from "../components/DataTable";
import { KPICards } from "../components/KPICards";

const Page = () => {
  return (
     <div className="w-full max-w-screen-2xl mx-auto flex flex-col gap-8 py-15 max-2xl:px-4">
      <KPICards/>
      <DataTable />
      <BarChartSection/>
    </div>
  );
};

export default Page;
