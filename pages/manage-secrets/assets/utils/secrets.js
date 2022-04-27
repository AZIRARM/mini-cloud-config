//SECRETS

$('#selectApplicationId').on('change', function() {
    reloadSecrets(this.value);
});


reloadSecrets = ((application) => {
    $("#tableSecretsId").find("tr:gt(0)").remove();
    $.ajax({
        url: './environments/'+$('#selectEnvironmentId').find("option:selected").val()+'/applications/'+application+'/secrets',
        headers: {
           'Authorization': $('#authorizationKeyId').val()
        },
        type: 'GET',
        success: function(secrets) {

        console.log(JSON.stringify(secrets));
        secrets[0].flatMap(secret => {
            var genId = generateId(20);
            var selectedEnv = $('#selectEnvironmentId').find("option:selected").val();
            var selectedApp = $('#selectApplicationId').find("option:selected").val();

            $('#tableSecretsId tr:last').after('<tr  id="'+genId+'">'+
                '<td><input style="width:98%" type="text"  id="secretKey_'+genId+'" value="'+secret.key+'"/></td>'+
                '<td><input style="width:98%" type="text"  id="secretValue_'+genId+'" value="'+secret.value+'"/></td>'+
                '<td>'+
                    '<input style="width:98%" type="text"  id="secretDescription_'+genId+'" value="'+secret.description+'"/>'+
                    '<input value="'+selectedEnv+'" style="width:98%" type="hidden" id="secretSelectedEnv_'+genId+'"/>'+
                    '<input value="'+selectedApp+'" style="width:98%" type="hidden" id="secretSelectedApp_'+genId+'"/>'+
                    '<input value="'+secret.key+'" style="width:98%" type="hidden" id="secretKeyOrigin_'+genId+'"/>'+
                '</td>'+
                '<td style="text-align:center; margin:5x;">'+
                    '<i class="fa fa-save fa-2x" style="margin: 5px" onClick="saveSecret(\''+genId+'\',false)"></i>'+
                    '<i class="fa fa-trash fa-2x" style="margin: 5px" onClick="removeSecret(\''+secret.key+'\', false,\''+genId+'\')"></i>'+
                '</td>'+
            '</tr>');
            });
        }
    });
});

const addNewSecret = (() => {
  var selectedEnv = $('#selectEnvironmentId').find("option:selected").val();
  var selectedApp = $('#selectApplicationId').find("option:selected").val();
  if( (selectedEnv  && selectedEnv !== 'none') && (selectedApp && selectedApp !== 'none')) {
   var genId = generateId(20);
    $('#tableSecretsId tr:last').after('<tr  id=\''+genId+'\'tr>'+
            '<td><input style="width:98%" type="text" id="secretKey_'+genId+'"/></td>'+
            '<td><input style="width:98%" type="text" id="secretValue_'+genId+'"/></td>'+
            '<td><input style="width:98%" type="text" id="secretDescription_'+genId+'"/>'+
                '<input value="'+selectedEnv+'" style="width:98%" type="hidden" id="secretSelectedEnv_'+genId+'"/>'+
                '<input value="'+selectedApp+'" style="width:98%" type="hidden" id="secretSelectedApp_'+genId+'"/>'+
                '<input value="none" style="width:98%" type="hidden" id="secretKeyOrigin_'+genId+'"/>'+
            '</td>'+
            '<td style="text-align:center; margin:5x;">'+
                '<i class="fa fa-save fa-2x" style="margin: 5px" onClick="saveSecret(\''+genId+'\', true)"></i>'+
                '<i class="fa fa-trash fa-2x" style="margin: 5px" onClick="removeSecret(\'none\', true,\''+genId+'\')"></i>'+
            '</td>'+
        '</tr>');
   } else {
        alert("You need to select environment and application to create a new secret");
   }
});

function saveSecret(id, isNew) {
      var key = $('#secretKey_'+id).val();
      var originKey = $('#secretKeyOrigin_'+id).val();
      var value = $('#secretValue_'+id).val();
      var description = $('#secretDescription_'+id).val();
      var env = $('#secretSelectedEnv_'+id).val();
      var app = $('#secretSelectedApp_'+id).val();

      if(isNew) {
        if(key && key.length > 0 && env && env != null && env.length > 0 && app && app != null && app.length > 0) {

            var body = {
                "key": key,
                "value":value,
                "description":description
            };
           $.ajax({
                url: './environments/'+env+'/applications/'+ app+"/secrets/",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                type: 'POST',
                headers: {
                   'Authorization': $('#authorizationKeyId').val()
                },
                data:JSON.stringify(body),
                success: function(secret) {
                    alert("Secret: "+secret+", successfully saved");
                    reloadSecrets(app);
                }
            });


        } else {
            alert("To Create a new secret you need to fill secret key and select environment and application.");
        }
      } else {
            if(key && key.length > 0 && env && env != null && env.length > 0 && app && app != null && app.length > 0 && originKey && originKey !== null && originKey !== 'none') {

                var body = {
                    "key": key,
                    "value":value,
                    "description":description
                };
                $.ajax({
                    url: './environments/'+env+'/applications/'+ app+"/secrets/"+originKey,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    headers: {
                       'Authorization': $('#authorizationKeyId').val()
                    },
                    data: JSON.stringify(body),
                    type: 'PUT',
                    success: function(secret) {
                        alert("Secret : "+secret+", successfully updated");
                        return;
                    }
                });
            } else {
                alert("To Update secret you need to fill secret key and select environment and application.");
            }
      }
}

function removeSecret(secretKey, isNew, id) {

      var env = $('#secretSelectedEnv_'+id).val();
      var app = $('#secretSelectedApp_'+id).val();

    if ( confirm("Remove secret, Env: "+env+", Application: "+app+", Secret key: "+secretKey) && !isNew) {
         $.ajax({
            url: './environments/'+env+'/applications/'+ app+"/secrets/"+secretKey,
            headers: {
               'Authorization': $('#authorizationKeyId').val()
            },
            type: 'DELETE',
            success: function(secret) {
                alert("Secret : "+secret+", successfully deleted");
                $('#'+id).remove();
                return;
            }
        });
    } else if(isNew) {
      $('#'+id).remove();
    }
}
