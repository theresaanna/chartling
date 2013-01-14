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

    // gathers form input values and inserts JSON of values into textarea
    var generateJSON = function(event) {
        event.preventDefault();
        var submittedInfo = {},
            inputs,
            fieldset = {},
            fieldsetName,
            output,
            fieldsets = $('fieldset');

        // build objects of the fieldsets that have inputs with values
        fieldsets.each(function() {
            fieldset = {}; //reset
            fieldsetName = $(this).attr('name');

            // yikes
            $(this).find("input:not([type='submit'])")
                .each(function() {
                    var val = this.value;

                    if (val !== "") {
                        fieldset[this.name] = val;
                    }
                });

            // if any of the inputs in this fieldset have values,
            // we want to preserve them
            if ($.isEmptyObject(fieldset) === false) {
                submittedInfo[fieldsetName] = fieldset;
            }
        });

        // stringify and stick in the textarea
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
