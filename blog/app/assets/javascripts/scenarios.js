$('#scenarios_families_select').change(function() {
    $.ajax({
        type: "GET",
        url: "/scenarios/valid_scenarios",
        data: {
           "family_id":  $('#scenarios_families_select :selected').val()
        },
        dataType: "script"
    });
});

$('#fmaps_families_select').change(function() {
    $.ajax({
        type: "GET",
        url: "/scenarios/valid_scenarios",
        data: {
           "family_id":  $('#fmaps_families_select :selected').val()
        },
        dataType: "script"
    });
});
