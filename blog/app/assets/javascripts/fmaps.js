$('#fmaps_save_families_select').change(function() {
    $.ajax({
        type: "GET",
        url: "/scenarios/valid_scenarios",
        data: {
           "family_id":  $('#fmaps_save_families_select :selected').val()
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
        success: request_valid_fmaps,
        dataType: "script"
    });
});

$('#fmaps_scenarios_select').change(function() {
    request_valid_fmaps();
});

function request_valid_fmaps()
{
    $.ajax({
        type: "GET",
        url: "/fmaps/valid_fmaps",
        data: {
           "scenario_id":  $('#fmaps_scenarios_select :selected').val()
        },
        dataType: "script"
    });
}
