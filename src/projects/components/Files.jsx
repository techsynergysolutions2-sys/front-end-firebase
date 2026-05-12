import React,{useState, useEffect,useMemo} from 'react'
import {Button,Col, Row,Modal,Table,Tooltip,notification } from 'antd';
import {fnGetDirectData,fnCreateData,fnUpateData,fnFileURls} from '../../shared/shared'
import {DeleteOutlined, UploadOutlined,EyeOutlined  } from '@ant-design/icons';
import MButton from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function Files({fnShowFiles,projectId,showhide,project}) {

    const [files, setFiles] = useState([])
    const [api, contextHolder] = notification.useNotification();
    var groupid = sessionStorage.getItem('groupid')
    var uid = sessionStorage.getItem('uid')

    const columnsFiles = [
        {
        title: 'File name',
        dataIndex: 'name',
        },
        {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        render: (record) => (
            <>
            <Tooltip title="View">
                <Button type="primary" icon={<EyeOutlined />} style={{backgroundColor: '#b7b7b7ff', marginLeft: 8}} onClick={() => fnViewFile(record)}/>
            </Tooltip>
            <Tooltip title="Remove">
                {
                groupid == 1 || groupid == 2 || project?.createdby == uid ? (
                    <Button type="primary" icon={<DeleteOutlined />} style={{backgroundColor: 'red', marginLeft: 8}} onClick={() => fnDeleteFile(record)}/>
                ):(
                    <Button type="primary" disabled icon={<DeleteOutlined />} style={{backgroundColor: 'gray', marginLeft: 8}} />
                )
                }
            </Tooltip>
            </>
            
        ),
        },
    ];

    useEffect(() =>{
        fnGetAttachments()

    },[])

    const fnGetAttachments = async () => {
         
        let sql = `
                    SELECT a.uid,a.name,a.status,a.url FROM attachments a 
                    WHERE a.pageid = 6 AND a.recordid = ${projectId} AND a.isactive = 1`
        try {
            const data = await fnGetDirectData('attachments',sql);
            setFiles(data);
        } catch (error) {
        
        }
    
    };

    const fnHandleUploadFiles = (fls) => {
        if(fls.length == 0) return
        fnUploadAllPhotos(fls)
    };

    const fnUploadAllPhotos = async (fileList) => {
        try {
            let urls = await fnFileURls(fileList)
            for(let i = 0; i < urls.length; i++){

                let temp = {
                    pageid: 6,
                    recordid: projectId,
                    name: urls[i].name,
                    url: urls[i].url,
                    createdby: sessionStorage.getItem('uid'),
                }

                let data = await fnCreateData('attachments',"attachments", temp, 'new');
                if(data.insertId != null || data.insertId != undefined){
                    temp['uid'] = data.insertId
                    let temp_arr = [...files, temp ]
                    setFiles(temp_arr)
                }else{
                    api.warning({
                        title: ``,
                        description: 'Something went wrong trying to upload. Please try again.',
                        placement,duration: 2,
                        style: {
                        background: "#e2e2e2ff"
                        },
                    });
                }
                
            }
        } catch (error) {
            let placement = 'topRight'
            api.warning({
                title: ``,
                description: 'Something went wrong trying to upload. Please try again.',
                placement,duration: 2,
                style: {
                background: "#e2e2e2ff"
                },
            });
        }
        

    }

    const fnViewFile = (record) => {
        window.open(record.url, '_blank');
    }

    const fnDeleteFileByName = (name) => {
        let temp = (sks) => sks.filter(sk => sk.name !== name)
        setFiles(temp);
    };

    const fnDeleteFile = async (file) =>{
            
        let values = {
            isactive: 0
        }
        try {
            const data = await fnUpateData('attachments',"attachments", values,'uid = ?',[file['uid']], 'update');
            if(data?.affectedRows > 0){
                fnDeleteFileByName(file['name'])
            }
        
        } catch (error) {
            let placement = 'topRight'
            api.warning({
                title: ``,
                description: 'Something went wrong. Please try again.',
                placement,duration: 2,
                style: {
                background: "#e2e2e2ff"
                },
            });
        }
    }

    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Modal title="Files" open={showhide} width={800} onCancel={() => fnShowFiles(false)}
        footer={
        <Button onClick={() => fnShowFiles(false)}>
            Cancel
        </Button>
        }
    >
        <Context.Provider value={contextValue}>
        {contextHolder}
            <Row>
                <Col span={24}>
                    <MButton
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<UploadOutlined />}
                    >
                    Upload files
                    <VisuallyHiddenInput
                        type="file"
                        onChange={(event) => fnHandleUploadFiles(event.target.files)}
                        multiple
                    />
                    </MButton>
                </Col>
            </Row>
            
            <Row style={{marginTop: 40}}>
                <Col span={24}>
                    <Table
                    columns={columnsFiles}
                    dataSource={files}
                    rowKey='uid'
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

export default Files