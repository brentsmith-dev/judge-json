var RefPaser = require('json-schema-ref-parser');
var Validator = require('jsonschema').Validator;

function dereferenceSchema() {

}

function validateData() {

}

function judgeData(data, res) {
    var validation;
    var validator =  new Validator({
        nestedErrors: true
    });
    //console.log('received data:');
    //console.dir(data, { depth: 10, colors: true });
    
    // fetch and dereference the schema in $schema
    //console.log(`schema: ${data.$schema}`);
    RefPaser.dereference(data.$schema, function(err, schema) {
        if (err) {
            //console.log('error seen:');
            //console.dir(err, { depth: 10, colors: true});
            res.status(400).send({
                error: 'Unable to process provided schema',
                message: err.message
            });
        } else{
            //console.log('dereferenced');
            //console.log('validating');
            // validate the data against the dereferenced schema
            validation = validator.validate(data, schema);
            //console.log('validation complete');
            if (validation.errors.length > 0){
                //console.log('errors found:');
                //console.dir(validation.errors, { depth: 10, colors: true})
                res.status(400).send({
                    error: "Invalid Data",
                    details: validation.errors
                });
            } else{
                res.send("Valid Data");
            }
            
        }
    });
}

module.exports = {
    judgeData: judgeData
}