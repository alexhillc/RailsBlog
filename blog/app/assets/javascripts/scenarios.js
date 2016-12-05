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

$('#fmaps_save_as_families_select').change(function() {
    $.ajax({
        type: "GET",
        url: "/scenarios/valid_scenarios",
        data: {
           "family_id":  $('#fmaps_save_as_families_select :selected').val()
        },
        dataType: "script"
    });
});


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

function decrypt_options()
{
  var success = true;
  try
  {
    $('#scenarios_families_select option').each(function(){
      var decrypt = CryptoJS.AES.decrypt($(this).text(), document.getElementById("decScenariosIndex").value).toString(CryptoJS.enc.Utf8);
      if (decrypt.length == 0)
      {
        $('#decModalScenariosIndexLabel').html("Incorrect password, try again.").fadeIn(500).fadeOut(500).fadeIn(500);
        $('#decScenariosIndex').val("").focus();
        success = false;
        return success;
      } else
      {
        $(this).text(decrypt);
      }
    });    
  }
  catch(err)
  {
    $('#decModalScenariosIndexLabel').html("Incorrect password, try again.").fadeIn(500).fadeOut(500).fadeIn(500);
    $('#decScenariosIndex').val("").focus();
    success = false;
    return success;
  }

  if (success == true) {
    document.getElementById("form_family_options").className = "row";
    document.getElementById("scenarios_table_div").className = "row";
    $('#decModalScenariosIndex').modal('hide');
  }
}

function decrypt_form()
{
  var success = true;
  try
  {
    $('#scenarios_form_families_select option').each(function(){
      var decrypt = CryptoJS.AES.decrypt($(this).text(), document.getElementById("decScenarioForm").value).toString(CryptoJS.enc.Utf8);
      if (decrypt.length == 0)
      {
        $('#decModalScenarioFormLabel').html("Incorrect password, try again.").fadeIn(500).fadeOut(500).fadeIn(500);
        $('#decScenarioForm').val("").focus();
        success = false;
        return success;
      } else
      {
        $(this).text(decrypt);
      }
    });
  }
  catch(err)
  {
    $('#decModalScenarioFormLabel').html("Incorrect password, try again.").fadeIn(500).fadeOut(500).fadeIn(500);
    $('#decScenarioForm').val("").focus();
    success = false;
    return success;
  }

  if (success == true) {
    document.getElementById("form_family_options").className = "row";
    $('#decModalScenarioForm').modal('hide');
  }
}
