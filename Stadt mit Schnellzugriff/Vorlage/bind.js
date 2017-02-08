
var bind = function (dataSourceID, targetID) {
    var dataTarget = $find(targetID);
    var dataSource = $find(dataSourceID);
    if (dataSource == null)
        return;
    if (dataTarget == null)
        return;
    $create(Sys.Binding, { path: "data", source: dataSource, target: dataTarget, targetProperty: "data" }, null, null, null);
};

function nullToEmpty(str) {
    return (str) ? str : "";
}

var dataBindings = null;
Sys.Application.add_load(function () {
    if (dataBindings) {
        var i;
        for (i = 0; i < dataBindings.length; i++) {
            bind(dataBindings[i].source, dataBindings[i].target);
        }
    }
});