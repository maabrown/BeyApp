var update = document.getElementById('update');
var dele = document.getElementById('delete')

update.addEventListener('click', function() {
	// using fetch here b/c it is done in JS on client side rather than server using node
	fetch('quotes', {
		method: 'put',
		headers: {
			'Content-Type' : 'application/json'
		},
		body: JSON.stringify({
			name: 'Hola',
			quote: 'Beyyyy'
		})
	})
	.then(res => {
		if (res.ok) return res.json();
	})
	.then(data => {
		console.log(data);
		window.location.reload(true);
	})
})

dele.addEventListener('click', function() {
	fetch('quotes', {
		method: 'delete',
		headers: {
			'Content-Type' : 'application/json'
		},
		body: JSON.stringify({ 
			name: 'bey'
		})
	})
	.then( res => {
		if (res.ok) return res.json();
	})		
	.then( data => {
		console.log(data);
		// reloads window using location.reload() from cache, setting 'true' makes it a hard reload
		window.location.reload(true);

	})
})