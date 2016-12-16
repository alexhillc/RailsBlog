var old_password;
var new_password;

function begin_password_update() 
{
  old_password = document.getElementById("password").value;
  new_password = document.getElementById("newpassword").value;

  $.ajax({
      type: "POST",
      url: "/accountmanagement/updatepassword",
      data: {
         password: document.getElementById("password").value,
         newpassword: document.getElementById("newpassword").value,
         newpassword2: document.getElementById("newpassword2").value
      },
      success: function(json) {
        if (json.families && json.fmaps)
        {
          decrypt_json(json);
          encrypt_json(json);
          update_server_data(json);
        }
         
        window.location.href = '/accountmanagement/updatepassword'
     },
     dataType: "json"
  });

  return false;
}

function decrypt_json(json)
{
  for (var i=0; i < json.families.length; i++)
  {
    json.families[i].encrypted_name = CryptoJS.AES.decrypt(json.families[i].encrypted_name, old_password).toString(CryptoJS.enc.Utf8);
  }

  for (var i=0; i < json.fmaps.length; i++)
  {
    json.fmaps[i].json = CryptoJS.AES.decrypt(json.fmaps[i].json, old_password).toString(CryptoJS.enc.Utf8);
  }
}

function encrypt_json(json)
{
  for (var i=0; i < json.families.length; i++)
  { 
    json.families[i].encrypted_name = CryptoJS.AES.encrypt(json.families[i].encrypted_name, new_password).toString();
  }

  for (var i=0; i < json.fmaps.length; i++)
  {
    json.fmaps[i].json = CryptoJS.AES.encrypt(json.fmaps[i].json, new_password).toString();
  }
}

function update_server_data(json)
{
    $.ajax({
      type: "POST",
      url: "/accountmanagement/updateuserdata",
      data: {
         password: new_password,
         json: json
      },
     dataType: "script"
  });
}
