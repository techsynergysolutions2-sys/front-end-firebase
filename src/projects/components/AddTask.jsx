import React,{useState, useEffect,useMemo} from 'react'
import {Button,Col, Row,Input,Select,Form,Modal,notification } from 'antd';
import {task_priority,fnGetDirectData,fnCreateData} from '../../shared/shared'

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

function AddTask({fnAddTask,fnShowNewTask,projectId,showhide}) {

    const [employees, SetEmployees] = useState([])
    const [api, contextHolder] = notification.useNotification();
    var companyid = sessionStorage.getItem('companyid')

    useEffect(() =>{
        getData()

    },[])

    const getData = async () => {

        let sql1 = `
                SELECT e.* FROM employees e 
                WHERE e.companyid = ${companyid} AND e.isactive = 1
                `
        try {
            const data = await fnGetDirectData('employees',sql1);
            SetEmployees(data)
        } catch (error) {
        
        }
    }

    const onFinishTask = async (values) => {

        var companyid = sessionStorage.getItem('companyid')

        values['companyid'] = companyid
        values['createdby'] = sessionStorage.getItem('uid')
        values['status'] = 1
        values['project'] = projectId
        values['description'] = ''
        values['isactive'] = 1
        values['duedate'] = values['duedate']
        values['frm'] = 'project'

        try {
            const data = await fnCreateData('tasks',"tasks", values, 'new');
            if(data.insertId != null || data.insertId != undefined){
                values['id'] = data.insertId
                values['photourl'] = data.userinfor[0]['photourl']
                values['fullname'] = data.userinfor[0]['full_name']
                fnAddTask(values)
                fnShowNewTask(false)
                // setTasks(ts => [...ts, values])
                // setCheckListModal(!checkListModal) 
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
        } catch (error) {
            
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
    <Modal title="Task" open={showhide} width={500} onCancel={() => fnShowNewTask(false)}
        footer={
            <Button onClick={() => fnShowNewTask(false)}>
            Cancel
            </Button>
        }
        >
        <Context.Provider value={contextValue}>
        {contextHolder}
            <Row>
                <Col span={24}>
                <Form name="addtask" onFinish={onFinishTask} onFinishFailed={onFinishFailed} autoComplete="off" >
                                    
                    <Row>
                        <Col span={24}>
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
                        <Col span={24}>
                            <div className="form-group">
                            <label>Assign to</label>
                            <Form.Item name="assignto" 
                            rules={[
                                {
                                required: true,
                                message: 'Please assign a task to a user!',
                                },
                            ]}>
                            <Select
                            allowClear={true} placeholder="Please select a user" size='large'
                                options={employees?.map(itm => ({
                                    value: itm.id,
                                    label: `${itm.firstname} ${itm.lastname}`
                                }))}
                            />
                            </Form.Item>
                            </div>
                        </Col>
                    </Row>

                    <Row>            
                        <Col span={24}>
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
                                    options={task_priority.map(itm => ({
                                        value: itm.value,
                                        label: itm.label
                                    }))}
                                />
                            </Form.Item>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
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

                    <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" style={{}}>
                        Save
                    </Button>
                    </Form.Item>
                </Form>
                </Col>
            </Row>
        </Context.Provider>
    </Modal>
  )
}

export default AddTask