if (window.console) {
  console.log("Welcome to EKL Ironthrone UI Project. This is sample JavaScript!");
}

/* swap open/close side menu icons */
$('[data-toggle=collapse]').click(function(){
    // toggle icon
    $(this).find("i").toggleClass("glyphicon-chevron-right glyphicon-chevron-down");
});