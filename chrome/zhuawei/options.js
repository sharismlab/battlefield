function save_options() {
  var webserver = document.getElementById("webserver").value;
  var searchserver = document.getElementById("searchserver").value;
  var index = document.getElementById("index").value;

  var status = document.getElementById("status");
  localStorage["webserver"] = webserver;
  localStorage["searchserver"] = searchserver;
  localStorage["index"] = index;
  status.innerHTML = "选项已保存！权限已设置！";
  setTimeout(function() {
        status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var webserver = localStorage["webserver"];
  if (webserver) {
      document.getElementById("webserver").value = webserver;
  }
  var searchserver = localStorage["searchserver"];
  if (searchserver) {
      document.getElementById("searchserver").value = searchserver;
  }
  var index = localStorage["index"];
  if (index) {
      document.getElementById("index").value = index;
  }
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
