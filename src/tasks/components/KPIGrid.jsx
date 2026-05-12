
export default function KPIGrid({tasks}) {
  console.log(tasks)
  const pending = tasks?.filter(t => t.status == 1);
  const inprogress = tasks?.filter(t => t.status == 2);
  const Completed = tasks?.filter(t => t.status == 5);

  const now = new Date();

  const overdueTasks = tasks?.filter(task => {
    const dueDate = new Date(task.duedate);

    return (
      dueDate < now &&
      task.status !== 5 &&     // exclude completed
      task.isactive === 1      // only active tasks
    );
  });

  return (
    <div className="kpi-grid">
      {/* <div className="kpi">
        <h3>Total Tasks</h3>
        <p>24</p>
      </div> */}
      <div className="kpi">
        <h3>Pending</h3>
        <p>{pending?.length}</p>
      </div>
      <div className="kpi">
        <h3>In progress</h3>
        <p>{inprogress?.length}</p>
      </div>
      <div className="kpi">
        <h3>Completed</h3>
        <p>{Completed?.length}</p>
      </div>
      <div className="kpi">
        <h3>Overdue</h3>
        <p>{overdueTasks?.length}</p>
      </div>
    </div>
  );
}