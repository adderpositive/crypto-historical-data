export function formatDateForInput( date ) {
	const years = date.getFullYear();
	let months = date.getMonth() + 1;
	let days = date.getDate();

	if ( months < 10 ) {
	  months = '0' + months;
	}

	if ( days < 10 ) {
	  days = '0' + days;
	}

	return years + '-' + months + '-' + days;
}

// a and b are javascript Date objects
export function dateDifferenceInDays( aObj, bObj ) {
  // discard the time and time-zone information.
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
	const utc1 = Date.UTC( aObj.getFullYear(), aObj.getMonth(), aObj.getDate() );
	const utc2 = Date.UTC( bObj.getFullYear(), bObj.getMonth(), bObj.getDate() );

	return Math.floor( ( utc2 - utc1 ) / MS_PER_DAY );
}