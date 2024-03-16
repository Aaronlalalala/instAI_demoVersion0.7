import React, { useState, useEffect } from "react";
import "./Project.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

import InstAI_icon from '../../image/instai_icon.png'

function Project() {
  const location = useLocation();
  const userid = location.state;
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
  const token = localStorage.getItem("jwtToken");
  const g_r = process.env.REACT_APP_GET_PROJECT;
  const d_p = process.env.REACT_APP_DELETE_PROJECT;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
          const token = localStorage.getItem("jwtToken");
          const response = await axios.get(`${g_r}/?username=${type ? id : userid}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          console.log(response.data);
          const combinedProjects = response.data.projectname.map((projectname, index) => ({
            name: projectname,
            desc: response.data.desc[index]
          }));
          setProjectList(combinedProjects);
        } catch (error) {
          console.error('獲取數據時出錯', error);
        }
      // try {
      //   const response = await axios.get(`${g_r}/?username=${type ? id : userid}`);
      //   setProjectList(response.data);
      //   console.log(response.data);
      // } catch (error) {
      //   console.error(error);
       
      // }
    };
    fetchData();
  }, []);
  
  const handleDeleteProject = async (index) => {
    const confirmDelete = window.confirm("確定要刪除專案?");
    if (!confirmDelete) {
      return;
    }

    const updatedProjects = [...projectList];
    const deletedProject = updatedProjects.splice(index, 1)[0];
    setProjectList(updatedProjects);

    try {
      //console.log(deletedProject.name);
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        `${d_p}/?username=${type ? id : userid}`,
        { 
          projectName: deletedProject.name,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      //後續改用redux-persist做state dispatch
      localStorage.setItem(`firstPage_${type ? id : userid}_${deletedProject}`, 'false');
      localStorage.setItem(`secondPage_${type ? id : userid}_${deletedProject}`, 'false');
      localStorage.setItem(`confirmStatusImg_${type ? id : userid}_${deletedProject}`, 'false');
      localStorage.setItem(`confirmStatusReq_${type ? id : userid}_${deletedProject}`, 'false');
      // 
      alert(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  const handleNavigate = (projectName) => {
    navigate(`/Step?id=${type ? id : userid}&project=${projectName}`);
  }
  const handleLogout = () => {
    //setShowLogoutPrompt(true);
    const confirmlogout = window.confirm("確定要登出嗎？");
    if (!confirmlogout) {
      return;
    }
    localStorage.setItem('jwtToken',false);
    //alert('註銷token');
    const token = localStorage.getItem('jwtToken');
    console.log(token);
    navigate("/"); // Redirect to the home page
  };

  const handleConfirmLogout = () => {
    setShowLogoutPrompt(false);
    navigate("/"); // Redirect to the home page
  };

  const handleCancelLogout = () => {
    setShowLogoutPrompt(false);
  };

  // const filteredProjects = projectList.filter(project =>
  //   project.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const filteredProjects = projectList.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (

  
    <div className="container-fluid mt-3">

    <div className="row d-flex justify-content-between " >
      <div className="col-auto"> 
        <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
      </div>
      <div className="col-auto mt-4"> 
        <button  className="btn  logoutButton" onClick={handleLogout}>登出</button>
      </div>
      <div className="custom-border">

      </div>
    </div>

    <div className="row">
      <div className="col-12">
        <h1 className="mt-3" style={{fontWeight:'bold'}}>Projects</h1>
      </div>
    </div>

    <div className="row d-flex justify-content-between">
      <div className="col-auto">
       <input 
        className="form-control "
        type="text"
        placeholder="搜尋專案"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

    <div className="col-auto">
       <NavLink to={`/CreatePage?id=${type ? id : userid}`}>
          <button className="btn add-project-button">新增專案</button>
       </NavLink>

      <div className="mt-2"> {/* 調整 mt-2 或其他樣式以達到合適的間距 */}
         {/* <button className='btn add-project-button2' onClick={handleLabelNavigate}>標註資料</button> */}
      </div>
    </div>
    </div>


    <div className="row ml-3" style={{ marginLeft: 3 }}>
      {filteredProjects.map((project, index) => ( // 修改這裡的參數名稱為 project

        <div className="col-lg-2 col-md-3 mb-4 mt-3 project" key={index}>

          <div className="project-list-grid">

            <h2 className="project-Name">{project.name}</h2> {/* 使用 project.name 來顯示專案名稱 */}
            {/* <h2 className="project-Name">{localStorage.getItem(`projectName`)}</h2> */}
        
            {/* <div className=" projectNavLink" >
              {filteredProjects.map((projectDescription,index)=>(
                <p className="project-Detial" key={index}>{projectDescription}</p>
              ))}
              </div> */}
                <div className="projectNavLink">
                <p className="project-Detial">{project.desc}</p> {/* 使用 project.desc 來顯示專案描述 */}
                </div>

            <div className="project-Delete">
              <button className="btn deleteButton" onClick={() => handleDeleteProject(index)}>刪除專案</button>
            </div>
            <div className="project-Nav" style={{ marginLeft: '110px' }}>
              <button className="btn deleteButton" onClick={() => handleNavigate(project.name)}> {/* 傳遞專案名稱給 handleNavigate 函式 */}
                進入專案
              </button>
            </div> 
          </div>
          
        </div>

      ))}
    </div>


   
    {/* Logout Prompt */}
    {showLogoutPrompt && (
      <div className="logout-prompt">
        <p>確定要登出嗎？</p>
        <button onClick={handleConfirmLogout}>確定</button>
        <button onClick={handleCancelLogout}>取消</button>
      </div>
    )}
  </div>
  );
}

export default Project;