// React Components
import React, { Component } from 'react';
class ReportTimeCalculation extends Component {
	render() {
		let time = this.props.timeInSeconds;
		time = Math.round(time * 100) / 100;
		if (time <= 0) {
			return <strong> 0 </strong>;
		} else {
			let hours = Math.floor(time / 3600);
			let minutes = Math.floor((time % 3600) / 60);
			let seconds = Math.floor((time % 3600) % 60);
			let hoursDisplay = hours > 0 ? hours + (hours === 1 ? ' HOURS, ' : ' HOURS  ') : ' ';
			let minutesDisplay = minutes > 0 ? minutes + (minutes === 1 ? ' MINUTES' : ' MINUTES  ') : ' ';
			let secondsDisplay = seconds > 0 ? seconds + (seconds === 1 ? ' SECONDS' : ' SECONDS') : ' ';
			if (hours == 0 && minutes == 0 && seconds == 0) {
				return <strong> 0 </strong>;
			} else {
				return <strong>{hoursDisplay + minutesDisplay + secondsDisplay}</strong>;
			}
		}
	}
}
export default ReportTimeCalculation;
