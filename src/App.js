import logo from './logo.svg';
import './App.css';
import Patient from './component/patient/Patient';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { RecoilRoot } from 'recoil';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Dashboard from './common/dashboard/Dashboard';
import Login from './common/login/Login';
import PrivateRoute from './hocs/PrivateRoute';
import Signup from './common/login/Signup';
import { CustomSnackbar } from './hocs/CustomSnackbar';

function App() {
  return (
    <RecoilRoot>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CustomSnackbar>
          <Router>
            <Switch>
            {/* <PrivateRoute path="/dashboard" component={Dashboard} />
              <Route path="/login" component={Login}/>
              <Route path="/signup" component={Signup} />
              <Redirect to="/dashboard" /> */}
              {/* <PrivateRoute path="/login" component={Login} /> */}
              <Route path="/login" component={Login}/>
              <Route path="/signup" component={Signup} />
              <Route path="/dashboard" component={Dashboard}/>
              <Redirect to="/login" />
            </Switch>
          </Router>
          </CustomSnackbar>
        </LocalizationProvider>
    </RecoilRoot>
    
   
  );
}

export default App;
