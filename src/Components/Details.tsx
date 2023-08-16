
import React, { FC, useMemo,useState,useEffect } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Box, Typography } from '@mui/material';
import { RouteComponentProps } from "react-router-dom";
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


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


type SomeComponentProps = RouteComponentProps;
const Details: FC<SomeComponentProps> = ({ history }) => {

  
  const logout = () => {
    //localStorage.clear();
    localStorage.removeItem('auth');
    history.push("/login");
  };

  const home = () => {
    history.push("/");
  };

  const [coursesData, setCoursesData] = useState([])
  const [openDatePick, setOpenDatePick] = React.useState(false);
  const [getDueDate, setDueDate] = useState()
  const [getSelectedUser, setSelectedUser] = useState()
  const [getSelectedCourse,setSelectedCourse] = useState();

  const [getuserCourseList,setuserCourseList] = useState([])

  const columns = useMemo(
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
        }
      ] as MRT_ColumnDef[],
    [],
  );


  let userCourseList = JSON.parse(localStorage.getItem("items") || "[]");
  
//  setuserCourseList(userCourseList);
  //console.log(userCourseList, 'userCourseList')

  useEffect(() => {
    fetch("https://dev-kgk804vltkl84vk.api.raw-labs.com/courses")
      .then((data) => data.json())
      .then((data) => setCoursesData(data))
      if(userCourseList.length > 0){
        setuserCourseList(userCourseList)
      }
  }, [])
  //console.log(coursesData)

  coursesData.map((item: any) => {
    item.id = item.course_id;
   
  });

 
  const  handleDatePickClose = () => {
    setOpenDatePick(false)
  }  

  const assignDueDate = () => {
   
    const courseData = userCourseList.filter((data:any) => {
      return data.id === getSelectedCourse 
 })
 //console.log(Data[0], '0000000000000')
  const userData = courseData[0].user_list.filter((data:any) => {
  return data.id === getSelectedUser 
})


userData[0].dueDate = getDueDate
setuserCourseList(userCourseList);
    if(getDueDate){ 
     setOpenDatePick(false)
    }
    localStorage.setItem('items', JSON.stringify(userCourseList));
 }

 
 const getSelectedDate =(data:any) => {
  const dateString = data.$d.toISOString();
   const formattedDate = dateString.slice(0, 10);
      setDueDate(formattedDate)
      

 }

 const handleDueDate = (userid:any,courseId:any) => {
   setOpenDatePick(true);
   setSelectedUser(userid)
   setSelectedCourse(courseId)
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
          <h3 className="m-3" onClick={home}>Home</h3>
        </div>
        <div>
          <button type="submit" className="butn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

  {/* date picker  */}

  <BootstrapDialog
       // onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openDatePick}
      >
       
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleDatePickClose}>
        Select Due Date
        </BootstrapDialogTitle>
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker onChange={getSelectedDate} />
    </LocalizationProvider>


      
        
        <DialogActions>
          <Button autoFocus onClick={assignDueDate}
          >
           Done
          </Button>
        </DialogActions>
      </BootstrapDialog>


 <MaterialReactTable
    columns={columns}
    data={getuserCourseList}
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
            > User Information</h6>
        {rowData.row.original.user_list.map((row:any,key:any) => {
          return <div key={key}>
           <Box
          sx={{
            display: 'grid',
            margin: 'auto',
            gridTemplateColumns: '1fr 1fr',
            width: '100%',
          }}
        >
          
          <Typography>SAP Id: {row.sap_id}</Typography>  
          <Typography>User Name: {row.name}</Typography>
          <Typography>Email: {row.mail_id}</Typography>
          <Typography>Role: {row.role}</Typography>
          {row.status && <Typography style={{color: 'green',}}>Status: {row.status}</Typography> }

          <div>
      {row.dueDate && <Typography>Due Date: {row.dueDate}</Typography>}
    </div>
    {!row.dueDate && row.status != 'Completed' &&
          <button style={{width:'50%',marginTop:'5%'}}
          onClick={() => handleDueDate(row.sap_id, rowData.row.original.id)}>
          Add Due date
          </button>
        }
        
          
         
        </Box>
        <hr></hr>
        <br></br>
          </div>; 
        })}

        
      </div>
      )
    } }
   
  />

    </>
  );
};

export default Details;
