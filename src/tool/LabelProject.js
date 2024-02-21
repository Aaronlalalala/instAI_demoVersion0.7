import React, { useState, useEffect } from "react";
import "./LabelProject.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

import InstAI_icon from '../image/instai_icon.png'

function LabelProject() {
  const location = useLocation();
  const userid = location.state;
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);

  const g_r = process.env.GET_PROJECT; // 後續需要做更改api
  const d_p = process.env.DELETE_PROJECT; //後續需要做更改api

  console.log(searchParams)
  console.log(id)
  console.log(type)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${g_r}/?username=${type ? id : userid}`);
        setProjectList(response.data);
      } catch (error) {
        console.error(error);
        console.error("文件讀取失敗");
      }
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
      const response = await axios.post(
        `${d_p}?username=${type ? id : userid}`,
        { projectName: deletedProject.trim() }
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

  const handleLogout = () => {
    //setShowLogoutPrompt(true);
    const confirmlogout = window.confirm("確定要登出嗎？");
    if (!confirmlogout) {
      return;
    }
    navigate("/"); // Redirect to the home page
  };
  const handleNavigate = () =>{
    const confirmBack = window.confirm("確定回去嗎?")
    if(!confirmBack){
        return;
    }
    navigate(`/Project`); //後續要做url設定
  }

  const handleConfirmLogout = () => {
    setShowLogoutPrompt(false);
    navigate("/"); // Redirect to the home page
  };

  const handleCancelLogout = () => {
    setShowLogoutPrompt(false);
  };

  const filteredProjects = projectList.filter(project =>
    project.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="mt-3" style={{fontWeight:'bold'}}>Label-Projects</h1>
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
       <NavLink to={`/LabelCreate`}>
          <button className="btn add-project-button">新增專案</button>
       </NavLink>

      <div className="mt-2">
         <button className='btn add-project-button2' onClick={handleNavigate}>返回</button>
      </div>
    </div>
    </div>


    <div className="row ml-3" style={{marginLeft:3}}>
      {filteredProjects.map((project, index) => (

    
          <div className="col-lg-2 col-md-3 mb-4 mt-3 project" key={index}>

            <div className="project-list-grid">

              <h2 className="project-Name">{project.projectName}</h2>
          
              <NavLink className=" projectNavLink" to={`/LabelPage?id=${type ? id : userid}&${project.projectName}`}>
                <p className="project-Detial" >{project.projectDescription}</p>
                </NavLink>
  
              <div className="project-Delete">
                <button className="btn deleteButton" onClick={() => handleDeleteProject(index)}>刪除專案</button>
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

export default LabelProject;