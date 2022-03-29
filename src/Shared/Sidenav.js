import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Link } from "react-router-dom";

function openLink(path) {
  window.location.replace(`/${path}`);
}

export const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <AccountBalanceIcon  onClick={() => {openLink('dashboard')}}/>
      </ListItemIcon>
      <ListItemText primary="Dashboard" onClick={() => {openLink('dashboard')}}/>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <LocalAtmIcon  onClick={() => {openLink('income')}}/>
      </ListItemIcon>
      <ListItemText primary="Income"  onClick={() => {openLink('income')}}/>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <ShoppingCartCheckoutIcon  onClick={() => {openLink('expenses')}}/>
      </ListItemIcon>
      <ListItemText primary="Expenses"  onClick={() => {openLink('expenses')}}/>
    </ListItemButton>
  </React.Fragment>
);

// export const secondaryListItems = (
//   <React.Fragment>
//     <ListSubheader component="div" inset>
//       Saved reports
//     </ListSubheader>
//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Current month" />
//     </ListItemButton>
//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Last quarter" />
//     </ListItemButton>
//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Year-end sale" />
//     </ListItemButton>
//   </React.Fragment>
// );