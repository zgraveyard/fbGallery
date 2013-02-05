function formatDate()
{
	var date = new Date();
	var datestr = date.getMonth()+'/'+date.getDate()+'/'+date.getFullYear();
	// if (date.getHours()>=12)
	// {
		// datestr+=' '+(date.getHours()==12 ? date.getHours() : date.getHours()-12)+':'+date.getMinutes()+' PM';
	// }
	// else
	// {
		// datestr+=' '+date.getHours()+':'+date.getMinutes()+' AM';
	// }
	return datestr;
}