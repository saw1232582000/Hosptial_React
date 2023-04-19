import { AppBar, CssBaseline,Toolbar } from "@mui/material"
import { Box } from "@mui/system";
import { Redirect, Route, Switch, useRouteMatch } from "react-router";
import Patient from "../../component/patient/Patient";
import ResponsiveDrawer from "../ResponsiveDrawer";
import Bill from "../../component/bill/bill_container/Bill";
import Appbar from "../Appbar";


const drawerWidth = 240;

const Dashboard = () => {
    const { path } = useRouteMatch();
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* <Appbar drawerWidth={drawerWidth} /> */}
      <Appbar/>
      <ResponsiveDrawer drawerWidth={drawerWidth} />
      <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: `calc(100% - ${drawerWidth}px)`,
          }}
      >
        <Toolbar />
        <Switch>
          <Route path={`${path}/patient`} component={Patient} />
          {/* <Route path={`${path}/bills`} component={Bill} /> */}
           {/* <Redirect to={`${path}/patient`} />  */}
        </Switch>
        {/* <Footer /> */}
      </Box>
    </Box>
  )
}

export default Dashboard
