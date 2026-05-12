import {Task_Workflow_Status} from '../../shared/shared'
import {useNavigate } from 'react-router-dom'

export default function TaskCard({ task }) {

  const status = Task_Workflow_Status.find(t => t.id === task.status);

  const navigate = useNavigate()
  const fnNavTask = () => {
    navigate("/taskdetail",{
      state: task
    })
  }

  return (
    <div className="card" onClick={() => fnNavTask()}>
      <h3>{task.title}</h3>
      <div className="task_meta">Project: {task.project_title}</div>
      <div className="task_meta">Due: {task.duedate?.replace('T', ' ')}</div>
      <div className="task_meta">Created by: {task.created_by}</div>

      <span
        className={`status ${
          task.status === "completed" ? "completed" : "pending"
        }` }
        style={{background:status?.color }}
      >
        {status?.title}
      </span>
    </div>
  );
}