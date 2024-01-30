$(function () {
  $(".js_menu_level1").on("click", function () {

    if (!$(this).hasClass("l1_selected")) {
      var elementToShow = ".js_level2_list" + getListNumberFromClass($(this), "js_level1_list");
      $(".l1_selected").removeClass("l1_selected");
      $(this).addClass("l1_selected");
      $(".l2_list_selected").removeClass("l2_list_selected");
      $(elementToShow).addClass("l2_list_selected");

      if ($(this).hasClass("js_level2_trigger")) {
        setBodyPadding('two_level_padding');
      }

    } else {
      $(".l1_selected").removeClass("l1_selected");
      $(".l2_list_selected").removeClass("l2_list_selected");

      if ($('body').hasClass("two_level_padding")) {
        setBodyPadding('one_level_padding');
      }
    }
  });

  function getListNumberFromClass(element, stringToSearch) {
    var classString = element[0].className;
    var indexOfListNumber = classString.indexOf(stringToSearch) + stringToSearch.length;
    return classString.substr(indexOfListNumber, 1);
  }

  function setBodyPadding(padding) {
    if (padding === 'one_level_padding') {
      $("body")
        .removeClass("two_level_padding")
        .addClass("one_level_padding");
    } else {
      $("body")
        .removeClass("one_level_padding")
        .addClass("two_level_padding");
    }
  }
});
