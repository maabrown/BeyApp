https://zellwk.com/blog/crud-express-mongodb/

https://scotch.io/tutorials/setting-up-a-mean-stack-single-page-application

Why you need base href:
http://stackoverflow.com/questions/18214835/angularjs-how-to-enable-locationprovider-html5mode-with-deeplinking

Using $http and $scope
http://www.w3schools.com/angular/angular_http.asp

Why I must convert \r\n to <br> 
http://stackoverflow.com/questions/21295389/newline-character-working-for-console-log-but-not-chrome-browser

Using $sce
http://stackoverflow.com/questions/9381926/angularjs-insert-html-into-view/11640420#11640420
http://stackoverflow.com/questions/18340872/how-do-you-use-sce-trustashtmlstring-to-replicate-ng-bind-html-unsafe-in-angu

RegEx for \n\r
http://stackoverflow.com/questions/784539/how-do-i-replace-all-line-breaks-in-a-string-with-br-tags

Flash messages
https://docs.typo3.org/typo3cms/CoreApiReference/ApiOverview/FlashMessages/Index.html

Angular flash
https://sachinchoolur.github.io/angular-flash/

What is message flashing?
http://flask.pocoo.org/docs/0.12/patterns/flashing/ 

Explain some of server.js file
https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular

Flash messages
https://gist.github.com/brianmacarthur/a4e3e0093d368aa8e423 

Authentication
https://scotch.io/tutorials/easy-node-authentication-setup-and-local 

Bcrypt
https://www.npmjs.com/package/bcrypt 

What is session secret
http://stackoverflow.com/questions/5343131/what-is-the-sessions-secret-option

Process.nextTick()
https://medium.com/@amanhimself/how-process-nexttick-works-in-node-js-cb327812e083#.mmtw8ho6i
https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/

Done Callback in Passport
http://stackoverflow.com/questions/32153865/what-is-done-callback-function-in-passport-strategy-configure-use-function

Serialize and Deserialize Sessions
http://stackoverflow.com/questions/19268812/do-i-implement-serialize-and-deserialize-nodesjs-passport-redisstore

Translating Scotch Tutorial into AngularJS
https://github.com/brandonmcquarie/easy-node-authentication-angular

Res.render() vs res.sendFile()
http://stackoverflow.com/questions/23875360/express-sendfile-vs-render
	TL;DR - render allows you use templating engine like jade or Handlebars to update values
			send just sends back the HTML file and you would have to use JS to update values

Dirname vs .
http://stackoverflow.com/questions/8131344/what-is-the-difference-between-dirname-and-in-node-js
	TL;DR - dirname is the directory containing the file where you are using dirname
			. is the directory containing the file where you ran the 'node' command on the command line

Why use link function in Angular directives?
http://stackoverflow.com/questions/20018507/angularjs-what-is-the-need-of-the-directives-link-function-when-we-already-had
	TL;DR - use 'controllers' when you want business logic
			use 'link' when you want DOM manipulation

Service vs Factory
http://stackoverflow.com/questions/16596569/angularjs-what-is-a-factory
	TL;DR - services share instances of objects
			factories - share functions and objects

Mixing Mongoose with MongoDB for $text and index
http://stackoverflow.com/questions/39177201/not-able-to-create-index-using-mongoose
http://stackoverflow.com/questions/24714166/full-text-search-with-weight-in-mongoose

Gulp 'done'
http://stackoverflow.com/questions/29694425/what-does-gulp-done-method-do
	- use done as a callback to make gulp tasks run in order

Callbacks in Gulp with Promises
http://stackoverflow.com/questions/32770896/nodes-del-command-callback-not-firing
	- use return the promises as a callback rather than using 'done' (aka use return keword)

Gulp Errors
https://medium.com/@boriscoder/catching-errors-on-gulp-js-4682eee2669f
	- Gulp stream stops once there's an error
	- use .on('error', cb) setup
	- use function(done) { done(error)} to throw error and continue stream
	- 