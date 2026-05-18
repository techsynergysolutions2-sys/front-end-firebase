import React, { useState, useEffect } from "react";
import ProjectCard from "./components/ProjectCard";
import {Project_Workflow_Status,fnGetDirectData, fnHasPermission} from '../shared/shared'
import "./css/projects.css";
import NewProject from "./NewProject";

const pageid = 6

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [newRecord, setNewRecord] = useState(false)
  const [filteredProjects, setFilteredProjects] = useState([])

  useEffect(() =>{
        fetchClients();
  },[])

  const fetchClients = async () => {
     
      var companyid = sessionStorage.getItem('companyid')

      let sql = `
        SELECT 
          p.*,
          CONCAT(ec.firstname, ' ', ec.lastname) AS full_name,
          CONCAT(el.firstname, ' ', el.lastname) AS project_leader,
          c.clientname,
          pn.notes,
          COALESCE(invites.invites, JSON_ARRAY()) AS invites,
          COALESCE(tasks.tasks, JSON_ARRAY()) AS tasks
        FROM projects p
        LEFT JOIN employees ec ON p.createdby = ec.id
        LEFT JOIN employees el ON p.leader = el.id
        LEFT JOIN clients c ON p.client = c.id
        LEFT JOIN project_notes pn ON p.id = pn.id

        -- Aggregate invites separately
        LEFT JOIN (
          SELECT 
            pi.projectid,
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', pi.id,
                'firstname', e.firstname,
                'lastname', e.lastname,
                'full_name', CONCAT(e.firstname, ' ', e.lastname),
                'phone', e.phone,
                'email', e.email,
                'photourl', e.photourl,
                'uid', e.id
              )
            ) AS invites
          FROM project_invites pi
          LEFT JOIN employees e ON pi.userid = e.id
          WHERE pi.isactive = 1
          GROUP BY pi.projectid
        ) invites ON invites.projectid = p.id

        -- Aggregate tasks separately
        LEFT JOIN (
          SELECT 
            t.project,
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', t.id,
                'title', t.title,
                'status', t.status,
                'photourl', e.photourl,
                'fullname', CONCAT(e.firstname, ' ', e.lastname)
              )
            ) AS tasks
          FROM tasks t
          LEFT JOIN employees e ON t.assignto = e.id
          GROUP BY t.project
        ) tasks ON tasks.project = p.id

        WHERE p.companyid = ${companyid}
          AND p.isactive = 1
        GROUP BY p.id;

      `

      try {
        const data = await fnGetDirectData('projects',sql);
        setProjects(data);
        setFilteredProjects(data)
        console.log(data)
        // setLoading(!loading)
      } catch (error) {
        
      }
    };

  const fnFilterProjects = async (e) =>{
   
    if(e == 0){ 
      setFilteredProjects(projects)
    }else{
      let temp = projects.filter(p => p.status == e)
      setFilteredProjects(temp)
    }

  }

  const fnShowProjectInfor = (val) =>{
    setNewRecord(val)
  }

  return (
    <div className="projects-layout">

      <NewProject pageid={pageid} fetchClients={fetchClients} showhide={newRecord} fnShowProjectInfor={fnShowProjectInfor} projectinfor={{}}/>

      <div className="projects-main">
        <div className="projects-header">
          <h1>Projects</h1>

          <div className="filter">
            <label>Filter:</label>
            <select onChange={(e) => fnFilterProjects(e.target.value)}>
              <option value={0}>All</option>
              { 
                Project_Workflow_Status?.map((itm,key) => (
                  <option key={itm.id} value={itm.id}>{itm.title}</option>
                ))
              }
            </select>
          </div>
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
        
        
        {
          fnHasPermission(6,2)? (
            <button className="fab" onClick={() => fnShowProjectInfor(true)}>+</button>
          ):(null)
        }
        
      </div>
    </div>
  );
}