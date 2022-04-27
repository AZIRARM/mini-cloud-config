//Applications


$('#selectApplicationId').on('change', function() {
    var selectedEnv = $('#selectEnvironmentId').find("option:selected").val();

    $.ajax({
        url: './environments/'+selectedEnv+'/applications/'+this.value,
        headers: {
           'Authorization': $('#authorizationKeyId').val()
        },
        type: 'GET',
        success: function(response) {
             $("#updateAppId").val(response.name);
             $("#updateAppDescriptionId").val(response.description);
            return;
        }
    });
});
$('#selectApplicationId').on('change', function() {
     if(this.value && this.value !== 'none') {
        $('#selectApplicationEditId').css('visibility', 'visible');
        $('#buttonApplicationRemoveId').css('visibility', 'visible');
     } else {
        $('#selectApplicationEditId').css('visibility', 'hidden');
        $('#buttonApplicationRemoveId').css('visibility', 'hidden');
     }
});



$('#newAppId').on('input', function() {
    $.ajax({
        url: './environments/'+this.value,
        headers: {
           'Authorization': $('#authorizationKeyId').val()
        },
        type: 'GET',
        success: function(app) {
            $("#buttonAddNewAppId").prop("disabled", (app && app !== null && app.length > 0) ? true: false);
            return;

        }
    });

  $("#buttonAddNewAppId").prop("disabled",false);
  return;
});

$('#buttonAddNewAppId').on('click', function() {
      var selectedEnv = $('#selectEnvironmentId').find("option:selected").val();
      var appName = $('#newAppId').val();
      var appDescription = $('#newAppDescriptionId').val();
    if( selectedEnv && selectedEnv !== null && selectedEnv !== 'none'){
        var body = {
            "name":   appName,
            "description":  appDescription
        };
       $.ajax({
            url: './environments/'+selectedEnv+'/applications',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            headers: {
               'Authorization': $('#authorizationKeyId').val()
            },
            data: JSON.stringify(body),
            success: function(app) {
                alert("New Application : "+app+", added on environment : "+selectedEnv);
                 $("#selectApplicationId").append('<option value=\''+app+'\'>'+app+'</option>');
                 $('#selectApplicationEditId').css('visibility', 'hidden');
                 $('#buttonApplicationRemoveId').css('visibility', 'hidden');
                 $('#modalAddApp').modal('hide');
                return;
            }
        });
    } else {
        alert("Select an environment to add a new Application");
    }
});
$('#buttonUpdateAppId').on('click', function() {
      var selectedEnv = $('#selectEnvironmentId').find("option:selected").val();
      var appName = $('#updateAppId').val();
      var appDescription = $('#updateAppDescriptionId').val();
    if( selectedEnv && selectedEnv !== null && selectedEnv !== 'none'){
        var body = {
            "name":   appName,
            "description":  appDescription
        };
       $.ajax({
            url: './environments/'+selectedEnv+'/applications/'+ appName,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            type: 'PUT',
            headers: {
               'Authorization': $('#authorizationKeyId').val()
            },
            data: JSON.stringify(body),
            success: function(app) {
                alert("Application : "+app+", successfully updated");
                $('#modalUpdateApp').modal('hide');
                return;
            }
        });
    } else {
        alert("Select an environment to add a new Application");
    }
});
$('#buttonApplicationRemoveId').on('click', function() {
    var selectedEnv = $('#selectEnvironmentId').find("option:selected").val();
    var selectedApp = $('#selectApplicationId').find("option:selected").val();
    if( ( selectedEnv && selectedEnv !== null && selectedEnv !== 'none' ) && (  selectedApp && selectedApp !== null && selectedApp !== 'none' ) ){
        if ( confirm("Remove Application: "+selectedApp+" from environment: "+selectedEnv + " ? ") ) {
            $.ajax({
                    url: './environments/'+selectedEnv+'/applications/'+ selectedApp,
                    headers: {
                       'Authorization': $('#authorizationKeyId').val()
                    },
                    type: 'DELETE',
                    success: function(app) {
                        alert("Application : "+selectedApp+", Removed successfully on environment : "+selectedEnv);
                        $("#selectApplicationId option[value='"+selectedApp+"']").remove();
                        $('#selectApplicationEditId').css('visibility', 'hidden');
                        $('#buttonApplicationRemoveId').css('visibility', 'hidden');

                        $("#tableBodySecretsId").empty();

                        return;
                    }
                });
        }
    } else {
        alert("To remove application from configuration you need to select environment and application");
    }
});