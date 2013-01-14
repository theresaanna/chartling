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
           form.options.push({num: i, tooltipLinks: [{},{},{}]}); 
        }

        optionForm = ich[templateName](form);
        $("#visualization-form").append(optionForm);
    };

    var generateJSON = function(event) {
        event.preventDefault();
        var submittedInfo = {},
            inputs,
            fieldset,
            fieldsetName,
            output,
            fieldsets = $('fieldset');

        fieldsets.each(function() {
            fieldsetName = $(this).attr('name');
            submittedInfo[fieldsetName] = {};
            fieldset = submittedInfo[fieldsetName];

            // yikes
            $(this).find("input:not([type='submit'])")
                .each(function() {
                    var val = this.value;

                    if (val !== "") {
                        fieldset[this.name] = val;
                    }
                });
        });

        output = JSON.stringify(submittedInfo);
        $('#json-output').val(output);
    };
    
    // render visualization options
    var layoutList = ich.linkList(CFPBData.layoutTypes);
    $("#layout-types").append(layoutList);

    // event bindings
    $(".option-link").on('click', openForm);

    $("#visualization-form").on('submit', generateJSON);

});
