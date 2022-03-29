import * as React from 'react';
import { useEffect, useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SettingsIcon from '@mui/icons-material/Settings';
import { mainListItems } from '../Shared/Sidenav';

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, getIncomes, logout } from "../Firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import IncomeTable from './IncomeTable';
import IncomeFormModal from './IncomeFormModal';
import { ConstructionOutlined } from '@mui/icons-material';

const drawerWidth = 240;
let gUser = null;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function IncomeContent(props) {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openPopUpMenu = Boolean(anchorEl);
  const handlePopUpMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopUpMenuClose = () => {
    setAnchorEl(null);
  };

  const [rows, setRows] = React.useState([]);

  function createData(id, amount, title, date) {
    return {
      id,
      amount, 
      title, 
      date
    };
  }

  useEffect(async () => {
    let incomes = await getIncomes(props.user_id);
    if(incomes.length > 0) {
      let rows = [];
      incomes.docs.forEach(income => {
        rows.push(createData(income.id, income.data().amount, income.data()["title"], income.data().date.toDate().toDateString()));
      });
      setRows(rows);
    }
  }, []);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
            // style={{display: 'flex', justifyContent: 'space-around'}}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handlePopUpMenuClick}>
                <SettingsIcon 
                    id="popup-button"
                    aria-controls={openPopUpMenu ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openPopUpMenu ? 'true' : undefined}
                />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Menu
            id="popup-menu"
            anchorEl={anchorEl}
            open={openPopUpMenu}
            onClose={handlePopUpMenuClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={()=> {handlePopUpMenuClose(); logout()}}>Logout</MenuItem>
        </Menu>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <IncomeFormModal user_id={props.user_id}/>
            <IncomeTable rows={rows}/>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Income() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const fetchUserName = async () => {
        try {
          const q = query(collection(db, "users"), where("uid", "==", user?.uid));
          const doc = await getDocs(q);
          const data = doc.docs[0].data();
          setName(data.name);
        } catch (err) {
          console.error(err);
          alert("An error occured while fetching user data");
        }
    };

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        fetchUserName();
    }, [user, loading, navigate]);

    return <IncomeContent user_id={user?.uid}/>;
}