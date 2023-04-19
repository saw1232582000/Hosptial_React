import {
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    Typography,
    tableCellClasses,
    TableBody,
    Container,
    Accordion,
    AccordionSummary,
    AccordionDetails,
  } from "@mui/material";
  import { styled } from "@mui/material/styles";
  import { useRecoilState, useRecoilValue } from "recoil";
  import {
    
    withCurrentPatient,
    withTotalDeposit,
  } from "../../../recoil/billForm";
  import  {withBillItems,withBillItemsToadd}  from "../../../recoil/billForm";
  import { useEffect, useState } from "react";
  import BillItemsTableRow from "./BillItemsTableRow";
  import  DetailsRow from "../../../common/DetailsRow"
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
  
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#EBEBEB",
    },
  }));
  
  const BillFormPreview = () => {
    const currentPatient = useRecoilValue(withCurrentPatient);
    const totalDeposit = useRecoilValue(withTotalDeposit);
    const [billItems, setBillItems] = useRecoilState(withBillItems);
    const [billItemtoadd,setBillItemtoadd]= useRecoilState(withBillItemsToadd)

    const [totalAmount, setTotalAmount] = useState(0);
  
    const updateItem = (index, row, data) => {
      let copy_billItems = JSON.parse(JSON.stringify(billItems));
      let copy_billItemstoadd = JSON.parse(JSON.stringify(billItemtoadd));
      copy_billItems[index].quantity = data.quantity;
      copy_billItemstoadd[index].quantity = data.quantity;
      copy_billItemstoadd[index].subtotal = copy_billItemstoadd[index].quantity*copy_billItemstoadd[index].price
      setBillItems(copy_billItems);
      setBillItemtoadd(copy_billItemstoadd)
    };
  
    const removeItem = (index, row) => {
      const copy_billItems = [...billItems];
      const copy_billItemstoadd = [...billItemtoadd];
      copy_billItems.splice(index, 1);
      
      copy_billItemstoadd.splice(index,1);
     
      setBillItems(copy_billItems);
      setBillItemtoadd(copy_billItemstoadd)
    };
  
    useEffect(() => {
      let total = 0;
      billItems.forEach((item) => {
        total += item.price * item.quantity;
      });
      setTotalAmount(total);
    }, [billItems]);
  
    return (
      <>
        <Container sx={{ paddingTop: { xs: "20px", sm: "20px", md: "0px" } }}>
          <Accordion disableGutters disabled={!currentPatient}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography fontWeight="bold" sx={{ width: "20%", flexShrink: 0 }}>
                Bill Info
              </Typography>
              {/* <Typography sx={{ color: "text.secondary" }}>
                I am an accordion
              </Typography> */}
            </AccordionSummary>
            <AccordionDetails>
              <DetailsRow
                name="Patient ID"
                value={currentPatient?.id}
                padding="5px 0px"
                marginV={0}
                textVariant="body"
              />
              <DetailsRow
                name="Name"
                value={currentPatient?.name}
                padding="5px 0px"
                marginV={0}
                textVariant="body"
              />
              <DetailsRow
                name="Age"
                value={currentPatient?.age}
                padding="5px 0px"
                marginV={0}
                textVariant="body"
              />
              <DetailsRow
                name="Phone"
                value={currentPatient?.contactDetails}
                padding="5px 0px"
                marginV={0}
                textVariant="body"
              />
              <DetailsRow
                name="Address"
                value={currentPatient?.address}
                padding="5px 0px"
                marginV={0}
                textVariant="body"
              />
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded disableGutters>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="bill-items"
              id="bill-items"
            >
              <Typography fontWeight="bold">Bill Items</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer sx={{ maxHeight: 300 }}>
                <Table
                  sx={{ minWidth: 400 }}
                  aria-label="simple table"
                  size="small"
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell sx={{ minWidth: "16px" }}>
                        No
                      </StyledTableCell>
                      <StyledTableCell sx={{ minWidth: "120px" }}>
                        Name
                      </StyledTableCell>
                      <StyledTableCell sx={{ minWidth: "24px" }}>
                        Price
                      </StyledTableCell>
                      <StyledTableCell padding="none" sx={{ minWidth: "80px" }}>
                        Qty
                      </StyledTableCell>
                      <StyledTableCell sx={{ minWidth: "24px" }}>
                        UOM
                      </StyledTableCell>
                      <StyledTableCell sx={{ minWidth: "32px" }}>
                        SubTotal
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ minWidth: "32px" }}>
                        Actions
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {billItems.map((row, index) => (
                     
                      <BillItemsTableRow
                        key={index}
                        index={index}
                        row={row}
                        onEdit={updateItem}
                        onDelete={removeItem}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Container>
        <Container sx={{ paddingTop: { xs: "20px", sm: "5px" } }}>
          <DetailsRow
            name="Total"
            value={totalAmount}
            padding="5px 14px"
            marginV={0}
            textVariant="body"
          />
          <DetailsRow
            name="Deposit"
            value={totalDeposit}
            padding="5px 14px"
            marginV={0}
            textVariant="body"
          />
          <DetailsRow
            name="Unpaid"
            value={totalAmount - totalDeposit}
            padding="5px 14px"
            marginV={0}
            textVariant="body"
          />
        </Container>
      </>
    );
  };
  
  export default BillFormPreview;
  