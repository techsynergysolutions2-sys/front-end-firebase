import React,{useState, useEffect,useMemo} from 'react'
import {Button,Col, Row,Typography ,Select,Modal,Table,Tooltip,notification } from 'antd';
import {fnGetDirectData,fnCreateData,fnUpateData} from '../../shared/shared'
import {DeleteOutlined } from '@ant-design/icons';

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

function Team({fnShowTeam,projectId,title,showhide,invites,fnTeam}) {

    const [employees, SetEmployees] = useState([])
    const [invitedUsers, setInvitedUsers] = useState(invites)
    const [api, contextHolder] = notification.useNotification();
    var companyid = sessionStorage.getItem('companyid')

    const columnsInvite = [
        {
            title: 'Full name',
            dataIndex: 'full_name',
        },
        {
            title: 'Contact',
            dataIndex: 'phone',
            render: (val) => <Typography style={{...Styles.text}}>{val}</Typography>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (val) => <Typography style={{...Styles.text}}>{val}</Typography>,
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            render: (record) => (
            <Tooltip title="Remove">
                <Button type="primary" icon={<DeleteOutlined />} style={{backgroundColor: 'red', marginLeft: 8}} onClick={() => fnRemoveInvite(record)}/>
            </Tooltip>
            ),
        },
    ];

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

    const fnHandleSelectInvite = async (value) => {

        const exists = invitedUsers.some(user => user.uid === value);

        if (exists) {
            api.warning({
                title: ``,
                description: 'User already invited',
                placement,
                duration: 2,
                style: {
                    background: "#e2e2e2ff"
                },
            });
            return; // stop execution
        }

        let dt = {
            projectid: projectId ,
            userid: value,
            title: title,
            createdby: sessionStorage.getItem('uid')
        }

        try {
            const data = await fnCreateData('projectinvites',"project_invites", dt, 'new');
            if(data?.length > 0){
                const updatedUsers = [...invitedUsers, data[0]];
                setInvitedUsers(updatedUsers);
                fnTeam(updatedUsers);
            }
        } catch (error) {
            api.warning({
                title: ``,
                description: 'Something went wrong. Please try again',
                placement,duration: 2,
                style: {
                background: "#e2e2e2ff"
                },
            });
        }

    };

    const fnRemoveInvite = async (record) => {

        try {
            let temp = {
                isactive: 0
            }
            const data = await fnUpateData('projectinvites',"project_invites", temp,'id = ? AND isactive = ?',[record['id'],1], 'update');
            if(data?.affectedRows == 1){
                let temp = (prevUsers) => prevUsers.filter((user) => user.id !== record.id)
                setInvitedUsers(temp)
                fnTeam(temp)
            }
        
        } catch (error) {
        
        }
    }

    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Modal title="Team" open={showhide} width={900} onCancel={() => fnShowTeam(false)}
        footer={
            <Button onClick={() => fnShowTeam(false)}>
            Cancel
            </Button>
        }
        >
        <Context.Provider value={contextValue}>
        {contextHolder}
            <Row>
                <Col span={24}>
                    <Select
                    allowClear={false} placeholder="Please select a user" onChange={(e) => fnHandleSelectInvite(e)}
                    style={{ width: '40%'}} 
                        options={employees?.map(itm => ({
                            value: itm.id,
                            label: `${itm.firstname} ${itm.lastname}`
                        }))}
                    />
                </Col>
                </Row>
                
                <Row style={{marginTop: 40}}>
                <Col span={24}>
                    <Table
                    columns={columnsInvite}
                    dataSource={invitedUsers}
                    rowKey="id"
                    showSorterTooltip={{
                        target: 'sorter-icon',
                    }}
                    />
                </Col>
            </Row>
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

export default Team