import React from 'react'
import BackButton from '../../common/BackButton'
import { useHistory, useParams } from 'react-router-dom'
import {
  Divider,
  TextField,
  Toolbar,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box } from "@mui/system";
import { MobileDatePicker } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';
 import { useState,useEffect } from 'react';
import { useAxios } from '../../hooks';
import { parseISO } from 'date-fns';
import format from 'date-fns/format';
import { convertToLocalTime } from 'date-fns-timezone';


const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
const PatientForm = () => {


  const api=useAxios();
  const history=useHistory()
  const {id}=useParams()
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    age: "",
    contact_details: "",
    gender: "",
    date_of_birth: null,
    address: "",
  });

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const onDatePicked = (e) => {
    const date_obj = new Date(e);
    // const v = `${date_obj.getFullYear()}-${
    //   date_obj.getMonth()+1
    // }-${date_obj.getDate()}`;
    setDetails({ ...details, date_of_birth:date_obj });
  };
  
  const getData = async () => {
    const res=await api.get(`/api/Patient/get_id/${id}`);
    const formattedDate = moment(res.data.date_of_birth).toDate()
    setDetails({...details,
              name: res.data.name,
              age: res.data.age,
              contact_details: res.data.contact_details,
              gender: res.data.gender,
              date_of_birth: formattedDate,
              address: res.data.address,
          })
    // .then(response=>{
    //   const formattedDate = moment(response.data.date_of_birth).toDate()
    //     setDetails({...details,
    //         name: response.data.name,
    //         age: response.data.age,
    //         contact_details: response.data.contact_details,
    //         gender: response.data.gender,
    //         date_of_birth: formattedDate,
    //         address: response.data.address,
    //     })
    // })
  };
  const createNew = async () => {
    setLoading(true);
    const res=await api.post(`/api/Patient`,details)
    
        if(res.status===200)
        {
            history.goBack();
            
        }
        setLoading(false)
    
  };

  const update = async () => {
    setLoading(true);
    await api.put(`/api/Patient/${id}`,details)
    .then(response=>{
        if(response.status===200)
        {
            history.goBack()
        }
        setLoading(false);
    })
    
  };

  useEffect(() => {
    if (id) {
      getData();
    }
    // eslint-disable-next-line
  }, [id]);

  return (
    <div>
       <Box sx={{ flexGrow: 1 }}>
        <Toolbar
          sx={{
            display: "flex",
            paddingLeft: "12px",
          }}
          variant="dense"
          disableGutters={true}
        >
          <BackButton backFunction={()=>{history.goBack()}} />
          <Typography variant="h5"> {"New"}</Typography>
        </Toolbar>
        <Divider />
        <Box sx={{ flexDirection: "column", padding: "20px 10px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <Typography variant="p">Name</Typography>
            </Box>
            <TextField
              size="small"
              sx={{ width: "70%" }}
              margin="dense"
              value={details?.name || ""}
              name="name"
              onChange={handleChange}
            />
         </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <Typography variant="p">Age</Typography>
            </Box>
            <TextField
              size="small"
              sx={{ width: "70%" }}
              margin="dense"
             value={details?.age || ""}
              name="age"
             onChange={handleChange}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <Typography variant="p">Contact Details</Typography>
            </Box>
            <TextField
              size="small"
              sx={{ width: "70%" }}
              margin="dense"
              value={details?.contact_details }
              name="contact_details"
              onChange={handleChange}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <Typography variant="p">Gender</Typography>
            </Box>
            <RadioGroup
              row="true"
              label="Gender"
              sx={{ width: "70%" }}
              margin="dense"
              value={details?.gender || ""}
              name="gender"
              onChange={handleChange}
            >
              <FormControlLabel control={<Radio />} label="Male" value="male" />
              <FormControlLabel control={<Radio />} label="Female" value="female" />
            </RadioGroup>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <Typography variant="p">Date Of Birth</Typography>
            </Box>
          {/* <DatePicker>

          </DatePicker> */}
            <MobileDatePicker
            inputFormat="yyyy-MM-dd"
            value={details?.date_of_birth}
            onChange={onDatePicked}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ width: "70%" }}
                size="small"
                margin="dense"
              />
            )}
          />
           
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <Typography variant="p">Address</Typography>
            </Box>
            <TextField
              size="small"
              sx={{ width: "70%" }}
              margin="dense"
              value={details?.address || ""}
              name="address"
            onChange={handleChange}
            />
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "20px 10px",
          }}
        >
          <LoadingButton
            variant="contained"
            loading={loading}
            size="small"
            sx={{ marginRight: "5px" }}
            onClick={id ? update : createNew}
          >
            Save
          </LoadingButton>
        </Box>
      </Box>
    </div>
  )
}

export default PatientForm
