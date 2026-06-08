import {Task_Workflow_Status} from '../../shared/shared'

export default function Topbar({fnFilterTasksDrop}) {

  return (
    <div className="topbar">
      <h1>Tasks Overview</h1>

      <div className="top-actions">
        {/* <input className="search" placeholder="Search tasks title..." onChange={e => fnFilterTasksInput(e.target.value)} /> */}

        <select
          className="status-dropdown"
          onChange={e => fnFilterTasksDrop(e.target.value)}
          style={{ width: 200 }}
        >
          <option value={0}>All</option>
            { 
              Task_Workflow_Status?.map((itm,key) => (
                <option key={itm.id} value={itm.id}>{itm.title}</option>
              ))
            }
        </select>

        {/* <div className="avatar"></div> */}
      </div>
    </div>
  );
}