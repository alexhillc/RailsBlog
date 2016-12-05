$('#form_family').submit(function() {
  document.getElementById("encrypted_name").value = CryptoJS.AES.encrypt(document.getElementById("name").value, 
                                           document.getElementById("password").value);
  document.getElementById("name").disabled = true;
  document.getElementById("username").disabled = true;
});

function decrypt_table() 
{
  var success = true;
  $('#families_table').DataTable().data().each( function (d) {
    try 
    {
      d[0] = CryptoJS.AES.decrypt(d[1], document.getElementById("decFamiliesIndex").value).toString(CryptoJS.enc.Utf8);
      if (d[0].length == 0)
      {
        $('#decModalFamiliesIndexLabel').html("Incorrect password, try again.").fadeIn(500).fadeOut(500).fadeIn(500);
        $('#decFamiliesIndex').val("").focus();
        success = false;
        return success;
      }
    }
    catch(err)
    {
      $('#decModalFamiliesIndexLabel').html("Incorrect password, try again.").fadeIn(500).fadeOut(500).fadeIn(500);
      $('#decFamiliesIndex').val("").focus();
      success = false;
      return success;
    }
  } );

  if (success == true)
  {
    var table = $('#families_table').DataTable();
    var data = table.data();
    table.clear();
    table.rows.add(data).draw();
    
    document.getElementById("families_table_div").className = "row"; 
    $('#decModalFamiliesIndex').modal('hide');
  }
}

function decrypt_form()
{
  try
  {
    document.getElementById("name").value = CryptoJS.AES.decrypt(document.getElementById("encrypted_name").value, document.getElementById("decFamilyEdit").value).toString(CryptoJS.enc.Utf8);
    if (document.getElementById("name").value.length == 0)
    {
      $('#decModalFamilyEditLabel').html("Incorrect password, try again.").fadeIn(500).fadeOut(500).fadeIn(500);
      $('#decFamilyEdit').val("").focus();
      return;
    }
  }
  catch(err)
  {
    $('#decModalLabel').html("Incorrect password, try again.").fadeIn(500).fadeOut(500).fadeIn(500);
    $('#decFamilyEdit').val("").focus();
    return;
  }
  
  document.getElementById("form_family").className = "row";
  $('#decModalFamilyEdit').modal('hide');
}


