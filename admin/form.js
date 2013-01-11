$(document).ready(function() {
    CFPBData = {};
    // id, text
    CFPBData.layoutTypes = {
        linkId: 'pieChart', 
        linkText: "Pie Chart"
    };

    // event handlers
    var openForm = function(event) {
        var formType = event.target.id.toString(),
            templateName = formType + 'Form',
            optionForm,
            form = {};

        form.options = [];

        // temp solution
        for (var i = 1; i <= 5; i++) {
           form.options.push({num: i}); 
        }

        optionForm = ich[templateName](form);
        $("#visualization-form").append(optionForm);
        
    };
    
    // render visualization options
    var layoutList = ich.linkList(CFPBData.layoutTypes);
    $("#layout-types").append(layoutList);

    // event bindings
    $(".option-link").on('click', openForm);

});
