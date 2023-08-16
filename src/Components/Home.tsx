import React, { FC, useState,useEffect,useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";
import "./home.css";

import { Link } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography } from '@mui/material';
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
let moment = require('moment');


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}


const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'course_name', headerName: 'Course Name' }
]

const usersColumns = [
  { field: 'id', headerName: 'SAP ID' },
  { field: 'name', headerName: 'User Name' },
  { field: 'mail_id', headerName: 'Email ID' },
  { field: 'domain', headerName: 'Domain' },
  { field: 'active', headerName: 'Active' }
]

type SomeComponentProps = RouteComponentProps;
const Home: FC<SomeComponentProps> = ({ history }) => {

 // localStorage.removeItem('items');

  const logout = () => {
  //  localStorage.clear('auth');
    localStorage.removeItem('auth');
   //localStorage.removeItem('items');
    history.push("/login");
  };
 
  
  const [open, setOpen] = React.useState(false);
  


  const [selectedCourse, setSelection] =useState([]);
  const [selectedUser, setSelectionUser] = useState([]);

  const [coursesData, setCoursesData] = useState([])
  const [usersData, setUsersData] = useState([])

  const [assignedUserList, setAssignUser] = useState([])

  

  useEffect(() => {
    fetch("https://dev-kgk804vltkl84vk.api.raw-labs.com/courses")
      .then((data) => data.json())
      .then((data) => setCoursesData(data))

  }, [])

  useEffect(() => {
    fetch("https://dev-kgk804vltkl84vk.api.raw-labs.com/engineers")
      .then((data) => data.json())
      .then((data) => {
        const filteredData = data.filter((info:any) => {
          return info.role != 'admin';
        });
        setUsersData(filteredData)
      })

  }, [])


  usersData.map((item:any) => {
    item.id = item.sap_id;
  })
  coursesData.map((item: any) => {
    item.id = item.course_id;
  });

  

  const handleCourseSelection = (ids:any) => {
    const selectedRowsData = ids.map((id:any) => coursesData.find((row:any) => row.id === id));
    setSelection(selectedRowsData);
  };


  const handleUserSelection= (ids:any,event:any) => {
    let selectedRowsData = ids.map((id:any) => usersData.find((row:any) => row.id === id));
    setSelectionUser(selectedRowsData);
   
    selectedCourse.forEach((details:any) => {
  if(userCourseList.length > 0){
   userCourseList.forEach((element:any) => {
    if(element.id === details.id){
    
      selectedRowsData = [...selectedRowsData, ...element.user_list]
    }
   });
  }
    })
    let pp = selectedRowsData.filter( (ele:any, ind:any) => ind === selectedRowsData.findIndex( (elem:any) => elem.id === ele.id ))

    selectedRowsData = pp;
    selectedCourse.map((data:any) => {
        data.user_list = selectedRowsData;
     })

     setAssignUser(selectedCourse)
  }
  
  let userCourseList = JSON.parse(localStorage.getItem("items") || "[]");

  let userRole = localStorage.getItem('role');


 const handleUserAssign = ()  =>{

 if(userCourseList.length > 0){
  assignedUserList.forEach((data:any) => {
       userCourseList.filter((test:any,index:any) =>{
        if(test.id === data.id){
                userCourseList.splice(index, 1);
        }
      })
      })
      userCourseList = [...userCourseList,...assignedUserList]
      
  }else{
     userCourseList = (assignedUserList);
  }
  
  userCourseList.filter((element:any) => {
    return element.id !== element.id
  });

  localStorage.setItem('items', JSON.stringify(userCourseList));

 setOpen(false);
 window.location.reload()
  }


  
    console.log(userCourseList, 'Local storage Data');

    const handleClickOpen = () => {
      setOpen(true);
      if(userCourseList){
       selectedCourse.forEach((list:any) => {
        const data = userCourseList.filter((selectedCourse:any) => {
             return list.id === selectedCourse.id
        });
        if(data.length > 0){
            data.forEach((element:any) => {
             element.user_list.forEach((test:any) => {
                 usersData.forEach((element:any) => {
                      if(element.id === test.id){
                        element.state = true;
                       // handleUserSelection([element.id])
                      }
                    });   
             })
            });
           
        }
      });
    } 
    };
    const handleClose = () => {
      setOpen(false);
      window.location.reload()
    };

    //Functionality for user
    let userInfo = JSON.parse(localStorage.getItem("userInfo") || "[]");
    // [coursedAssignToUser, setcoursedAssignToUser] = useState([])

    if(userInfo.role === 'user'){
     // let coursedAssign = userCourseList;
     userCourseList.forEach((element:any,index:any) => {
  let count = 0;
  element.user_list.filter((data:any) => {
      if(data.sap_id === userInfo.sap_id){
        count++
      }
  })
  
  if(count === 0){
    userCourseList.splice(index,1)
  }
 
 
});
    }
    const getDate = () => {
      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const date = today.getDate();
      return `${year}-${month}-${date}`;
    }
    const [currentDate, setCurrentDate] = useState(getDate());
  
    if(userCourseList.length > 0){
     userCourseList.forEach((element:any) => {
      let isUserPresent;
      element.user_list.forEach((data:any) => {
    
         if(data.id === userInfo.sap_id){
            isUserPresent = true;
            let dateOne = moment(data.dueDate);
            let dateTwo = moment(currentDate);
            let result = dateOne.diff(dateTwo, 'days')+' '+'days'
            if( data.status){
              element.courseStatus = data.status
            }else{
              element.courseStatus = 'Pending'
            }
           
            element.due = result
         }
      })
  });
    }

    const columnsTest = useMemo(
      () =>
        [
          {
            accessorKey: 'id',
            header: 'ID',
            size: 50,
          },
          {
            accessorKey: 'course_name',
            header: 'First Name',
          },
          {
            accessorKey: 'due',
            header: 'Due Date',
          },
          {
            accessorKey: 'courseStatus',
            header: 'Status',
          }
        ] as MRT_ColumnDef[],
      [],
    );

   const handleCourseCompleteStatus = (ids:any) => {
        userCourseList.forEach((element:any) => {
          if(element.id === ids){
            element.user_list.forEach((user:any) => {
              if(user.sap_id == userInfo.sap_id){
                user.status = 'Completed';
              }
            });
          }
        });

        toast.success('Marked Successfully', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: 0,
          toastId: "my_toast",
        });
       // alert( 'Course is marked as completed ')
        localStorage.setItem('items', JSON.stringify(userCourseList));
        window.location.reload()
   }


  return (
    <>
    
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: 50,
          paddingRight: 50,
        }}
      >
        <div>
          <h3 className="m-3">Welcome &nbsp;
           {userInfo.name} ({userInfo.role}) </h3>
        </div>
        <div>
          <button type="submit" className="butn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <div hidden={userRole != 'admin'} >
      <div>
        <div style={{marginLeft:'35%'}}>
      <Button variant="outlined" onClick={handleClickOpen}
      disabled={selectedCourse.length === 0 ? true : false}
      style={{height: '39px'}} >
       Assign User
      </Button>  &nbsp;
      <Button style={{border: '1px solid'}}>
      <Link style={{ textDecoration: "none", }} to={"/details"} >
                        Courses Assigned to User
                      </Link>
      </Button>
      </div>
      <br></br>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
       
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Engineers List
        </BootstrapDialogTitle>
        

          <DataGrid
        rows={usersData}
        columns={usersColumns}
        isRowSelectable={(params:any) => (params.row.state === undefined )}
        onRowSelectionModelChange={(ids,event) => handleUserSelection(ids,event)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
        <DialogActions>
          <Button autoFocus onClick={handleUserAssign}
          disabled={selectedUser.length === 0 ? true : false}>
            Assign course
          </Button>
        </DialogActions>
      </BootstrapDialog>


    </div>
      <div className="container">
        {/* <div
          className="row d-flex justify-content-center align-items-center text-center"
          style={{ height: "100vh" }}
        >
          <p className="muted display-6">Hello User👋</p>
        </div> */}


<DataGrid
        rows={coursesData}
        columns={columns}
        onRowSelectionModelChange={(ids) => handleCourseSelection(ids)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />

      </div>
     
                      </div>

                      <div hidden={userRole == 'admin'}>
                      <MaterialReactTable
    columns={columnsTest}
    data={userCourseList}
    enableExpanding
    renderDetailPanel={(rowData:any) => {
      return (
        <div>
           <h6
            style={{
              marginLeft: '30%',
              width: '100%',
              color:'blueviolet'
            }}
            > Course Information
             { rowData.row.original.courseStatus != 'Completed'  && <button value={rowData.row.original.id} onClick={() => handleCourseCompleteStatus(rowData.row.original.id)}
              style={{
                marginLeft: '45%',
                backgroundColor: 'blue',
                color:'white'
              }}>
              Mark as completed 
            </button> }
             </h6>
           
        {rowData.row.original.course_details.map((row:any,key:any) => {
          return <div key={key}>
           <Box
          sx={{
            display: 'grid',
            margin: 'auto',
            gridTemplateColumns: '1fr 1fr',
            width: '100%',
          }}
        >
          
          <Typography>Module Id: {row.module_id}</Typography>  
          <Typography>Module Title: {row.module_title}</Typography>
          <Typography>Description: {row.module_description}</Typography>
          <Typography>Enable: {row.module_enabled}</Typography>
        </Box>
        <hr></hr>
        <br></br>
          </div>; 
        })}
      </div>
      )
    } }
   
  />

<ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        limit={1}
        transition={Flip}
      />

  </div>
    </>
  );
};


export default Home;

