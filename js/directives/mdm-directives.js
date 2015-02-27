/** MDM Directives **/
angular.module('mdmUI.directives', [])

    .directive('dashboardMain', function() {
        var directive = {};
        directive.restrict = 'E';
        directive.templateUrl = "views/entitylist.html";
        return directive;
    })

;