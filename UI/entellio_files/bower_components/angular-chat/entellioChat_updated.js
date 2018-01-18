var entellioBaseUrl = "http://entellio.techmahindra.com";
//var entellioBaseUrl = "https://entellio.techmahindra.com";
//var entellioBaseUrl = "http://10.10.113.253:9200";
var botId = 'bb9f766678e182d7c638bafd';
var botUserName = "Telenetbot_5o2w";
var botPassword = "SUEKEVCK";
var userNameReplaceKeyword = '<Username>';
var userName = "John";
var redirectToURLKeyword = "REDIRECTTOURL";
var redirectURL = "<a target=\"_blank\" href=\"https://join.macmillanhighered.com/#/findatitlecoursepage/37199\">here</a>"
var redirectURL2 = "https://join.macmillanhighered.com/#/findatitlecoursepage/37199"


var chatToken;
var chatEntellioPrefix = " <div class='chat_message_wrapper'><div class='chat_user_avatar'><img src='entellio_files/images/entillio.png' class='md-user-image'></div><ul class='chat_message'><li><p>";
var chatUserPrefix = " <div class='chat_message_wrapper chat_message_right'><div class='chat_user_avatar'><img src='entellio_files/images/avatar.png' class='md-user-image'></div><ul class='chat_message'><li><p>";
var chatSuffix = " </p></li></ul></div>";
var spinner_loader= "<div class='spn_hol''><div class='spinner' style='display:block'><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div></div>"
var entellioURL = entellioBaseUrl + '/chat/' + botId + '/restapi/';
var chatStoreUserPrefix = "<USER>: ";
var chatStoreEntellioPrefix = "<ENTELLIO>: ";
 function submit1(){
    alert("The paragraph was clicked.");
    };

