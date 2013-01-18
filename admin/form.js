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
        form.timestamp = Date.now().toString();
        // temp solution
        for (var i = 1; i <= 5; i++) {
           form.options.push({num: i, tooltipLinks: [{},{},{}]}); 
        }

        optionForm = ich[templateName](form);
        $("#visualization-form").html(optionForm);
    };

    // accepts fieldset node, returns object of form values
    var parseInputs = function(fieldset) {
        var fieldsetData = {};
        $(fieldset).find("input:not([type='submit'])")
            .each(function() {
                var val = this.value;

                if (val !== "") {
                    //  if the only input with a value is the id, we don't actually want this section
                    if (this.name === 'id' && fieldsetData.hasOwnProperty('segmentName') === false) {
                        return;
                    }

                    fieldsetData[this.name] = val;
                }
            });

        return fieldsetData;
    };

    // gathers form input values and inserts JSON of values into textarea
    var generateJSON = function(event) {
        event.preventDefault();
        var submittedInfo = {"sections": []},
            inputs,
            fieldsetValues = {},
            output,
            timestamp,
            globalSettings = $('fieldset[data-visualization="global"]'),
            fieldsets = $('fieldset[data-visualization="data"]');

        // assemble visualization data
        fieldsets.each(function() {
            fieldsetValues = parseInputs(this);
            
            // if any of the inputs in this fieldset have values,
            // we want to preserve them
            // to play nice with D3, want to group all vis data into
            // one array
            if ($.isEmptyObject(fieldsetValues) === false) {
                submittedInfo.sections.push(fieldsetValues);
            }
        });

        // insert global options into object
        if (globalSettings) {
            submittedInfo['settings'] = parseInputs(globalSettings);
        } 

        timestamp = submittedInfo.settings.timestamp;

        // stringify and stick in the textarea
        // so ugly. can we template this?
        output = '<div class="data-vis">\n';
        output += '<svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" class="cfpb-data-visualization-' + timestamp + '"></svg>\n';
        output += '<div class="left cfpb-data-visualization-' + timestamp + '-index"><ul class="index"></ul></div>\n';
        output += "<script>$(document).ready(function(){CFPBDATA.push('";
        output += [JSON.stringify(submittedInfo)];
        output += "');});</script>\n";
        output += '<div class="cfpb-data-visualization-' + timestamp + ' right"></div></div>';
        $('#json-output').val(output);
    };
    
    // render visualization options
    var layoutList = ich.linkList(CFPBData.layoutTypes);
    $("#layout-types").append(layoutList);

    // event bindings
    $(".option-link").on('click', openForm);

    $("#visualization-form").on('submit', generateJSON);

});
