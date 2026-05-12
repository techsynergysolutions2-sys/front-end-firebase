import './App.css';
import {BrowserRouter, Route,Routes} from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Tasks from './tasks/Tasks'
import TaskDetail from './tasks/TaskDetail'
import Projects from './projects/Projects'
import ProjectDetail from './projects/ProjectDetail'
import Inventory from './inventory/Inventory'
import Product from './inventory/Product'
import Orders from './orders/Orders'
import CreateOrder from './orders/NewOrder'
import Analytics from './analytics/Analytics'
import Invoice from './orders/Invoice'
import Tickets from './tickets/Tickets'
import Ticket from './tickets/Ticket'
import Leaves from './leave/Leaves'
import EmployeeLeaveForm from './leave/LeaveForm'
import Employees from './employees/Employees'
import Employee from './employees/Employee'
import Clients from './clients/Clients'
import Client from './clients/Client'
import PermissionsList from './permissions/PermissionsList'
import PermissionsTab from './permissions/Permissions'
import Groups from './groups/Groups'
import Group from './groups/Group'
import Profile from './profile/Profile'
import Department from './department/Department'
import Departments from './department/Departments'
import CompanyProfile from './company/CompanyProfile'
import AboutPage from './about/About';


function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route Component={Login} path="/login"/>
          <Route Component={Register} path="/register"/>
          <Route Component={AboutPage} path="/crm"/>
          <Route Component={Home} path="/">
            <Route Component={Tasks} path="/tasks"/>
            <Route Component={TaskDetail} path="/taskdetail"/>
            <Route Component={Projects} path="/projects"/>
            <Route Component={ProjectDetail} path="/projectdetail"/>
            <Route Component={Analytics} path="/analytics"/>
            <Route Component={Inventory} path="/inventory"/>
            <Route Component={Product} path="/product"/>
            <Route Component={Orders} path="/orders"/>
            <Route Component={CreateOrder} path="/neworder"/>
            <Route Component={Tickets} path="/tickets"/>
            <Route Component={Ticket} path="/ticket"/>
            <Route Component={Leaves} path="/leaves"/>
            <Route Component={EmployeeLeaveForm} path="/leaveform"/>
            <Route Component={Employees} path="/employees"/>
            <Route Component={Employee} path="/employee"/>
            <Route Component={Clients} path="/clients"/>
            <Route Component={Client} path="/client"/>
            <Route Component={PermissionsList} path="/permissionslist"/>
            <Route Component={PermissionsTab} path="/permissions"/>
            <Route Component={Groups} path="/groups"/>
            <Route Component={Group} path="/group"/>
            <Route Component={Profile} path="/profile"/>
            <Route Component={Departments} path="/departments"/>
            <Route Component={Department} path="/department"/>
            <Route Component={CompanyProfile} path="/companyprofile"/>
          </Route>
           <Route Component={Invoice} path="/invoice"/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
