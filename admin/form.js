$(document).ready(function() {
    CFPBData = {};
    // id, text
    CFPBData.layoutTypes = {
        linkId: 'pieChart', 
        linkText: "Pie Chart"
    };

    var layoutList = ich.linkList(CFPBData.layoutTypes);

    $("#layout-types").append(layoutList);
});
