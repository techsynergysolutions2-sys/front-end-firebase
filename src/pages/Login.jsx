import React,{useEffect,useMemo,useState} from 'react';
import { Button, Checkbox, Form, Input,Card,Row,Typography,notification } from 'antd';
import {useNavigate, Outlet } from 'react-router-dom'
import {auth } from '../shared/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import {  fnGetData,fnGetDirectData,fnCheckExpiryDate,host_url } from '../shared/shared';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { useStateValue } from '../data/StateProvider';

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

function Login(){

    const [api, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();
    const [{}, dispatch] = useStateValue();

    const fnNavRegister = () => {
        navigate('/register')
    }

    useEffect(() => {
        
        sessionStorage.removeItem('companyid')
        sessionStorage.removeItem('department')
        sessionStorage.removeItem('photourl')
        sessionStorage.removeItem('firstname')
        sessionStorage.removeItem('lastname')
        sessionStorage.removeItem('email')
        sessionStorage.removeItem('uid')
        sessionStorage.removeItem('permissions')
        sessionStorage.removeItem('groupid')

    },[])

    const onFinish = async values => {
        setLoading(true)
        try {
            const data = await fnGetData('login',"", {email: values['username'], password: values['password']}, { columns: '*'});
           
            if(data.code == 200){
               
                let sq = `
                    SELECT e.id,e.firstname,e.lastname,e.email,e.companyid,e.department,e.groupid,e.photourl, c.expirydate,ug.title
                    FROM employees e
                    JOIN companies c
                    ON e.companyid = c.id
                    JOIN user_groups ug
                    ON ug.id = e.groupid
                    WHERE c.isactive = 1 AND e.id = '${data.userid}' AND e.isactive = 1
                    LIMIT 1;
                `
                try {
                    const data2 = await fnGetDirectData('employees',sq);
                    if(data2.length > 0){
                        
                        let sql = `
                                SELECT gp.*,ug.title 
                                FROM group_permissions gp
                                JOIN user_groups ug
                                ON gp.id = ug.id
                                WHERE gp.companyid = ${data2[0].companyid} AND groupid = ${data2[0].groupid}
                                `
                        const data3 = await fnGetDirectData('orders',sql);
                        setLoading(false)
                        sessionStorage.setItem('companyid',data2[0].companyid)
                        sessionStorage.setItem('department',data2[0].department)
                        sessionStorage.setItem('photourl',data2[0].photourl)
                        sessionStorage.setItem('firstname',data2[0].firstname)
                        sessionStorage.setItem('lastname',data2[0].lastname)
                        sessionStorage.setItem('email',data2[0].email)
                        sessionStorage.setItem('uid',data2[0].id)
                        sessionStorage.setItem('expirydate',data2[0].expirydate)
                        sessionStorage.setItem('grouptitle',data2[0].title)
                        let groupid = data2[0].groupid
                        let groupidtitle = data2[0].title
                       
                        if(fnCheckExpiryDate()){
                            if(groupidtitle != 'Administrator'){
                                api.warning({
                                    title: ``,
                                    description: 'Your subscription has expired. Please contact you administrator',
                                    placement,duration: 6,
                                    style: {
                                    background: "#e2e2e2ff"
                                    },
                                });
                            }else{
                                    sessionStorage.setItem('permissions',0)
                                    sessionStorage.setItem('groupid',data2[0].groupid)
                                    navigate('/companyprofile')
                                }
                            
                        }else{
                            if(groupidtitle != 'Administrator'){
                                sessionStorage.setItem('permissions',data3[0].permissions)
                            }else{
                                sessionStorage.setItem('permissions',0)
                            }
                            sessionStorage.setItem('groupid',data2[0].groupid)
                            navigate('/tasklist')
                        }
                        
                    }else{
                        setLoading(false)
                        api.warning({
                            title: ``,
                            description: 'Incorrect username or password',
                            placement,duration: 6,
                            style: {
                            background: "#e2e2e2ff"
                            },
                        });
                    }
                } catch (error) {
                    
                }


            }else{
                setLoading(false)
                api.warning({
                    title: ``,
                    description: 'Incorrect username or password',
                    placement,duration: 6,
                    style: {
                    background: "#e2e2e2ff"
                    },
                });
            }
        } catch (error) {
            
        }

      };
      const onFinishFailed = errorInfo => {
        
      };

    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    return(
        <Context.Provider value={contextValue}>
        {contextHolder}
        {/* <Row justify="center" align="middle" style={{height: "100vh"}}>
        <Card style={{ width: 600, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}>
            <Typography style={{textAlign: 'center', fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 600, marginBottom: 15}}>Eben CRM</Typography>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
            <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
            >
            <Input />
            </Form.Item>

            <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            >
            <Input.Password />
            </Form.Item>

            <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
                Login
            </Button>
            <Button style={{marginLeft: 15}} onClick={() => fnNavRegister()}>
                Create account
            </Button>
            </Form.Item>
            </Form>
        </Card>
        </Row> */}

        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ maxWidth: "420px", width: "100%", borderRadius: "1.5rem" }}>
            <h3 className="text-center mb-3 fw-bold">Welcome Back</h3>
            <p className="text-center text-muted mb-4">Login to continue to your dashboard</p>


            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
            >
                <div className="mb-3">
                    <label className="form-label fw-semibold">Email address</label>
                    <Form.Item layout="vertical" name="username" rules={[{ required: true, message: 'Please input your username!' }]} >
                        <input className="form-control p-3" />
                    </Form.Item>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">Password</label>
                    <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                        <input type="password" className="form-control p-3"/>
                    </Form.Item>
                </div>

                <button type="submit" className="btn btn-primary w-100 p-3 fw-semibold">Login</button>
            </Form>

            <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>


            <div className="text-center mt-4">
                <p className="mb-0">Don't have an account? <a onClick={() => fnNavRegister()} className="fw-semibold" style={{}}> Sign up</a></p>
            </div>
            </div>
        </div>
    </Context.Provider>
    )
};


export default Login;