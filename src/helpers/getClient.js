function getClient(){
  var index = window.location.href.split("/").indexOf("clients")
return window.location.href.split("/")[index+1];
}

export default getClient;