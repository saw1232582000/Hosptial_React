import {
    AppBar,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
  } from "@mui/material";
  import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Logout } from "@mui/icons-material";
import React, { useState } from "react";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import { useRecoilValue, useSetRecoilState } from "recoil"
import { useHistory } from "react-router-dom";
import drawerAtom from "../recoil/drawer/atom";
import { constants } from "./utils/constants";
import authAtom  from "../recoil/auth/atom";
import { withUser } from "../recoil/auth";

const Appbar = ({ drawerWidth }) => {
  const history = useHistory();
  const user = useRecoilValue(withUser);
  const username = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  const role = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const setDrawerOpen = useSetRecoilState(drawerAtom);
  const setAuth = useSetRecoilState(authAtom);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutUser = () => {
    setAuth(null);
    localStorage.removeItem("my-genesis-auth-tokens");
    history.push("/login");
  };
  return (
    <>
    <AppBar
      position="fixed"
      sx={{
         width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setDrawerOpen((prev) => !prev)}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {constants.name}
        </Typography>
        <IconButton sx={{ color: "white" }} onClick={handleClick}>
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
       onClick={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        {/* {user?.sub || "Guest"} */}
        {username}
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
          <BadgeIcon fontSize="small" />
        </ListItemIcon>
        {/* {user?.role || "None"} */}
        {role}
      </MenuItem>
      <Divider />
      <MenuItem onClick={logoutUser}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  </>
  )
}

export default Appbar
