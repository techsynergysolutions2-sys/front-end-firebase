import {useState, useEffect} from 'react'
// import '../customstyles/customstyle.css';
import { Layout, Menu,Row,Col,Image, Typography } from 'antd';
import {useNavigate} from 'react-router-dom'
import { fnConnectNavigation,host_url } from '../shared/shared';

const { Sider } = Layout;


function SidebarMenu({collapse}) {

  const navigate = useNavigate()

  const [profile, setProfile] = useState('')

  useEffect(() => {

    let temp = fnCheckLogin()

    if(temp == false){
      window.location.replace(`${host_url}/login`);
    }

    setProfile(sessionStorage.getItem('photourl'))
    
  },[])

  const onClick = (e) => {
    navigate(e)
  };

  const fnNavProfile = () => {
    navigate('/Profile')
  }

  return (
    <>
    
      <Sider trigger={null} collapsed={collapse} style={{backgroundColor: '#fff',overflowY: 'scroll',msOverflowStyle: 'none',scrollbarWidth: 'none'}}>
        <div className="demo-logo-vertical" />

        <Menu onClick={({key}) => onClick(key) } theme="light" defaultOpenKeys={['sales','admin']} defaultSelectedKeys={['1']} mode="inline" items={fnConnectNavigation([])} 
        style={{fontSize: "17px"}} />
        
      </Sider>

    </>
  
  )
}

const fnCheckLogin = () => {

  var companyid = sessionStorage.getItem('companyid')
  var uid = sessionStorage.getItem('uid')
  var permissions = sessionStorage.getItem('permissions')
  var groupid = sessionStorage.getItem('groupid')

  console.log(companyid)
  console.log(uid)
  console.log(permissions)
  console.log(groupid)

  console.log(uid == null)

  if( uid == null ){
    console.log('Check 1')
    return false
  }

  if(companyid === null){
    console.log('Check 2')
    return false
  }

  if(permissions == null){
    console.log('Check 3')
    return false
  }

  if(groupid == null){
    console.log('Check 4')
    return false
  }

  return true
  
}

export default SidebarMenu