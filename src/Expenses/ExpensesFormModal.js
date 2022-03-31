import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import { addExpenses } from '../Firebase';

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getDays = () => {
    let list = [];
    for(let i=1; i<32; i++) {
      list.push(<MenuItem key={i} value={i}>{i}</MenuItem>);    
    }
    return list;
  }
  const getMonths = () => {
    let list = [];
    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    let i = 0;
    monthNames.forEach(month => {
      list.push(<MenuItem key={month} value={i}>{month}</MenuItem>);
      i++;
    });
    return list;
  }
  const getYears = () => {
    let list = [];
    const now = new Date().getUTCFullYear();    
    const years = Array(now - (now - 20)).fill('').map((v, idx) => now - idx);
    years.forEach(year => {
      list.push(<MenuItem key={year} value={year}>{year}</MenuItem>);   
    });
    return list;
  }

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [receipt, setReceipt] = useState('');

  const handleAdd = () => {
    let date = new Date(year, month, day);
    const splited = receipt.split('.');
    const ext = splited[splited.length -1];
    if(isDateBeforeToday(date)) {
      addExpenses(title, amount, date, receipt, ext)
      .then(res => {
        window.location.reload(false);
      })
      .catch(err => {
        alert("Error: " + err.message);
        console.log(err);
      });
    } else {
      alert("You can't postdate an expense!");
    }
  }

  function isDateBeforeToday(date) {
    return new Date(date.toDateString()) < new Date(new Date().toDateString());
  }

  return (
    <div>
      <Fab color="primary" aria-label="add" onClick={handleClickOpen} style={{position: "fixed", bottom: "20px", right: "20px"}}>
          <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              value={title}
              onChange={(e)=>{setTitle(e.target.value)}}
            />
          <FormControl fullWidth variant="standard">
            <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
            <Input
              id="standard-adornment-amount"
              onChange={(e)=>{setAmount(e.target.value)}}
              value={amount}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
            />
        </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} variant="standard">
            <InputLabel id="demo-simple-select-helper-label">Day</InputLabel>
            <Select
              labelId="day"
              id="day"
              label="day"
              onChange={(e)=>{setDay(e.target.value)}}
              value={day}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {getDays()}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} variant="standard">
            <InputLabel id="demo-simple-select-helper-label">Month</InputLabel>
            <Select
              labelId="month"
              id="month"
              label="month"
              onChange={(e)=>{setMonth(e.target.value)}}
              value={month}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {getMonths()}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} variant="standard">
            <InputLabel id="demo-simple-select-helper-label">Year</InputLabel>
            <Select
              labelId="year"
              id="year"
              label="year"
              onChange={(e)=>{setYear(e.target.value)}}
              value={year}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {getYears()}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="standard">
            <InputLabel htmlFor="standard-adornment-amount">Receipt</InputLabel>
            <Input
              type='file'
              id="standard-adornment-receipt"
              accept="image/*"
              onChange={(e)=>{setReceipt(e.target.value)}}
              value={receipt}
              startAdornment={<InputAdornment position="start">File: </InputAdornment>}
            />
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}