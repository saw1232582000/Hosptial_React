import axios from "axios";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";
import { useRecoilState, useSetRecoilState } from "recoil";
import authAtom from "../recoil/auth/atom";
import { withAlert } from "../recoil/snackbar";
import { useHistory } from "react-router-dom";

const baseURL='https://localhost:7053';


const useAxios = (props) => {
    const [auth, setAuth] = useRecoilState(authAtom);
    const openAlert = useSetRecoilState(withAlert);
    const history = useHistory();

    
  
    const axiosInstance = axios.create({
      baseURL,
      headers: { Authorization: `Bearer ${auth?.access_token}` },
      validateStatus: function (status) {
        return status < 500;
      },
    });
  
    axiosInstance.interceptors.request.use(async (req) => {
      const user = jwtDecode(auth.access_token);
      
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
      console.log(auth.access_token)
  
      if (!isExpired) return req;
     // else alert('token is expired')
  
      const res = await axios.post(
        `${baseURL}/api/Login/refreshToken`,
        {
          access_token:auth.access_token,
          refresh_token: auth.refresh_token,
        },
        {
          validateStatus: function (status) {
            return status < 500;
          },
        }
      );
      console.log(res.data)
      if (res.status === 200) {
        
        localStorage.setItem("my-genesis-auth-tokens", JSON.stringify(res.data));
        setAuth(res.data);
        req.headers.Authorization = `Bearer ${res.data.access_token}`;
      } else {
        //console.log("return status:",res.status)
        setAuth(null);
        localStorage.removeItem("my-genesis-auth-tokens");
       // alert(`error occur while refreshing token:${res.status},${auth.refresh_token},${auth.access_token}`)
        history.push("/login");
      }
      return req;
    });
  
    axiosInstance.interceptors.response.use((res) => {
      if (res.config.method !== "get") {
        if (props?.autoSnackbar) {
          if (res.status === 200) {
            openAlert({ status: res.status, detail: res.data.detail });
          } else {
            if (res.status === 422) {
              openAlert({ status: res.status, detail: res.data.detail[0].msg });
            } else {
              openAlert({ status: res.status, detail: res.data.detail });
            }
          }
        }
      }
      return res;
    });
    return axiosInstance;
  };
  
  export default useAxios;
