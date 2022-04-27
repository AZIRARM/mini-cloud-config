//Applications


$('#selectApplicationId').on('change', function() {
    var selectedEnv = $('#selectEnvironmentId').find("option:selected").val();

    $.ajax({
        url: './environments/'+selectedEnv+'/applications/'+this.value,
        type: 'GET',
        success: function(response) {
             $("#updateAppId").val(response.name);
             $("#updateAppDescriptionId").val(response.description);
            return;
        }
    });
});

$('#newAppId').on('input', function() {
  $.get( "./environments/"+this.value, function( data ) {
    data.map(env => {
         $("#buttonAddNewAppId").prop("disabled",true);
         return;
    });
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
            data: JSON.stringify(body),
            success: function(app) {
                alert("New Application : "+app+", added on environment : "+selectedEnv);
                 $("#selectApplicationId").append('<option value=\''+app+'\'>'+app+'</option>')
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
            data: JSON.stringify(body),
            success: function(app) {
                alert("Application : "+app.name+", successfully updated");
                return;
            }
        });
    } else {
        alert("Select an environment to add a new Application");
    }
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
$('#buttonApplicationRemoveId').on('click', function() {
    var selectedEnv = $('#selectEnvironmentId').find("option:selected").val();
    var selectedApp = $('#selectApplicationId').find("option:selected").val();
    if( ( selectedEnv && selectedEnv !== null && selectedEnv !== 'none' ) && (  selectedApp && selectedApp !== null && selectedApp !== 'none' ) ){
        if ( confirm("Remove Application: "+selectedApp+" from environment: "+selectedEnv + " ? ") ) {
            $.ajax({
                    url: './environments/'+selectedEnv+'/applications/'+ selectedApp,
                    type: 'DELETE',
                    success: function(app) {
                        alert("Application : "+selectedApp+", Removed successfully on environment : "+selectedEnv);
                        window.location.reload(true);
                        return;
                    }
                });
        }
    } else {
        alert("To remove application from configuration you need to select environment and application");
    }
});