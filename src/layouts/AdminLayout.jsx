import Sidebar from '../components/Sidebar/Sidebar';
import SlideOver from '../components/Sidebar/SlideOver';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => (
  <div className="bg-gray-100">
    <div className="flex w-full h-screen max-h-screen">
      <div className="h-full p-1 max-w-[300px] w-full hidden md:block">
        <div className="flex flex-col rounded-xl h-full w-full grow gap-y-5 overflow-y-auto border py-2 pt-8 px-4 bg-white">
          <Sidebar />
        </div>
      </div>
      <div className="md:hidden">
        <SlideOver />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AdminLayout; 