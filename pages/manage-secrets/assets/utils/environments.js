//Environments

$.get( "./environments", function( data ) {
    $('#selectEnvironmentId').empty().append('<option value="none"> Select environment </option>');
    data.map(env=> {
        $("#selectEnvironmentId").append('<option value=\''+env+'\'>'+env+'</option>');
    });
});

$('#newEnvId').on('input', function() {
  $.get( "./environments/"+this.value, function( data ) {
    data.map(env => {
         $("#buttonAddNewEnvId").prop("disabled",true);
         return;
    });
  });

  $("#buttonAddNewEnvId").prop("disabled",false);
  return;
});
$('#buttonAddNewEnvId').on('click', function() {
      var selectedEnv = $('#newEnvId').val();
      var appDescription = $('#newEnvDescriptionId').val();
      var authenticationType =$('#newEnvAuthenticationTypeId').find("option:selected").val();
      var authenticationSecret = $('#newEnvAuthenticationSecretId').val();

    if(selectedEnv === null || selectedEnv.trim() <2) {
        alert('Env name must not empty and size >= 2');
    }
    else if(authenticationType === null) {
        alert('Authentication Type name must not empty');
    }
    else if(authenticationSecret === null || authenticationSecret.trim().length < 12) {
        alert('Secret name must not empty and size >= 12');
    } else {
        var body = {
            "description":          appDescription,
            "authenticationType":   authenticationType,
            "authenticationSecret": authenticationSecret
        };
       $.ajax({
            url: './environments/'+selectedEnv,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(body),
            type: 'POST',
            success: function(env) {
                alert("New environment : "+env+", successfully saved");
                window.location.reload(true);
                return;
            },
            error: function(error) {
                alert("Save failed : "+error);
                 window.location.reload(true);
                return;
            }
        });
    }
});
$('#buttonUpdateEnvId').on('click', function() {
      var selectedEnv = $('#selectEnvironmentId').find("option:selected").val();

      var envToUpdate = $('#updateEnvId').val();
      var appDescription = $('#updateEnvDescriptionId').val();
      var authenticationType =$('#updateEnvAuthenticationTypeId').find("option:selected").val();
      var authenticationSecret = $('#updateEnvAuthenticationSecretId').val();


    if( !selectedEnv || selectedEnv === null || selectedEnv === 'none') {
        alert('You must select environment to update');
    }
    else if(envToUpdate === null || envToUpdate.trim() <2) {
        alert('Env name must not empty and size >= 2');
    }
    else if(authenticationType === null) {
        alert('Authentication Type name must not empty');
    }
    else if(authenticationSecret === null || authenticationSecret.trim().length < 12) {
        alert('Secret name must not empty and size >= 12');
    } else {
        var body = {
            "environment":          envToUpdate,
            "description":          appDescription,
            "authenticationType":   authenticationType,
            "authenticationSecret": authenticationSecret
        };
       $.ajax({
            url: './environments/'+selectedEnv,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(body),
            type: 'PUT',
            success: function(env) {
                alert("Environment : "+env+", updated successfully");
                 window.location.reload(true);
                return;
            },
            error: function(error) {
                alert("Updated failed : "+error);
                 window.location.reload(true);
                return;
            }
        });
    }
});

$('#selectEnvironmentId').on('change', function() {
          $('#selectApplicationId').empty().append('<option value="none"> Select application </option>');
      $.get( "./environments/"+this.value+"/applications", function( data ) {
        data.map(applications=>
            applications.map(application => $("#selectApplicationId").append('<option value=\''+application+'\'>'+application+'</option>'))
        );
      });
    });
$('#selectEnvironmentId').on('change', function() {
     if(this.value && this.value !== 'none') {
        $('#buttonEnvironmentEditId').css('visibility', 'visible');
        $('#buttonEnvironmentRemoveId').css('visibility', 'visible');
        $('#buttonApplicationAddId').css('visibility', 'visible');
     } else {
        $('#buttonEnvironmentEditId').css('visibility', 'hidden');
        $('#buttonEnvironmentRemoveId').css('visibility', 'hidden');

        $('#selectApplicationEditId').css('visibility', 'hidden');
        $('#buttonApplicationRemoveId').css('visibility', 'hidden');

        $('#buttonApplicationAddId').css('visibility', 'hidden');

        $("#tableSecretsId").find("tr:gt(0)").remove();
     }
});
$('#buttonEnvironmentRemoveId').on('click', function() {
    var selectedEnv = $('#selectEnvironmentId').find("option:selected").val();
    if( ( selectedEnv && selectedEnv !== null && selectedEnv !== 'none' ) ){
        if ( confirm("Remove Environment: "+selectedEnv+" ? ") ) {
            $.ajax({
                    url: './environments/'+selectedEnv,
                    type: 'DELETE',
                    success: function(env) {
                        alert("Environment : "+selectedEnv+", Removed successfully");
                        window.location.reload(true);
                        return;
                    }
                });
        }
    } else {
        alert("To remove Environment from configuration you need to select environment");
    }
});
$('#selectEnvironmentId').on('click', function() {

});

$('#selectEnvironmentId').on('change', function() {
    $.ajax({
        url: './environments/'+this.value,
        type: 'GET',
        success: function(env) {
             $("#updateEnvId").val(env[0].environment);
             $("#updateEnvDescriptionId").val(env[0].description);
             $('#updateEnvAuthenticationTypeId option[value="'+env[0].authenticationType+'"]').prop('selected', true);
             $("#updateEnvAuthenticationSecretId").val(env[0].authenticationSecret);
            return;
        }
    });
});