var RefPaser = require('json-schema-ref-parser');
var Validator = require('jsonschema').Validator;

// This function stores the response object and is responsible for completing the response
// which in this case can be an error or a success
function curryResponse(res) {
	return function (err) {
		if (err) {
			res.status(400).send({
				error: "Invalid Data",
				details: err
			});
		} else {
			res.send("Valid Data");
		}
	}
}

// This function accepts data and the curriedResponse function, it stores both until
// the schema is ready (or an error is encountered) at which time it runs the validation
// and then calls the curriedResponse function with the result. In the case that there
// is an error encountered it simply passes that through.
function curryValidate(data, curriedResponse) {
	return function (err, schema) {
		if (err) {
			curriedResponse(err);
		} else {
			curriedResponse(validateData (data, schema));
		}
	}
}

// Dereference a given schema, this is an asycronous function.
function dereferenceSchema(data, callback) {
	RefPaser.dereference(data.$schema, callback);
		/*function (err, schema) {
		if (err) {
			//res.status(400).send({
			//	error: 'Unable to process provided schema',
			//	message: err.message
			//});
			callback(err)
		} else {
			callback(null, schema);
		}
	});*/
}

function validateData(data, schema, callback) {
	var validation;
	var validator = new Validator({
		nestedErrors: true
	});
	validation = validator.validate(data, schema);
	if (validation.errors.length > 0) {
		return validation.errors
	}
}



function judgeData(data, res) {
	// once the validate has been done dispatch the appropriate response
	var curriedResponse = curryResponse(res);
	// once the schema has been dereferenced, call validateData with the appropriate schema
	var curriedValidate = curryValidate(data, curriedResponse);
	// dereference the schema and complete the curried calls
	dereferenceSchema(data, curriedValidate);
}

module.exports = {
	judgeData: judgeData
}