var chatApp = angular.module("chatApp", []);
chatApp.controller("chatController", function($scope, $location, $window, $filter, $rootScope) {
    var count=1;
	$scope.chatConversation = (localStorage.getItem('entellioChatConversation') != null)?
								JSON.parse(localStorage.getItem('entellioChatConversation')) : [];
	
	var isChatInProgress = (localStorage.getItem('entellioOngoingChat') != null)? true : false;
	chatToken = (localStorage.getItem('chatToken') != null)? localStorage.getItem('chatToken') : '';

    /*SUBMIT CHAT *****/
    $scope.submit = function() {
         var addloader="<div id='div"+count+"'></div>";
    $(".spinner").show();
        var textEntered = $('#Chat').val();
        if (textEntered != "" && textEntered.trim() != "") {
            $("#chatSession").append(chatUserPrefix + textEntered + chatSuffix+addloader);
			var chat = chatStoreUserPrefix + textEntered;
            $scope.chatConversation.push(chat);
            localStorage.setItem('entellioChatConversation', JSON.stringify($scope.chatConversation));
             $("#div"+count).append(spinner_loader);
        count++;
        } else {
            textEntered = '';
            if(!$scope.ongoingChat){
               textEntered = 'hi';
            }
        }

        if (textEntered != '') {
            var params = '{"searchstring":"' + textEntered + '","input_type":"text"}';
			var tokenHeader = '{"token":"' + chatToken + '"}';
            $.ajax({
                url: entellioURL,
				beforeSend: function(request) {     request.setRequestHeader("token", chatToken);  },
                dataType: 'text',
                type: 'post',
                contentType: 'application/json',
                data: params,
                success: function(data, textStatus, jQxhr) {
                  if (data != '' && !data.match("<[^>]*script")) {
                    var response = JSON.parse(data);
					var responseMessageArr = response.data.message;
                    var responseText ="";
					for(var i=0; i<responseMessageArr.length; i++) {
						responseText = responseText + responseMessageArr[i].message_data;
					}					
					
					if(responseText.indexOf(userNameReplaceKeyword) > 0) {
                		responseText = responseText.replace(userNameReplaceKeyword, userName);
                	}
					if(responseText.indexOf(redirectToURLKeyword)  > 0) {
                		responseText = responseText.replace(redirectToURLKeyword, redirectURL);
							setTimeout('window.open(redirectURL2, \'_blank\')', 5000);
							//var popup = window.open(redirectURL2, '_blank');
							//popup.blur();
							//window.focus();
                		//return;//
                	}
                    var conversation_id = response.data.conversation;
					if(!$scope.ongoingChat) {
						$scope.ongoingChat = true;
						localStorage.setItem('entellioOngoingChat', 'true');
					}
                    setTimeout(function(){
                        $(".spinner").hide();
                        $(".spn_hol").remove();
						var chat = chatStoreEntellioPrefix + responseText;
                        $scope.chatConversation.push(chat);
                        localStorage.setItem('entellioChatConversation', JSON.stringify($scope.chatConversation));

                        $('#chatSession').append(chatEntellioPrefix + responseText + chatSuffix);
                        $("#chatSession").scrollTop($("#chatSession")[0].scrollHeight);

                        if (conversation_id!= 'None' && conversation_id!= null){

                        var addloader="<div id='div"+count+"'></div>";
                        $(".spinner").show();
                        var textEntered = $('#Chat').val();
                        $("#chatSession").append(addloader);
                        $("#div"+count).append(spinner_loader);
                        count++;

                        callbackConversation(conversation_id);
                    }
                    }, 1000);
                    // checking for conversation
                  }

                },
                error: function(jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });

        }
        $("#Chat").val('');
        $("#Chat").focus();
        $("#chatSession").scrollTop($("#chatSession")[0].scrollHeight);
    };
    $("#Chat").focus();
	$scope.getChatToken = function() {
		var loginparams = '{"username":"' + botUserName + '", "password":"' + botPassword + '"}';
		$.ajax({
			url: entellioBaseUrl + '/bot/'+ botId +'/login_user_api/',
			dataType: 'text',
			type: 'post',
			contentType: 'application/x-www-form-urlencoded',
			data: loginparams,
			success: function(data, textStatus, jQxhr) {
				//login
				chatToken = JSON.parse(data).token;
				console.log(chatToken);
				localStorage.setItem('chatToken', chatToken);
				$scope.submit();
			},
			error: function(jqXhr, textStatus, errorThrown) {
				console.log(errorThrown);
			}
		});
	};
    function callbackConversation(conversation_id){
		var params = '{"searchstring":"' + conversation_id +  '","input_type":"text"}';
		var tokenHeader = '{"token":"' + chatToken + '"}';
	   // alert("hello ");
			$.ajax({
                url: entellioURL,
				beforeSend: function(request) {     request.setRequestHeader("token", chatToken);  },
                dataType: 'text',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: params,
                success: function(data, textStatus, jQxhr) {
                  if (data != '' && !data.match("<[^>]*script")) {
                    setTimeout(function(){
                        var response = JSON.parse(data);
                        //var responseText = response.message;
						var responseMessageArr = response.data.message;
						var responseText ="";
						for(var i=0; i<responseMessageArr.length; i++) {
							responseText = responseText + responseMessageArr[i].message_data;
						}					
						
						var conversation_id = response.data.conversation;
						if(responseText.indexOf("Send to Customer") > 0){                            
                            setTimeout('window.open("./contract.htm", \'_self\')', 3000);
						}
						if(responseText.indexOf(userNameReplaceKeyword) > 0) {
							responseText = responseText.replace(userNameReplaceKeyword, userName);
						}
						if(responseText.indexOf(redirectToURLKeyword)  > 0) {
							responseText = responseText.replace(redirectToURLKeyword, redirectURL);
							setTimeout('window.open(redirectURL2, \'_blank\')', 5000);
							//var popup = window.open(redirectURL2, '_blank');
							//popup.blur();
							//window.focus();
                		//return;//
						}
                        //$(".spinner").hide();
                        $(".spn_hol").remove();
                        $('#chatSession').append(chatEntellioPrefix + responseText + chatSuffix);
                        $("#chatSession").scrollTop($("#chatSession")[0].scrollHeight);
						if(!$scope.ongoingChat) {
							$scope.ongoingChat = true;
							localStorage.setItem('entellioOngoingChat', 'true');
						}
						var chat = chatStoreEntellioPrefix + responseText;
                        $scope.chatConversation.push(chat);
                        localStorage.setItem('entellioChatConversation', JSON.stringify($scope.chatConversation));
						
						if (conversation_id!= 'None' && conversation_id!= null){

                        var addloader="<div id='div"+count+"'></div>";
                        $(".spinner").show();
                        var textEntered = $('#Chat').val();
                        $("#chatSession").append(addloader);
                        $("#div"+count).append(spinner_loader);
                        count++;

                        callbackConversation(conversation_id);
                    }					
						
                    }, 1000);
                  }
                },
                error: function(jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
    }
	
	$scope.goToChatSupport = function() {
		localStorage.removeItem('entellioOngoingChat');
		localStorage.removeItem('entellioChatConversation');
		localStorage.removeItem('chatToken');
	};
	
	$scope.chatHistoryDisplay = function(conversation) {
		//read chat and display in chat bot
		if(document.getElementById('chatSession') != null && angular.isDefined(document.getElementById('chatSession'))) {
			document.getElementById("chatSession").innerHTML = "";
			var chat;
			for(var i=0; i<conversation.length; i++) {
				chat = conversation[i];
				if(chat.indexOf(chatStoreEntellioPrefix) == 0) {
					chat = chat.replace(chatStoreEntellioPrefix, chatEntellioPrefix) + chatSuffix;
				} else if(chat.indexOf(chatStoreUserPrefix) == 0) {
					chat = chat.replace(chatStoreUserPrefix, chatUserPrefix) + chatSuffix;
				}
				$('#chatSession').append(chat);
			}
			$("#chatSession").scrollTop($("#chatSession")[0].scrollHeight);
			document.getElementById("Chat").disabled = false;
		}
	};
	
	if(isChatInProgress && !$scope.ongoingChat) {
		$scope.chatHistoryDisplay($scope.chatConversation);
	}
	if(chatToken == '') {
		$scope.getChatToken();
	}
});

//Uncomment below to clear chat history on window refresh/close
/*window.onbeforeunload = function (e) {
	alert("cleaning chat history on window close");
    localStorage.removeItem('entellioOngoingChat');
	localStorage.removeItem('entellioChatConversation');
	localStorage.removeItem('chatToken');
};*/