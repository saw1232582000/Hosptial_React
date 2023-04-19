
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useState,useEffect,memo,useCallback } from 'react';
import {IconButton} from '@mui/material';
import { Delete,Edit,Menu ,Add} from '@mui/icons-material';

import {TextField} from '@mui/material';
import DeleteDialog from '../../common/DeleteDialog';
import CustomTable from '../../common/customTable_components/CustomTable';
import { useAxios } from '../../hooks';
import { extractID } from '../../common/utils/extractID';
import { generateID } from '../../common/utils/generateID';
import moment from 'moment';
import authAtom from '../../recoil/auth/atom';
import { useRecoilValue } from 'recoil';

const headCells = [
    {
      id: "id",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
    {
      id: "name",
      numeric: false,
      disablePadding: false,
      label: "Name",
    },
    {
      id: "age",
      numeric: false,
      disablePadding: false,
      label: "Age",
    },
    {
      id: "contactDetails",
      numeric: false,
      disablePadding: false,
      label: "Contact Details",
    },
    {
      id: "gender",
      numeric: false,
      disablePadding: false,
      label: "Gender",
    },
    {
      id: "dataOfBirth",
      numeric: false,
      disablePadding: false,
      label: "Date Of Birth",
    },
    {
      id: "address",
      numeric: false,
      disablePadding: false,
      label: "Address",
    },
    {
      id: "dateAndTime",
      numeric: false,
      disablePadding: false,
      label: "Date And Time",
    },
  ];

const PatientTable = () => {
    const auth=useRecoilValue(authAtom)
    const api = useAxios({ autoSnackbar: true });
    const history = useHistory();
    const [rows, setRows] = useState([]);
    const [selected, setSelected] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [searchname,setSearchname]=useState()
    const [patienttodelete,setPatienttodelete]=useState()
    
    const getData = useCallback(async () => {
        setIsTableLoading(true);
        const res = await api.get("/api/Patient");
        if (res.status === 200) {
          const data = res.data.map((row) => {
            const ID = generateID(row.id, row.created_time);
            //const formattedDate = moment(row.date_of_birth).toDate()
            const dob=new Date(row.date_of_birth)
            
            const dateAndTime = `${row.created_time.split("T")[0]} ${new Date(
              row.created_time
            ).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}`;
            return {
              id: ID,
              name: row.name,
              age: row.age,
              contactDetails: row.contact_details,
              gender: row.gender,
              dataOfBirth: dob.toLocaleDateString() || "",
              address: row.address,
              dateAndTime: dateAndTime,
            };
          });
          setRows(data);
          setIsTableLoading(false);
        }else if(res.statusText==="ERR_NETWORK"){
          history.push("/login")
        }

        return;
        // eslint-disable-next-line
      }, []);
    
      const deleteItem = async () => {
        if (selected.length === 0) {
          return;
        } else if (selected.length === 1) {
          await api.delete(
            `/api/Patient/${parseInt(selected[0].id.split("-")[1])}`
          );
        } else if (selected.length > 1) {
          const extractedID = selected.map((item) => {
            return extractID(item.id);
          });
          await api.post(`/api/patients/bulk`, {
            listOfId: extractedID,
          });
        }
        setOpenDeleteDialog(false);
        setSelected([]);
        getData();
      };
    
      useEffect(() => {
        try{
          console.log(auth)
          getData();
        }
        catch(error)
        {
          console.error(error)
        }
       
        // eslint-disable-next-line
      }, []); 

    
  return (
    <div>
        <>
      <CustomTable
        tableConfig={{
          headCells: headCells,
          tableName: "Patient",
          maxHeight: "62vh",
          atom: "patientTableAtom",
        }}
        data={rows}
        isLoading={isTableLoading}
        toolbarButtons={{
          whenNoneSelected: [
            {
              id: "patient table new button",
              component: memo(({ ...rest }) => (
                <Button variant="outlined" size="small" {...rest}>
                  New
                </Button>
              )),
              callback: (selected) => {
                history.push("patient/PatientForm");
              },
            },
          ],
          whenOneSelected: [
            {
              id: "patient table edit button",
              component: memo(({ ...rest }) => (
                <Button variant="contained" size="small" {...rest}>
                  Edit
                </Button>
              )),
              callback: (selected) => {
                history.push(`patient/PatientForm/${extractID(selected[0].id)}`);
              },
            },
            {
              id: "patient table detail button",
              component: memo(({ ...rest }) => (
                <Button
                  variant="contained"
                  size="small"
                  sx={{ marginLeft: "5px" }}
                  {...rest}
                >
                  Details
                </Button>
              )),
              callback: (selected) => {
                history.push(`patient/PatientDetail/${extractID(selected[0].id)}`);
              },
            },
            {
              id: "patient table delete button",
              component: memo(({ ...rest }) => (
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  sx={{ marginLeft: "5px" }}
                  {...rest}
                >
                  Delete
                </Button>
              )),
              callback: (selected) => {
                setSelected(selected);
                setOpenDeleteDialog(true);
              },
            },
          ],
          whenMoreThanOneSelected: [],
        }}
      />
      <DeleteDialog
        isOpen={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        callback={() => {
          deleteItem();
        }}
      />
    </>
    </div>
  )
}

export default PatientTable
