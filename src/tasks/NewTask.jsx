import React,{useState, useEffect,useMemo} from 'react'
import {Button,Col, Row,Modal,Form,Select,Input,Typography,notification,Badge } from 'antd';
import {Task_Workflow_Status,task_priority,fnGetDirectData,fnCreateData,fnUpateData, fnHasPermission } from '../shared/shared'

const { TextArea } = Input;

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

function NewTask({showhide,fnShowAudit,taskinfor,fnAddTask}) {

    const [task, setTask] = useState(taskinfor)
    const [employees, setEmployees] = useState([])
    const [projects, setProjects] = useState([])
    const [api, contextHolder] = notification.useNotification();
    var companyid = sessionStorage.getItem('companyid')
    var uid = sessionStorage.getItem('uid')

    useEffect(() => {
        fnGetDataLoad()
    },[])

    const fnGetDataLoad = async () => {

        try {
        let sql1 = `
                    SELECT e.* FROM employees e 
                    WHERE e.companyid = ${companyid} AND e.isactive = 1 AND e.id = ${uid} ORDER BY firstname, lastname ASC
                    `
        const data = await fnGetDirectData('employees',sql1);

        let sql = `SELECT * FROM projects WHERE companyid = ${companyid} AND isactive = 1 ORDER BY title ASC`
        const data2 = await fnGetDirectData('projects',sql);

        setEmployees(data)
        setProjects(data2)
        } catch (error) {
        setEmployees([])
        setProjects([])
        }
        
    }

    const onFinish = (values) => {

    var companyid = sessionStorage.getItem('companyid')
    
    values['companyid'] = companyid
    values['createdby'] = sessionStorage.getItem('uid')
    values['isactive'] = 1
    values['frm'] = 'task'

    const fnSendData = async () => {

      if(JSON.stringify(task) === "{}" ){
        if(!fnHasPermission(5,5)){
            values['assignto'] = sessionStorage.getItem('uid')
        }
        try {
          const data = await fnCreateData('tasks',"tasks", values, 'new');
          if(data.insertId != null || data.insertId != undefined){
              values['id'] = data.insertId
              fnAddTask(values)
              api.success({
                title: ``,
                description: 'Task created successfully.',
                placement,duration: 2,
                style: {
                    background: "#e2e2e2ff"
                },
            });
            fnShowAudit(false)
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
        } catch (error) {
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
        values['id'] = task['id']
        values['updateby'] = sessionStorage.getItem('uid')
        const data = await fnUpateData('tasks',"tasks", values,'id = ? AND isactive = ?',[task['id'],1], 'update');
        if(data?.affectedRows > 0){
          api.success({
              title: ``,
              description: 'Task updated successfully.',
              placement,duration: 2,
              style: {
                  background: "#e2e2e2ff"
              },
          });
          fnShowAudit(false)
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
      
    }
    fnSendData()

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
    <Modal title="New Task" open={showhide} width={1000} onCancel={() => fnShowAudit(false)} footer={<></>} style={{height: '80%', overflowY: 'scroll', borderRadius: 10}}>
        
        <Context.Provider value={contextValue}>
        {contextHolder}
            <Form name="basic" initialValues={task} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" >
                    
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
                        <Select 
                        allowClear={true} placeholder="Please select status" size='large'
                        options={Task_Workflow_Status?.map(itm => ({
                            value: itm.id,
                            label: <Badge color={itm.color} text={itm.title} />
                        }))}
                        />
                    </Form.Item>
                    </div>
                </Col>
                <Col span={4}></Col>
                <Col span={10}>
                    <div className="form-group">
                    <label>Assign to</label>
                    <Form.Item name="assignto" 
                        rules={[
                        {
                            required: fnHasPermission(5,5),
                            message: 'Please assign a task to a user!',
                        },
                        ]}>
                        <Select 
                        allowClear={true} placeholder="Please select a user" size='large' disabled={!fnHasPermission(5,5)}
                        options={employees?.map(itm => ({
                            value: itm.id,
                            label: `${itm?.firstname} ${itm?.lastname}`
                        }))}
                        />
                    </Form.Item>
                    </div>
                </Col>
                </Row>

                <Row>
                <Col span={10}>
                    <div className="form-group">
                    <label>Project</label>
                    <Form.Item
                        name="project"
                        rules={[
                        {
                            required: true,
                            message: 'Please select a project!',
                        },
                        ]}
                    >
                        <Select
                        allowClear={true} placeholder="Please select a project" size='large' 
                        options={projects?.map(itm => ({
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
                        <Select 
                        allowClear={true} placeholder="Please select a priority" size='large' 
                        options={task_priority?.map(itm => ({
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
                    <label>Due date</label>
                    <Form.Item name="duedate" 
                    rules={[
                        {
                        required: true,
                        message: 'Please select a due date!',
                        },
                    ]}>
                        <input type="datetime-local" />
                    </Form.Item>
                    </div>
                </Col>
                </Row>
                
                <Row>
                <Col span={24}>
                    <Typography style={{...Styles.text}}>Description</Typography>
                </Col>
                </Row>

                <Row>
                <Col span={24}>
                    <Form.Item label="" name="description" >
                        <TextArea rows={3}  />
                    </Form.Item>
                </Col>
                </Row>

                <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                    Save Task
                </button>
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

export default NewTask