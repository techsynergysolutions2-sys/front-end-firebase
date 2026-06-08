import {useState, useEffect} from 'react'
import { NavLink } from "react-router-dom";
import "./sidebar.css";
import { host_url,fnConnectNavigation,fnConnectNavigationTitles,fnGetDirectData } from '../shared/shared';

export default function Sidebar() {

  useEffect(() => {

    let temp = fnCheckLogin()

    let isactive = fnIsActive()

    if(temp == false){
      window.location.replace(`${host_url}/login`);
    }

    if(!isactive){
      window.location.replace(`${host_url}/login`);
    }
    
  },[])


  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="logo">Eben crm</div>

        {
          fnConnectNavigationTitles([2,3,4])? (
            <div className="menu-group">
              <div className="menu-title">Sales</div>
              {
                fnConnectNavigation(2)? (
                  <NavLink to="/inventory" end className="menu-item">
                    Inventory
                  </NavLink>
                ):(null)
              }

              {
                fnConnectNavigation(3)? (
                  <NavLink to="/orders" className="menu-item">
                    Orders
                  </NavLink>
                ):(null)
              }

              {
                fnConnectNavigation(4)? (
                  <NavLink to="/analytics" className="menu-item">
                  Analytics
                </NavLink>
                ):(null)
              }
              
            </div>
          ):(null)
        }
        
        {
          fnConnectNavigationTitles([5,6,7,8,9])? (
            <div className="menu-group">
              <div className="menu-title">OVERVIEW</div>

              {
                fnConnectNavigation(5)? (
                  <NavLink to="/tasks" className="menu-item">
                    Tasks
                  </NavLink>
                ):(null)
              }
              
              {
                fnConnectNavigation(6)? (
                  <NavLink to="/projects" className="menu-item">
                    Projects
                  </NavLink>
                ):(null)
              }
              
              {
                fnConnectNavigation(7)? (
                  <NavLink to="/tickets" className="menu-item">
                    Tickets
                  </NavLink>
                ):(null)
              }
              
              {
                fnConnectNavigation(8)? (
                  <NavLink to="/leaves" className="menu-item">
                    Leave
                  </NavLink>
                ):(null)
              }
              
            </div>
          ):(null)
        }

        {
          fnConnectNavigationTitles([9,10,11,12,13,14])? (
            <div className="menu-group">
              <div className="menu-title">MANAGEMENT</div>

              {
                fnConnectNavigation(9)? (
                  <NavLink to="/employees" className="menu-item">
                    Employees
                  </NavLink>
                ):(null)
              }

              {
                fnConnectNavigation(10)? (
                  <NavLink to="/clients" className="menu-item">
                    Clients
                  </NavLink>
                ):(null)
              }

              {
                fnConnectNavigation(11)? (
                  <NavLink to="/departments" className="menu-item">
                    Departments
                  </NavLink>
                ):(null)
              }

              {
                fnConnectNavigation(12)? (
                  <NavLink to="/groups" className="menu-item">
                    Groups
                  </NavLink>
                ):(null)
              }
              
              {
                fnConnectNavigation(13)? (
                  <NavLink to="/permissionslist" className="menu-item">
                    Permissions
                  </NavLink>
                ):(null)
              }

              {
                fnConnectNavigation(14)? (
                  <NavLink to="/companyprofile" className="menu-item">
                    Company Profile
                  </NavLink>
                ):(null)
              }

            </div>
          ):(null)
        }

        <div className="menu-group">

          <NavLink to="/profile" end className="menu-item">
            Profile
          </NavLink>

          <NavLink to="/login" className="menu-item">
            Logout
          </NavLink>
        </div>

      </div>
    </aside>
  );
}


const fnCheckLogin = () => {

  var companyid = sessionStorage.getItem('companyid')
  var uid = sessionStorage.getItem('uid')
  var permissions = sessionStorage.getItem('permissions')
  var groupid = sessionStorage.getItem('groupid')

  if( uid == null ){
    return false
  }

  if(companyid === null){
    return false
  }

  if(permissions == null){
    return false
  }

  if(groupid == null){
    return false
  }

  return true
  
}

const fnIsActive = async () => {

  var uid = sessionStorage.getItem('uid')

  let sql = `
    SELECT id FROM employees WHERE id = ${uid} AND isactive = 1
  `

  try {
    const res = await fnGetDirectData('dashboard',sql);
    if(res.length > 0){
      return true
    }
  } catch (error) {
    
  }

  return false
}

