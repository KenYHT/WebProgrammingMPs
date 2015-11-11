var user = require('./routes/user.js');
var task = require('./routes/task.js');

module.exports = function(router) {
	var userRoute = router.route('/users');

	userRoute.get(user.list)
	.post(user.create)
	.options(user.options);

	var userIdRoute = router.route('/users/:id');

	userIdRoute.get(user.details)
	.put(user.replace)
	.delete(user.delete);
	
	var taskRoute = router.route('/tasks');

	taskRoute.get(task.list)
	.post(task.create)
	.options(task.options);

	var taskIdRoute = router.route('/tasks/:id');

	taskIdRoute.get(task.details)
	.put(task.replace)
	.delete(task.delete);
}