import DetailsRow from "../../common/DetailsRow"
import BackButton from "../../common/BackButton"
import { Divider, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useHistory, useParams } from "react-router-dom";
import { useState ,useEffect} from "react";
import axios from "axios";
import { useAxios } from '../../hooks';

const PatientDetail = () => {
  const history=useHistory()
  const {id}=useParams()
  const [details, setDetails] = useState({});
  const api=useAxios();

  function formatDate(dateString){
    const dateObj=new Date(dateString)
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
}

  const getData = async () => {
    const res=await api.get(`/api/Patient/get_id/${id}`)
    
      setDetails(res.data)
   
  };

  useEffect(() => {
    if (id) {
      getData();
    } else {
      history.goBack();
    }
    // eslint-disable-next-line
  }, [id]);
  return (
    <Box sx={{ flexGrow: 1, mb: 1 }}>
        <Toolbar
          sx={{
            display: "flex",
            paddingLeft: "12px",
          }}
          variant="dense"
          disableGutters={true}
        >
          <BackButton  backFunction={()=>{history.goBack()}}/>
          <Typography variant="h5">Details</Typography>
        </Toolbar>
        <Divider />
        <Box sx={{ flexDirection: "column", padding: "20px 10px" }}>
          <DetailsRow
            name="ID"
            //value={details?.id && generateID(details.id, details.created_time)}
            value={details.id}
          />
          <DetailsRow name="Name" value={details.name} />
          <DetailsRow name="Age" value={details.age} />
          <DetailsRow name="Contact Details" value={details.contact_details} />
          <DetailsRow name="Gender" value={details.gender} />
          <DetailsRow name="Date Of Birth" value={formatDate(details.date_of_birth)} />
          <DetailsRow name="Address" value={details.address} />
        </Box>
      </Box>
  )
}

export default PatientDetail
