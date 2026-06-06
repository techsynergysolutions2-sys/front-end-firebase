import { useState, useEffect } from "react";
import { fnGetDirectData,fnHasPermission } from '../shared/shared';
import Topbar from "./components/Topbar";
import KPIGrid from "./components/KPIGrid";
import TaskCard from "./components/TaskCard";
import "./css/tasks.css";
import NewTask from "./NewTask";

const pageid = 5
export default function Tasks() {

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredTask, setFilteredTask] = useState([])

  const [newRecord, setNewRecord] = useState(false)

  useEffect(() =>{
    fetchClients();
  },[])

  const fetchClients = async () => {
      var companyid = sessionStorage.getItem('companyid')
      var uid = sessionStorage.getItem('uid')
      let sql = `
            SELECT t.*,CONCAT(e.firstname, ' ', e.lastname) AS created_by,
            p.title AS project_title,CONCAT(ea.firstname, ' ', ea.lastname) AS assign_to,
            td.description,t.title,
            COALESCE(notes.notes, JSON_ARRAY()) AS notes
            FROM tasks t 
            LEFT JOIN projects p ON t.project = p.id
            LEFT JOIN employees e ON t.createdby = e.id
            LEFT JOIN employees ea ON t.assignto = ea.id
            LEFT JOIN task_descriptions td ON t.id = td.taskid

            LEFT JOIN (
              SELECT 
                tn.id,tn.taskid,
                JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'idn', tn.id,
                    'notes', tn.notes,
                    'taskid', tn.taskid,
                    'createddate', tn.createddate
                  )
                ) AS notes
              FROM tasks tl
              LEFT JOIN task_notes tn ON tl.id = tn.taskid
              WHERE tl.isactive = 1
              GROUP BY tl.id
            ) notes ON notes.taskid = t.id

            WHERE t.companyid = ${companyid} AND t.assignto = ${uid} AND t.isactive = 1
            GROUP BY t.id
            ORDER BY t.id DESC;
            `
      
      try {
        const data = await fnGetDirectData('tasks',sql);
        setTasks(data);
        setFilteredTask(data)
        console.log(data)
        setLoading(!loading)
      } catch (error) {
      }
    };
    

  const fnFilterTasksDrop = (e) => {
    console.log(e)
    if(e == 0){
      setFilteredTask(tasks)
    }else{
      const temp = tasks?.filter(t => t.status == e);
      setFilteredTask(temp)
      console.log(temp)
    }
    
  }

  const fnShowAudit = (val) =>{
    setNewRecord(val)
  }

  const fnAddTask = (t) => {
    // setFilteredTask(prev => [t, ...prev]);
    fetchClients()
  }

  return ( 
    <div className="tasks">

      {/* New Record */}
      <NewTask pageid={pageid} showhide={newRecord} fnShowAudit={fnShowAudit} fnAddTask={fnAddTask} taskinfor={{}}/>

      <div className="tasks_main">
        <Topbar fnFilterTasksDrop={fnFilterTasksDrop}/>
        <KPIGrid tasks={tasks}/>

        {
          fnHasPermission(5,1)? (
            <div className="grid">
              {filteredTask?.map((task, index) => (
                <TaskCard key={index} task={task} />
              ))}
            </div>
          ):(<h3>You don't have permissions to view task</h3>)
        }
        
      </div>

      {
        fnHasPermission(5,2)? (
          <button className="fab" onClick={() => fnShowAudit(true)}>+</button>
        ):(null)
      }
      
    </div>
  );
}