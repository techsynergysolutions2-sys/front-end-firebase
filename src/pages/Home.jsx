import {useEffect} from 'react'
import {Layout } from 'antd';
import {useNavigate, Outlet } from 'react-router-dom'
import { fnCheckExpiryDate } from '../shared/shared';

import Sidebar from '../sidebar/Sidebar';

const { Header, Content } = Layout;

function Home() {

  useEffect(() => {
    fnCheckExpiryDate()

  },[])

  return (
    <div style={{height: '100vh', display: 'flex'}}>
      <Sidebar />
      <Outlet />
    </div>
  )
}


export default Home