import React, { useState, useEffect,useMemo } from "react";
import {useLocation } from 'react-router-dom'
import {Project_Workflow_Status,project_priority,Task_Workflow_Status,fnHasPermission, fnUpateData, fnCreateData,fnConvertUtcToLocal} from '../shared/shared'
import {Tooltip,FloatButton,Avatar,notification} from 'antd';
import {UsergroupAddOutlined, FileAddOutlined,MoreOutlined  } from '@ant-design/icons';
import "./css/projectDetail.css";
import NewProject from "./NewProject";
import AddTask from "./components/AddTask";
import Team from "./components/Team";
import Files from "./components/Files";

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

const pageid = 6

export default function ProjectDetail() {

  const location = useLocation();
  const [api, contextHolder] = notification.useNotification();
  const [project, setProject] = useState(location.state)
  const [tasks, setTasks] = useState(project.tasks)
  const [invites, setInvites] = useState(project.invites)
  const [newRecord, setNewRecord] = useState(false)
  const [newTask, setNewTask] = useState(false)
  const [team, setTeam] = useState(false)
  const [files, setFiles] = useState(false)
  const [perc, setPerc] = useState(0)

  const status = Project_Workflow_Status.find(t => t.id === project.status);
  const priority = project_priority.find(t => t.value === project.priority);

  useEffect(() =>{
    if(project.tasks.length > 0){
      let temp = project.tasks.filter((itm) => itm.status == 5)
      let calc = (temp.length / project.tasks.length) * 100
      setPerc(parseInt(calc))
    }else{
      setPerc(0)
    }
  },[])

  const fnOpenAttachmentModal = () =>{
    setFiles(!files)
  }

  const fnShowProjectInfor = (val) =>{
    setNewRecord(val)
  }

  const fnShowNewTask = (val) =>{
    setNewTask(val)
  }

  const fnShowTeam = (val) => {
    setTeam(val)
  }

  const fnAddTask = (e) =>{
    setTasks(ts => [...ts, e])
  }

  const fnTeam = (e) => {
    setInvites(e)
  }

  const fnShowFiles = (val) => {
    setFiles(val)
  }

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}

      <NewProject pageid={pageid} showhide={newRecord} fnShowProjectInfor={fnShowProjectInfor} projectinfor={project}/>
      <AddTask fnAddTask={fnAddTask} fnShowNewTask={fnShowNewTask} projectId={project.id} showhide={newTask}/>
      <Team projectId={project.id}  title={project.title} showhide={team} fnShowTeam={fnShowTeam} fnTeam={fnTeam} invites={invites} />
      <Files projectId={project.id} showhide={files} fnShowFiles={fnShowFiles} project={project}/>

      <div className="project_details_project-layout">

        <div className="project_details_main">
          {/* Content */}
          <div className="project_details_content">
            <div className="project_details_header">
              <h1>{project.title}</h1>
              <div className="project_details_meta">
                Client: {project.clientname} • Created {fnConvertUtcToLocal(project.createddate)?.replace('T', ' ')} • Due {project.duration?.replace('T', ' ')} 
                {
                  fnHasPermission(6,3)? (
                    <span style={{float: 'right', cursor: 'pointer'}} onClick={() => fnShowProjectInfor(true)}>Edit</span> 
                  ):(null)
                }
                
              </div>
            </div>

            {/* Description */}
            <div className="project_details_card">
              <h3>Description</h3>
              <p>
                {project.notes}
              </p>
            </div>

            {/* Tasks */}
            <div className="project_details_card">
              <h3>Project Tasks <span style={{float: 'right', cursor: 'pointer', color: '#6d6d6d', fontSize: 14}} onClick={() => setNewTask(true)}>Add task</span></h3>

              <div className="project_details_task-list">
                {tasks.map((task, index) => (
                  <ProjectTaskItem key={index} task={task} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="project_details_panel">
            <div className="project_details_panel-section">
              <div className="project_details_panel-title">Details</div>

              <MetaRow label="Status" value={status.title} />
              <MetaRow label="Priority" value={priority.label} />
              <MetaRow label="Manager" value={project.project_leader} />
              <MetaRow label="Team Size" value={project?.invites.length} />
              <MetaRow label="Budget" value={project.budget} />
            </div>

            {/* Progress */}
            <div className="project_details_panel-section">
              <div className="project_details_panel-title">Progress</div>

              <div className="project_details_progress-bar">
                <div className="project_details_progress-fill" style={{ width: `${perc}%` }} />
              </div>

              <div className="project_details_progress-label">{perc}% Completed</div>
            </div>

            {/* Activity */}
            <div className="project_details_panel-section">
              <div className="project_details_panel-title">Team</div>

              {invites.map((item, index) => (
                <Activity key={index}
                  user={`${item.firstname} ${item.lastname}`}
                  action="updated project status to"
                  value="In Progress"
                  time={item.email}
                  url={item.photourl}
                />
              ))}

            </div>

          </div>
        </div>

        {
          (project.createdby == sessionStorage.getItem('uid') || (sessionStorage.getItem('groupid') == 1)? (
            <FloatButton.Group trigger="click" type="primary" style={{ insetInlineEnd: 24 }} icon={<MoreOutlined />}>
              <FloatButton onClick={() => setTeam(true)} shape="circle" type="default" style={{ insetInlineEnd: 24 }} icon={<Tooltip placement="left" title={'Add team'}><UsergroupAddOutlined /></Tooltip>} />
              <FloatButton onClick={() => fnOpenAttachmentModal()} shape="circle" type="default" style={{ insetInlineEnd: 24 }} icon={<Tooltip placement="left" title={'Files'}><FileAddOutlined /></Tooltip>} />
            </FloatButton.Group>
          ):(null) )
        }
        

      </div>
    </Context.Provider>
  );
}

/* Small reusable components */

function MetaRow({ label, value }) {
  return (
    <div className="project_details_meta-row">
      <div className="project_details_meta-label">{label}</div>
      <div className="project_details_meta-value">{value}</div>
    </div>
  );
}

function Activity({ user, action, value, time,url }) {
  return (
    <div className="project_details_activity">
      <div className="project_details_avatar"><Avatar size="medium" src={url} /></div>
      <div>
        <div className="project_details_activity-content">
          <strong>{user}</strong> 
        </div>
        <div className="project_details_activity-time">{time}</div>
      </div>
    </div>
  );
}

function ProjectTaskItem({ task }) {

  const status = Task_Workflow_Status.find(t => t.id === task.status);

  return (
    <div className="project_details_task-item">
      <span className="project_details_task-name"><Avatar size="small" src={task.photourl} style={{marginRight: 6}} />{task.fullname}</span>
      <span className="project_details_task-name">{task.title}</span>
      <span className={`project_details_task-status`} style={{background: `${status.color}`}}>
        {status.title}
      </span>
    </div>
  );
}