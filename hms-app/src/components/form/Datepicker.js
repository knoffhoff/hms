import React from 'react'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';


const Datepicker = ({ action, date }) => {

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<Grid container justify="space-around">
				<KeyboardDatePicker
					disableToolbar
					variant="inline"
					format="MM/dd/yyyy"
					margin="normal"
					id="date-picker-inline"
					label=""
					value={date}
					onChange={action}
					KeyboardButtonProps={{
						'aria-label': 'change date',
					}}
				/>
			</Grid>
		</MuiPickersUtilsProvider>
	)
}

export default Datepicker