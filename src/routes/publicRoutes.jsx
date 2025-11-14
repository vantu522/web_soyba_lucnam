import ClientLayout from "../layout/ClientLayout";
import HealthRecordLookup from "../pages/HealthRecord/HealthRecordLookup";

const publicRoutes = [
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      { index: true, element: <HealthRecordLookup /> },
      { path: "tra-cuu-so-y-ba", element: <HealthRecordLookup /> },
    ],
  },
];

export default publicRoutes;
