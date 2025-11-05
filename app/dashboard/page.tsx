import { DataTable } from "../components/DataTable";
import { KPICards } from "../components/KPICards";

const Page = () => {
  return (
     <div className="w-10/12 mx-auto flex flex-col gap-8 py-15">
      <DataTable />
      <KPICards/>
    </div>
  );
};

export default Page;
