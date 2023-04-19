import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Divider,
    IconButton,
    TextField,
    Typography,
  } from "@mui/material";
  import AddIcon from "@mui/icons-material/Add";
  import { useEffect, useRef, useState } from "react";
  import { useHistory } from "react-router-dom";
  import { useAxios } from "../../../hooks";
  import {generateID} from "../../../common/utils/generateID"
  import billFormAtom, {
    withBillItemsToadd,
    withCurrentPatient,
    
    withTotalDeposit,
  } from "../../../recoil/billForm";
  import {withBillItems}   from "../../../recoil/billForm";
  import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
  import { LoadingButton } from "@mui/lab";
  
  const BillSubForm = () => {
    const history = useHistory();
    const api = useAxios({ autoSnackbar: true });
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [patient, setPatient] = useState([]);
    const [salesServiceItem, setSalesServiceItem] = useState([]);
    const setTotalDeposit = useSetRecoilState(withTotalDeposit);
    const [currentSSI, setCurrentSSI] = useState(null);
    const [currentQuantity, setCurrentQuantity] = useState(0);
    const [currentPatient, setCurrectPatient] =
      useRecoilState(withCurrentPatient);
    const [billItems, setBillItems] = useRecoilState(withBillItems);
    //const [billItemtoadd,setBillItemtoadd]=useState([])
    const [billItemtoadd,setBillItemtoadd]= useRecoilState(withBillItemsToadd)
    const resetBillForm = useResetRecoilState(billFormAtom);
    const quantityRef = useRef();
    const SSIRef = useRef();

    const const_data=[{
      id: 0,
    bill_id: 345,
    sales_service_item_id: 352,
    name: "string",
    quantity: 0,
    uom: "string",
    price: 0,
    subtotal: 0,
    remark: "string"
    },
    {
      id: 0,
    bill_id: 345,
    sales_service_item_id: 352,
    name: "string",
    quantity: 0,
    uom: "string",
    price: 0,
    subtotal: 0,
    remark: "string"
    },
  ]
  
    const addItem = (e) => {
      e.preventDefault();
      if (currentSSI) {
               
        setBillItems([
          { ...currentSSI, quantity: parseInt(currentQuantity), remark: "" },
          ...billItems,
        ]);
        
        setBillItemtoadd([
          
          {id:0,bill_id:0,sales_service_item_id:currentSSI.sales_service_item_id,name:currentSSI.name,quantity: parseInt(currentQuantity),uom:currentSSI?.uom,price:currentSSI.price,subtotal:parseInt(currentQuantity)*currentSSI.price,remark:""},
          ...billItemtoadd,
        ])
       
        setCurrentSSI(null);
        setCurrentQuantity(0);
        SSIRef.current.focus();
      }
    };
  
    const getDepositByPatientId = async (id) => {
      const res = await api.get(`/api/Deposit/get_deposit/active/${id.split("-")[1]}`);
      if (res.status === 200) {
        const total = res.data.reduce((total, num) => total + num.amount, 0);
        setTotalDeposit(total);
      }
    };
  
    const createBill = async () => {
      if (currentPatient) {
        setLoading(true);
        const billItemstoadd_copy = [...billItemtoadd];
        const total=billItemtoadd.reduce((total,b)=> total+b.subtotal,0);
         const res = await api.post(`/api/Bill/Add_bill_`,{
          patient_id: parseInt(currentPatient.id.split("-")[1]),
          patient_name: currentPatient.name,
          patient_phone: currentPatient.contactDetails,
          total_amount:parseInt(total) ,
          printed_or_drafted:"drafted",
          patient_address: currentPatient.address,
          is_cancelled:false,
          //bill_items:billItemstoadd_copy.reverse()
         } );
        if (res.status === 200) {
           const data=billItemtoadd.map(async b=>{
            return{
              // id:0,
              // bill_id:res.data,
              // sales_service_item_id:b.sales_service_item_id,
              // name:b.name,
              // quantity:b.quantity,
              // uom:b.uom,
              // price:b.price,
              // subtotal:b.subtotal,
              // remark:b.remark
              id:0,
              bill_id:res.data,
              sales_service_item_id:b.sales_service_item_id,
              name:b.name,
              quantity:b.quantity,
              uom:b.uom,
              price:b.price,
              subtotal:b.subtotal,
              remark:b.remark
            }
           
          })
          const arrdata=await Promise.all(data);
          await api.post(`/api/BillItem/Add_billitem`, arrdata);
          resetBillForm();
          setCurrentSSI(null);
          setCurrentQuantity(0);
          history.replace(`/dashboard/bills/details/${res.data}/draft`);
        }
       
        setLoading(false);
     }
      return;
     
    };
  
    const getPatientAndSalesServiceItem = async () => {
      setDataLoading(true);
  
      const [patient, salesServiceItem] = await Promise.all([
        api.get("/api/Patient"),
        api.get("/api/SalesServiceItem/get_all_ssItem_with_uom_category"),
      ]);
      if (patient.status === 200 && salesServiceItem.status === 200) {
        const p = patient.data.map((row) => {
          const ID = generateID(row.id, row.created_time);
          const dob=new Date(row.date_of_birth)
          return {
            id: ID,
            name: row.name,
            age: row.age.toString(),
            contactDetails: row.contact_details,
            gender: row.gender,
            dataOfBirth: dob.toLocaleDateString(),
            address: row.address,
          };
        });
        setPatient(p);
        const s = salesServiceItem.data.map((row) => {
          return {
            sales_service_item_id: row.id,
            name: row.name,
            price: row.price,
            uom: row.uom?.name,
          };
        });
        setSalesServiceItem(s);
        setDataLoading(false);
        if (currentPatient) {
          getDepositByPatientId(currentPatient.id);
        }
      } else {
        history.goBack();
      }
    };
  
    useEffect(() => {
      getPatientAndSalesServiceItem();
      // eslint-disable-next-line
    }, []);
  
    if (dataLoading)
      return (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      );
  
    return (
      <>
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography variant="p">Select Patient</Typography>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Autocomplete
                value={currentPatient}
                options={patient}
                getOptionLabel={(option) => `${option.name}, ${option.id}`}
                renderOption={(props, option) => {
                  return (
                    <Box {...props} key={option.id}>
                      {option.name}, {option.id}
                    </Box>
                  );
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                style={{ width: "90%" }}
                onChange={(event, newValue) => {
                  if (newValue) {
                    getDepositByPatientId(newValue.id);
                  } else {
                    setTotalDeposit(0);
                  }
                  setCurrectPatient(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    fullWidth
                    size="small"
                    margin="normal"
                  />
                )}
              />
              <IconButton
                size="small"
                color="primary"
                sx={{ marginTop: "5px" }}
                onClick={() => history.push("/dashboard/patient/form")}
              >
                <AddIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>
          <Divider sx={{ margin: "15px 0px" }} />
          <form onSubmit={addItem}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Typography variant="p">Select Sales & Service Item</Typography>
              </Box>
  
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Autocomplete
                  value={currentSSI}
                  options={salesServiceItem}
                  style={{ width: "90%" }}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option) => {
                    return (
                      <Box {...props} key={option.sales_service_item_id}>
                        {option.name}
                      </Box>
                    );
                  }}
                  onChange={(event, newValue) => {
                    setCurrentSSI(newValue);
                    quantityRef.current.focus();
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputRef={SSIRef}
                      variant="outlined"
                      fullWidth
                      size="small"
                      margin="normal"
                    />
                  )}
                />
                <IconButton
                  size="small"
                  color="primary"
                  sx={{ marginTop: "5px" }}
                  onClick={() => history.push("/dashboard/salesServiceItem/form")}
                >
                  <AddIcon fontSize="large" />
                </IconButton>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Typography variant="p">Quantity</Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TextField
                  inputRef={quantityRef}
                  size="small"
                  style={{ width: "85%" }}
                  margin="normal"
                  type="number"
                  InputProps={{
                    inputProps: { min: "0", step: "1" },
                  }}
                  value={currentQuantity}
                  onChange={(e) => setCurrentQuantity(e.target.value)}
                />
                <Box sx={{ width: "45px" }}></Box>
              </Box>
            </Box>
            <Box
              sx={{
                paddingTop: "10px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button variant="contained" type="submit">
                ADD
              </Button>
            </Box>
          </form>
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
          <LoadingButton
            loading={loading}
            variant="contained"
            fullWidth
            onClick={createBill}
          >
            save Bill
          </LoadingButton>
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              resetBillForm();
  
              setCurrentSSI(null);
              setCurrentQuantity(0);
            }}
          >
            Cancel
          </Button>
        </Box>
      </>
    );
  };
  
  export default BillSubForm;
  