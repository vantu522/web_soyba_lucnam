import { Outlet, useLocation } from "react-router-dom";
const ClientLayout = () => {
    const location = useLocation();


  return (
    <>
      <main className="">
        <Outlet />
      </main>
    
    </>
  );
};

export default ClientLayout;
