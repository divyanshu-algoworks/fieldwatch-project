window.onload = function(){
    if (document.getElementById('js_alert_container')) {
        document.getElementById('js_close_alert').addEventListener("click", function(){
            document.getElementById('js_alert_container').style.display = 'none';
        });
    }
};