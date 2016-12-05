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

function decrypt_options()
{
  var success = true;
  try
  {
    $('#fmaps_families_select option').each(function(){
      var decrypt = CryptoJS.AES.decrypt($(this).text(), document.getElementById("decFmapsIndex").value).toString(CryptoJS.enc.Utf8);
      if (decrypt.length == 0)
      {
        $('#decModalFmapsIndexLabel').html("Incorrect password, try again.").fadeIn(500).fadeOut(500).fadeIn(500);
        $('#decFmapsIndex').val("").focus();
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
    $('#decModalFmapsIndexLabel').html("Incorrect password, try again.").fadeIn(500).fadeOut(500).fadeIn(500);
    $('#decFmapsIndex').val("").focus();
    success = false;
    return success;
  } 
    
  if (success == true) {
    document.getElementById("fmaps_select_options").className = "row";
    document.getElementById("load_fmaps_table_div").className = "row";
    $('#decModalFmapsIndex').modal('hide');
  } 
}  
