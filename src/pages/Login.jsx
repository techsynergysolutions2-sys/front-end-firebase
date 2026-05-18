import React,{useEffect,useState,useMemo} from 'react';
import { useNavigate } from "react-router-dom";
import "./css/login.css";
import {  fnGetData,fnCheckExpiryDate, fnGetDirectData } from '../shared/shared';
import { notification } from 'antd';

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

export default function Login() {

    const [api, contextHolder] = notification.useNotification();

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

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            
            const auth = await fnGetData('login',"", {email: form['email'], password: form['password']}, { columns: '*'});

            if(auth.code == 200){

                let user = auth.user
                sessionStorage.setItem('companyid',user.companyid)
                sessionStorage.setItem('department',user.department)
                sessionStorage.setItem('photourl',user.photourl)
                sessionStorage.setItem('firstname',user.firstname)
                sessionStorage.setItem('lastname',user.lastname)
                sessionStorage.setItem('email',user.email)
                sessionStorage.setItem('uid',user.id)
                sessionStorage.setItem('expirydate',user.expirydate)
                sessionStorage.setItem('grouptitle',user.title)
                sessionStorage.setItem('groupid',user.groupid)
                let groupid = user.groupid

                setLoading(false)

                if(fnCheckExpiryDate()){
                    if(groupid != 1 || groupid != 2){
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
                            navigate('/companyprofile')
                        }
                    
                }else{

                    let sql = `
                            select p.* from permissions p 
                            JOIN group_permissions gp
                            ON p.ref = gp.id
                            where gp.department = ${user.department} AND gp.groupid = ${user.groupid} 
                            AND gp.isactive = 1 AND p.actions <> '' AND p.actions IS NOT NULL 
                            `
                        
                    try {
                    const data = await fnGetDirectData('permissions',sql);
                    sessionStorage.setItem('permissions',JSON.stringify(data))
                    navigate('/tasks')
                    } catch (error) {
                    
                    }

                    // let permissions = auth.permissions
                    // if(groupid != 1){
                    //     if(permissions.length == 0){
                    //         sessionStorage.setItem('permissions','0,100')
                    //         navigate('/profile')
                    //     }else{
                    //         sessionStorage.setItem('permissions', permissions)
                    //     }
                        
                    // }else{
                    //     sessionStorage.setItem('permissions',0)
                    // }
                    
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
            api.warning({
                title: ``,
                description: 'Incorrect username or password',
                placement,duration: 6,
                style: {
                background: "#e2e2e2ff"
                },
            });
        }

    };

    const fnRegisterNavigate = () => {
        navigate('/register')
    }

    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Context.Provider value={contextValue}>
        {contextHolder}
        <div className="login-layout">
        <div className="login-card">
            <div className="login-header">
            <h2>Enterprise Suite</h2>
            <p>Sign in to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
                <label>Email Address</label>
                <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
                />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
            </button>
            </form>
            <div className="login-footer">
            <span style={{fontSize: 15, cursor: 'pointer'}} onClick={() => fnRegisterNavigate()}>Create Account</span>
            </div>
            <div className="login-footer">
            <span>© {new Date().getFullYear()} Enterprise Suite</span>
            </div>
        </div>
        </div>
    </Context.Provider>
  );
}