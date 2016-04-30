function modelExtend(modelObject, data) {
    data = data || {};
    modelObject.constructor._schema = modelObject._schema || {};
    var schema = modelObject.constructor._schema;
    Object.keys(modelObject).forEach(function(key) {
        var objectEntry = modelObject[key];
        if (objectEntry === Number ||
            objectEntry === String) {
            schema[key] = objectEntry;
            modelObject[key] = null;
        }
        if (data.hasOwnProperty(key)) {
            var schemaEntry = schema[key];
            var dataEntry = data[key];
            if (ko.isWriteableObservable(objectEntry)) {
                objectEntry(dataEntry);
            } else if (schemaEntry) {
                modelObject[key] = schemaEntry(dataEntry);
            } else {
                modelObject[key] = dataEntry;
            }
        }
    });
}

function getRootULR() {
    return location.protocol + '//' + location.host;
}
