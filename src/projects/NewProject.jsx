import React,{useState, useEffect,useMemo} from 'react'
import {Button,Col, Row,Modal,Form,Select,Input,Typography,notification } from 'antd';
import {Project_Workflow_Status,project_priority,fnGetDirectData,fnCreateData,fnUpateData,fnGetData,fnHasPermission } from '../shared/shared'

const { TextArea } = Input;

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

function NewProject({showhide,fnShowProjectInfor,projectinfor,fnAddTask,fetchClients}) {

    const [project, setProject] = useState(projectinfor)
    const [api, contextHolder] = notification.useNotification();
    const [leaders, setLeaders] = useState([])
    const [clients, setClients] = useState([])

    var companyid = sessionStorage.getItem('companyid')
    var uid = sessionStorage.getItem('uid')
    var groupid = sessionStorage.getItem('groupid')

    useEffect(() => {
        getData()
    },[])

    const getData = async () => {

        let sql1 = `
                SELECT e.* FROM employees e 
                WHERE e.companyid = ${companyid} AND e.isactive = 1
                `
        try {
            const data = await fnGetDirectData('employees',sql1);
            const data2 = await fnGetData('clients',"clients", {companyid: companyid,isactive: 1}, { columns: '*'});
            setLeaders(data)
            setClients(data2)
        } catch (error) {
        
        }

    }

    const onFinish = async (values) => {

        if(JSON.stringify(project) === "{}" ){
            values['companyid'] = sessionStorage.getItem('companyid')
            values['createdby'] = sessionStorage.getItem('uid')
            const data = await fnCreateData('projects',"projects", values, 'new');
            if(data.insertId != null || data.insertId != undefined){
                api.success({
                    title: ``,
                    description: 'Project created successfully.',
                    placement,duration: 2,
                    style: {
                        background: "#e2e2e2ff"
                    },
                });
                fnShowProjectInfor(false)
                fetchClients()
            }else{
                api.error({
                    title: ``,
                    description: 'Something went wrong. Please try again',
                    placement,duration: 2,
                    style: {
                        background: "#e2e2e2ff"
                    },
                });
            }
        }else{
            values['id'] = project['id']
            values['updateby'] = sessionStorage.getItem('uid')
            const data = await fnUpateData('projects',"projects", values,'id = ? AND isactive = ?',[project['id'],1], 'update');
            if(data?.affectedRows > 0){
                api.success({
                    title: ``,
                    description: 'Project updated successfully.',
                    placement,duration: 2,
                    style: {
                        background: "#e2e2e2ff"
                    },
                });
                fetchClients()
            }else{
                api.warning({
                    title: ``,
                    description: 'Something went wrong. Please try again',
                    placement,duration: 2,
                    style: {
                    background: "#e2e2e2ff"
                    },
                });
            }
        }

    };

  const onFinishFailed = (errorInfo) => {
    api.warning({
        title: ``,
        description: 'Please complete the required fields.',
        placement,duration: 2,
        style: {
        background: "#e2e2e2ff"
        },
    });
  };

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Modal title="Project" open={showhide} width={1000} onCancel={() => fnShowProjectInfor(false)} footer={<></>} style={{height: '80%', overflowY: 'scroll', borderRadius: 10}}>
        
        <Context.Provider value={contextValue}>
        {contextHolder}
            <Form name="basic" initialValues={project} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" >
                  
                <Row>
                    <Col span={16}>
                        <div className="form-group">
                        <label>Title</label>
                        <Form.Item name="title"
                            rules={[
                            {
                                required: true,
                                message: 'Please input title!',
                            },]} >
                            <Input />
                        </Form.Item>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col span={10}>
                        <div className="form-group">
                        <label>Created by</label>
                        <Form.Item name="createdby" >
                            <Select placeholder="" size='large' disabled 
                                options={leaders?.map(itm => ({
                                    value: itm.id,
                                    label: `${itm.firstname} ${itm.lastname}`
                                }))}
                            />
                        </Form.Item>
                        </div>
                    </Col>
                    <Col span={4}></Col>
                    <Col span={10}>
                        <div className="form-group">
                        <label>Created by</label>
                        <Form.Item name="createddate" >
                            <input type="datetime-local" disabled />
                        </Form.Item>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col span={10}>
                        <div className="form-group">
                        <label>Client</label>
                        <Form.Item
                            name="client"
                            
                        >
                            <Select allowClear={true} placeholder="Please select a client" size='large'
                                options={clients?.map(itm => ({
                                    value: itm.id,
                                    label: itm.clientname
                                }))}
                            />
                        </Form.Item>
                        </div>
                    </Col>
                    <Col span={4}></Col>
                    <Col span={10}>
                        <div className="form-group">
                        <label>Budget</label>
                        <Form.Item name="budget"
                            rules={[
                            {
                                required: true,
                                message: 'Please input a budget!',
                            },]} >
                            <Input />
                        </Form.Item>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col span={10}>
                        <div className="form-group">
                        <label>Status</label>
                        <Form.Item
                            name="status"
                            rules={[
                            {
                                required: true,
                                message: 'Please select status!',
                            },
                            ]}
                        >
                            <Select allowClear={true} placeholder="Please select status" size='large'
                                options={Project_Workflow_Status?.map(itm => ({
                                    value: itm.id,
                                    label: itm.title
                                }))}
                            />
                        </Form.Item>
                        </div>
                    </Col>
                    <Col span={4}></Col>
                    <Col span={10}>
                        <div className="form-group">
                        <label>Priority</label>
                        <Form.Item
                            name="priority"
                            rules={[
                            {
                                required: true,
                                message: 'Please select a priority!',
                            },
                            ]}
                        >
                            <Select allowClear={true} placeholder="Please select a priority" size='large'
                                options={project_priority?.map(itm => ({
                                    value: itm.value,
                                    label: itm.label
                                }))}
                            />
                        </Form.Item>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col span={10}>
                        <div className="form-group">
                        <label>Project Learder</label>
                        <Form.Item
                            name="leader"
                            rules={[
                            {
                                required: true,
                                message: 'Please select a project learder!',
                            },
                            ]}
                        >
                            <Select allowClear={true} placeholder="Please select a project learder" size='large'
                                options={leaders?.map(itm => ({
                                    value: itm.id,
                                    label: `${itm.firstname} ${itm.lastname}`
                                }))}
                            />
                        </Form.Item>
                        </div>
                    </Col>
                    <Col span={4}></Col>
                    <Col span={10}>
                        <div className="form-group">
                        <label>Due date</label>
                        <Form.Item name="duration" 
                        rules={[
                            {
                            required: true,
                            message: 'Please select a Duration!',
                            },
                        ]}>
                            <input type="datetime-local" />
                        </Form.Item>
                        </div>
                    </Col>
                </Row>
                
                <Row>
                    <Col span={24}>
                        <Typography style={{...Styles.text}}>Notes</Typography>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Form.Item label="" name="notes" >
                        <TextArea rows={6}  />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="form-actions">

                {
                JSON.stringify(project) == '{}' ? (
                    <button type="submit" className="btn btn-primary">
                        Save Project
                    </button>
                ):(
                    groupid == 1 || groupid == 2 || project?.createdby == uid ? (
                    <button type="submit" className="btn btn-primary" disabled={!fnHasPermission(6,3)}>
                        Save Project
                    </button>
                    ):(
                    null
                    )
                )
                }
                
                </div>
            </Form>
        </Context.Provider>
        
    </Modal>
  )
}

const Styles = {
  btn: {
      marginLeft: 10,
      marginTop: '-10px'
  },
  text: {
    fontFamily: "'Poppins', sans-serif",
  }
}

export default NewProject