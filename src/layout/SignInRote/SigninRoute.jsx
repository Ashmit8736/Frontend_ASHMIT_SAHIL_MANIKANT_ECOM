import { Outlet } from "react-router-dom";
import Navbar from '../../components/Navbar/Navbar';
import style from './SigninRoute.module.css'
const signinRoute = () => {
  return (
    <div className={style.authContainer}>
        <Navbar/>
        <Outlet />
    </div>
  )
}

export default signinRoute