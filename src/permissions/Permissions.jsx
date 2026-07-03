import React, { useState, useEffect, useMemo } from "react";
import './permissions.css'; 
import { Card, Checkbox,Select,notification } from 'antd';
import { perms, permissionsStructure } from "../shared/constants";
import { fnCreateData, fnGetDirectData, fnGetData, fnUpateData,fnHasPermission } from "../shared/shared";
import { useLocation,useNavigate } from "react-router-dom";

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'


export default function PermissionsPage() {

  const location = useLocation();
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  
  const [permissions, setPermissions] = useState(perms);
  const [perm_structure, setPerm_Structure] = useState(permissionsStructure);
  const [active, setActive] = useState(true);
  const [groups, setGroups] = useState([])
  const [departments, setDepartments] = useState([])
  const [group, setGroup] = useState(null)
  const [department, setDepartment] = useState(null)

  const [perm, setPerm] =  useState(location.state)

  useEffect(() => {
      fnGetDataLoad()
      if(JSON.stringify(perm) != "{}" ){
        fnGetPermissions(perm.id)
        setGroup(perm.groupid)
        setDepartment(perm.department)
      }
  },[])
  
  const fnGetDataLoad = async () => {

    var companyid = sessionStorage.getItem('companyid')
    try {
      const data = await fnGetData('departments',"departments", {companyid: companyid,isactive: 1}, { columns: '*'});

      let sql = `
                SELECT * from user_groups ug
                WHERE ug.companyid = ${companyid} OR ug.companyid = 0 AND ug.isactive = 1
                `
      const data2 = await fnGetDirectData('groups',sql);
      setDepartments(data);
      setGroups(data2)
    } catch (error) {
      
    }
    
    if(JSON.stringify(perm) != "{}" ){
      // const data3 = await fnGetData('skills',"skills", {empid: employee['id'],isactive: 1}, { columns: '*'});
      // setSkills(data3)
    }
      
  }

  const fnGetPermissions = async (ref) => {
    
      let sql = `
                select * from permissions p where p.ref = ${ref};
                `
          
      try {
        const data = await fnGetDirectData('permissions',sql);
        setPermissions(data);
      } catch (error) {
        
      }
  }

  const togglePermission = (pageid, action) => {
    fnAddRemovePermission(pageid,action)
  };

  const fnAddRemovePermission = (pageid, actionid) => {
  const tempArr = [...permissions];

  for (let i = 0; i < tempArr.length; i++) {
    if (tempArr[i].pageid === pageid) {

      if (tempArr[i].actions.includes(actionid)) {
        let idx = tempArr[i].actions.indexOf(actionid);

        tempArr[i] = {
          ...tempArr[i],
          actions: removeCharAtIndex(tempArr[i].actions, idx)
        };

      } else {

        tempArr[i] = {
          ...tempArr[i],
          actions:
            tempArr[i].actions.length > 0
              ? `${tempArr[i].actions},${actionid}`
              : `${actionid}`
        };
      }

      break;
    }
  }

  setPermissions(tempArr);
};

  function removeCharAtIndex(str, index) {
    // 1. If the index is at the start (0)
    if (index === 0) {
      // Remove the char at index 0 and the comma after it (index 1)
      return str.slice(2);
    } 
    
    // 2. If the index is greater than 0
    if (index > 0) {
      // Keep everything before the comma (0 to index-1)
      // + everything after the char (index + 1 to end)
      const beforeComma = str.slice(0, index - 1);
      const afterChar = str.slice(index + 1);
      
      return beforeComma + afterChar;
    }

    return str;
  } 

  const renderRow = (item) => {
    
    const temp_perm = permissions.find(t => t.pageid === item.id);
    let arr = temp_perm?.actions.split(',').map(Number);
    
    return(
    <div key={item.name} className="perm-row">
      <div className="perm-title">{item.name}</div>

      <div className="perm-actions">
        
        <Checkbox.Group value={arr}>
          {
            item.actions.map((action) => (
              <Checkbox key={action.id} value={action.id} onChange={() => togglePermission(item.id, action.id)}>
                <Card style={{ width: 140 }} className='permissions_card'>
                  {action.name}
                </Card>
              </Checkbox>
                
            ))
          }
        </Checkbox.Group>
      </div>
    </div>
  )}

  const fnSubmitPerm = async () => {

    if (group == null){
      api.warning({
          title: ``,
          description: 'Please select a group',
          placement,duration: 2,
          style: {
              background: "#e2e2e2ff"
          },
      });
      return
    }

    if (department == null){
      api.warning({
          title: ``,
          description: 'Please select a department',
          placement,duration: 2,
          style: {
              background: "#e2e2e2ff"
          },
      });
      return
    }

    var companyid = sessionStorage.getItem('companyid')
    let isactive

    if(active == true){
      isactive = 1
    }else{
      isactive = 0
    }
    
    let obj = {
      department: department,
      groupid: group,
      isactive: isactive,
      companyid: companyid
    }
    
    if(JSON.stringify(perm) === "{}" ){
      try {
        const data = await fnCreateData('grouppermission',"group_permissions", obj, 'new');
        if(data.insertId != null || data.insertId != undefined){
          fnCreateUpdatePermissions(data.insertId)
        }else{
          api.error({
              title: ``,
              description: 'Something went wrong. Please try again',
              placement,duration: 2,
              style: {
                  background: "#e2e2e2ff"
              },
          });
        }
      } catch (error) {
        api.error({
            title: ``,
            description: 'Something went wrong. Please try again',
            placement,duration: 2,
            style: {
                background: "#e2e2e2ff"
            },
        });
      }
    }else{

      const data = await fnUpateData('grouppermission',"group_permissions", obj,'id = ? ',[perm['id']], 'update');
      if(data?.affectedRows > 0){
        fnCreateUpdatePermissions(data.affectedRows)
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
    }

    
  }

  const fnCreateUpdatePermissions =  async(recid) => {
    if(JSON.stringify(perm) === "{}" ){
      
    
      try {

        permissions.forEach((i) => (
          i.ref = recid
        ))
        const data = await fnCreateData('permissions',"permissions", permissions, 'new');
        if(data.insertId != null || data.insertId != undefined){
            api.success({
              title: ``,
              description: 'Permission created successfully.',
              placement,duration: 2,
              style: {
                  background: "#e2e2e2ff"
              },
          });
          
          }else{
            api.error({
                title: ``,
                description: 'Something went wrong. Please try again',
                placement,duration: 2,
                style: {
                    background: "#e2e2e2ff"
                },
            });
          }
      } catch (error) {
        api.error({
            title: ``,
            description: 'Something went wrong. Please try again',
            placement,duration: 2,
            style: {
                background: "#e2e2e2ff"
            },
        });
      }
    }else{

      const data = await fnUpateData('permissions',"permissions", permissions,'ref = ? ',[recid], 'update');
      if(data?.affectedRows > 0){
        api.success({
            title: ``,
            description: 'Permissions updated successfully.',
            placement,duration: 2,
            style: {
                background: "#e2e2e2ff"
            },
        });
        fnCreateUpdatePermissions(data.affectedRows)
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

    }
    
  }

  const fnGoBack = () => {
    navigate('/crm/permissionslist')
  }

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Context.Provider value={contextValue}>
        {contextHolder}
    <div className="perm_container">

      <h2>Permissions</h2>

      {/* Top Filters */}
      <div className="perm_top-bar">

        <Select
        allowClear={true} placeholder="Please select a group" size='large' onChange={(value) => setGroup(value)} value={group}
        options={groups?.map(itm => ({
            value: itm.id,
            label: itm.title
        }))}
        />

        <Select
        allowClear={true} placeholder="Please select a department" size='large' onChange={(value) => setDepartment(value)} value={department}
        options={departments?.map(itm => ({
            value: itm.id,
            label: itm.title
        }))}
        />
      </div>

      {/* Sections */}
      {perm_structure.map(section => (
        <div key={section.title} className="perm_section">
          <h3>{section.title}</h3>
          {section.items.map(renderRow)}
        </div>
      ))}

      {/* Active */}
      <div className="perm_active-row">
        <span>Active</span>
        <label>
          <input
            type="radio"
            checked={!active}
            onChange={() => setActive(false)}
          />
          No
        </label>
        <label>
          <input
            type="radio"
            checked={active}
            onChange={() => setActive(true)}
          />
          Yes
        </label>
      </div>

      <div className="form-actions">
        {
          JSON.stringify(perm) === "{}"? (
            <button className="perm_save-btn" onClick={() => fnSubmitPerm()} >Save All</button>
          ):(
            <button className="perm_save-btn" onClick={() => fnSubmitPerm()} disabled={!fnHasPermission(13,3)} >Save All</button>
          )
        }

        <button type="button" className="perm_cancel-btn" onClick={() => fnGoBack()}>
            Cancel
        </button>
      </div>

    </div>
    </Context.Provider>
  );
}
