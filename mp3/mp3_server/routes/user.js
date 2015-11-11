var mongoose = require('mongoose'),
User = mongoose.model('User');

exports.list = function(req, res) {
	var where = req.query.where ? JSON.parse(req.query.where) : {},
	sort = req.query.sort ? JSON.parse(req.query.sort) : {},
	select = req.query.select ? JSON.parse(req.query.select) : {},
	skip = req.query.skip || 0,
	limit = req.query.limit ? JSON.parse(req.query.limit) : 0,
	count = (req.query.count === "true") || false;

	if (count === true) {
		User.find(where).sort(sort).select(select).skip(skip).limit(limit).count().exec(function(err, users) {
			if (err) { 
				res.status(500).json({ message: "Server error", data: err }) 
			} else {
				res.status(200).json({ message: "OK", data: users });
			}
		});
	} else {
		User.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function(err, users) {
			if (err) { 
				res.status(500).json({ message: "Server error", data: err }) 
			} else {
				res.status(200).json({ message: "OK", data: users });
			}
		});
	}
};

exports.create = function(req, res) {
	if (!req.body.name || !req.body.email) {
		res.status(500).json({ message: "Server error", data: {} });
	}
	else {
		var user = new User(req.body);
		user.save(function(err) {
			if (err) { 
				res.status(500).json({ message: "Server error", data: err }); 
			} else
				res.status(201).json({ message: "OK",  data: user });
		});
	}
};

exports.options = function(req, res) {
	res.writeHead(200);
	res.end();
};

exports.details = function(req, res) {
	var id = mongoose.Types.ObjectId(req.params.id);
	User.findById(id, function(err, user) {
		if (err) { 
			res.status(500).json({ message: "Server error", data: err }); 
		} else if (!user)
			res.status(404).json({ message: "User not found" });
		else
			res.status(200).json({ message: "OK",  data: user });
	});
};

exports.replace = function(req, res) {
	var id = mongoose.Types.ObjectId(req.params.id);
	User.findById(id, function(err, user) {
		if (err) { 
			res.status(500).json({ mesasge: "Server error", data: err }); 
		} else if (!user)
			res.status(404).json({ message: "User not found", data: {} });
		else {
			for (property in req.body) {
				user[property] = req.body.property;
			}

			user.save(function(err) {
				if (err) { 
					res.status(500).json({ message: "Server error", data: err }); 
				} else {
					res.status(200).json({
						data: {}, message: "Your user has been updated!"
					});
				}
			});
		}
	});
};

exports.delete = function(req, res) {
	var id = mongoose.Types.ObjectId(req.params.id);
	User.remove({ _id: id }, function(err, user) {
		if (err) { res.status(500).json({ message: "Server error", data: err }); }

		if (!user)
			res.status(404).json({ message: "User not found", data: {} });
		else {
			res.status(200).json({
				data: {}, message: "Your user has been deleted!"
			});
		}
	});
};
