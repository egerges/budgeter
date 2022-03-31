import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

export default function Banner(props) {
  return (
    <React.Fragment>
      <Title>{props.title}</Title>
      <Typography component="p" variant="h4">
        {props.amount}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        as of {props.date}
      </Typography>
      <div>
        <Link color="primary" href={props.url}>
          View {props.title}
        </Link>
      </div>
    </React.Fragment>
  );
}