var mongoose = require('mongoose'),
Task = mongoose.model('Task');

exports.list = function(req, res) {
	var where = req.query.where ? JSON.parse(req.query.where) : null,
	sort = req.query.sort ? JSON.parse(req.query.sort) : null,
	select = req.query.select ? JSON.parse(req.query.select) : null,
	skip = req.query.skip || 0,
	limit = req.query.limit ? JSON.parse(req.query.limit) : 0,
	count = (req.query.count === "true") || false;

	if (count === true) {
		Task.find(where).sort(sort).select(select).skip(skip).limit(limit).count().exec(function(err, tasks) {
			if (err) { 
				res.status(500).json({ message: "Server error", error: err }); 
			} else {
				res.status(200).json({ message: "OK",  data: tasks });
			}
		});
	} else {
		Task.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function(err, tasks) {
			if (err) { 
				res.status(500).json({ error: err }); 
			} else
				res.status(200).json({ message: "OK",  data: tasks });
		});
	}
};

exports.create = function(req, res) {
	var task = new Task(req.body);
	if (!req.body.name || !req.body.deadline) { 
		res.status(200).json({ message: "Server error", data: {} }) 
	} else {
		task.save(function(err) {
			if (err) { 
				res.status(500).json({ error: err }); 
			} else
				res.status(201).json({ message: "OK",  data: task });
		});
	}
};

exports.options = function(req, res) {
	res.writeHead(200);
	res.end();
};

exports.details = function(req, res) {
	var id = mongoose.Types.ObjectId(req.params.id);
	Task.findById(id, function(err, task) {
		if (err) { 
			res.status(500).json({ message: "Server error", data: err }); 
		} else if (!task) {
			res.status(404).json({ message: "Task not found", data: {} })
		} else
			res.status(200).json({ message: "OK",  data: task });
	});
};

exports.replace = function(req, res) {
	var id = mongoose.Types.ObjectId(req.params.id);
	Task.findById(id, function(err, task) {
		if (err) { 
			res.status(500).json({ message: "Server error", data: err }); 
		} else if (!task) {
			res.status(404).json({ message: "Task not found", data: {} })
		} else {
			for (property in req.body) {
				task[property] = req.body.property;
			}

			task.save(function(err) {
				if (err) { 
					res.status(500).json({ error: err }); 
				} else {
					res.status(200).json({
						message: "Your task has been updated!"
					});
				}
			});
		}
	});
};

exports.delete = function(req, res) {
	var id = mongoose.Types.ObjectId(req.params.id);
	Task.remove({ _id: id }, function(err, task) {
		if (err) { 
			res.status(500).json({ message: "Server error", data: err }); 
		} else if (!task) {
			res.status(404).json({ message: "Task not found", data: {} })
		} else {
			res.status(200).json({
				message: "Your task has been deleted!"
			});
		}
	});
};