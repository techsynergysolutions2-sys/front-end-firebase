import {Project_Workflow_Status, fnConvertUtcToLocal} from '../../shared/shared'
import {Avatar } from 'antd';
import {useNavigate } from 'react-router-dom'

export default function ProjectCard({ project }) {

  const status = Project_Workflow_Status.find(p => p.id === project.status);

  const navigate = useNavigate()
  const fnNavTask = () => {
    navigate("/projectdetail",{
      state: project
    })
  }

  return (
    <div className="project-card" onClick={() => fnNavTask()}>
      <span className={`status-badge`} style={{background: status.color}}>
        {status.title}
      </span>

      <h3>{project.title}</h3>
      <p className="description">{project.notes}</p>

      <div className="meta">
        <div><strong>Created:</strong> {fnConvertUtcToLocal(project.createddate)?.replace('T', ' ')}</div>
        <div><strong>Due:</strong> {project.duration?.replace('T', ' ')}</div>
        <div><strong>Created by:</strong> {project.full_name}</div>
        <div><strong>Client:</strong> {project.clientname}</div>
        <div><strong>Assigned to:</strong> {project.project_leader}</div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${status.perc}%` }}
        />
      </div>

      <div className="avatar">
        <Avatar.Group>
          {
            project.invites.map((itm,key) => (
              <Avatar size="medium" src={itm.photourl} />
            ))
          }
        </Avatar.Group>
      </div>
    </div>
  );
}