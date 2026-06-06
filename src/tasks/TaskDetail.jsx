import React, { useState,useEffect,useMemo } from "react";
import { useNavigate,useLocation } from 'react-router-dom'
import {task_priority,Task_Workflow_Status,fnGetDirectData,fnCreateData, fnHasPermission, fnConvertUtcToLocal} from '../shared/shared'
import "./css/taskDetail.css";
import {notification } from 'antd';
import NewTask from "./NewTask";

const pageid = 5

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

export default function TaskDetail() {

  const location = useLocation();
  const navigate = useNavigate();
  const [task, setTask] = useState(location.state)
  const [comment, setComment] = useState("");
  const [audit, setAudit] = useState([])
  const [notes, setNotes] = useState(task.notes)
  const [api, contextHolder] = notification.useNotification();
  const [newRecord, setNewRecord] = useState(false)

  const status = Task_Workflow_Status.find(t => t.id === task.status);
  const priority = task_priority.find(t => t.value === task.priority);

  // console.log(task)

  useEffect(() => {
    fnGetAudit()
  },[])

  const handlePost = async () => {
    if (!comment.trim()) return;

    try {
      let values = {
        taskid: task.id,
        notes: comment.trim(),
        createdby: sessionStorage.getItem('uid')
      }
      const data = await fnCreateData('tasknotes',"task_notes", values, 'new');
      if(data.insertId != null || data.insertId != undefined){
        values['createddate'] = new Date().toISOString().slice(0, 16)
        setNotes(ts => [values, ...ts])
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
    setComment("");
  };


  const fnGetAudit = async () =>{
        try {
            const sql = `
                SELECT a.id,a.description,a.createddate,
                    CONCAT(e.firstname, ' ', e.lastname) AS fullname
                    FROM audit_trail a
                    JOIN employees e
                    ON e.id = a.createdby
                    WHERE a.pageid = ${pageid}  AND a.recordid = ${task.id}
                `
            if(task.id != undefined || task.id == ''){
                const data = await fnGetDirectData('audit',sql);
                setAudit(data)
                console.log(data)
            }
            
        } catch (error) {
            setAudit([])
        }
  }

  const fnShowAudit = (val) =>{
    setNewRecord(val)
  }

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Context.Provider value={contextValue}>
    {contextHolder}

    <NewTask pageid={pageid} showhide={newRecord} fnShowAudit={fnShowAudit} taskinfor={task}/>

    <div className="task_details_task-layout">

      <div className="task_details_main">
        {/* Content */}
        <div className="task_details_content">
          <div className="task_details_header">
            <h1>{task.tasttitle}</h1>
            <div className="task_details_meta">
              {task.title} • Due {task.duedate?.replace('T', ' ')} • {priority?.label} Priority • 
              {
                fnHasPermission(5,3)? (
                  <span style={{float: 'right', cursor: 'pointer'}} onClick={() => fnShowAudit(true)}>Edit</span>
                ):(null)
              } 
            </div>
          </div>

          <div className="task_details_card">
            <h3>Description</h3>
            <div className="task_details_description">
              {task.description}
            </div>
          </div>
          <h3>Comments</h3>
          {notes?.map((item, index) => (
              // <NoteCard item={item} index={index} key={index}/>
              <div className="task_details_card" key={index}>
                <div className="task_details_description">
                  {item.notes}
                </div>
                <p style={{fontSize: 12, paddingTop: 10, textAlign: 'right'}}>{item.createddate?.replace('T', ' ')}</p>
                
              </div>
            ))}

        </div>

        {/* Right Panel */}
        <div className="task_details_panel">
          {/* Details */}
          <div className="task_details_panel-section">
            <div className="task_details_panel-title">Details</div>

            <MetaRow label="Status" value={status?.title} />
            <MetaRow label="Priority" value={priority?.label} />
            <MetaRow label="Assigned" value={task.assign_to} />
            <MetaRow label="Created" value={fnConvertUtcToLocal(task.createddate)?.replace('T', ' ')} />
          </div>

          {/* Activity */}
          <div className="task_details_panel-section" style={{maxHeight: 360, overflowY: 'scroll', scrollbarWidth: 'none' }}>
            <div className="task_details_panel-title">Activity</div>

            {audit?.map((item, index) => (
              <Activity key={index}
                user={item.fullname}
                action={item.description}
                time={fnConvertUtcToLocal(item.createddate)?.replace('T', ' ')}
              />
            ))}

          </div>

          {/* Comment */}
          <div className="task_details_panel-section">
            <div className="task_details_panel-title">Add Comment</div>

            <div className="task_details_comment-box">
              <textarea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button onClick={handlePost}>Post Comment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Context.Provider>
  );
}

/* Small reusable components */

function MetaRow({ label, value }) {
  return (
    <div className="task_details_meta-row">
      <div className="task_details_meta-label">{label}</div>
      <div className="task_details_meta-value">{value}</div>
    </div>
  );
}

function Activity({ user, action, time }) {
  return (
    <div className="task_details_activity">
      <div className="task_details_avatar" />
      <div>
        <div className="task_details_activity-content">
          <strong>{user}</strong> {action}{" "}
        </div>
        <div className="task_details_activity-time">{time}</div>
      </div>
    </div>
  );
}