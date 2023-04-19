import { Route, Redirect } from "react-router-dom";
import { useRecoilValue } from "recoil";
import authAtom from "../recoil/auth/atom";


function PrivateRoute({ children, ...rest }) {
    const auth = useRecoilValue(authAtom);
   // console.log("auth value:", auth);
   return <Route {...rest}>{!auth ? <Redirect to="/login" /> : children}</Route>;
     
      
  }
  
  export default PrivateRoute;