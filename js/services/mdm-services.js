/** MDM Services **/
angular.module('mdmUI.services', [])
    .service('mdmBE',
        function() {
            var getPlayers = function () {
                return ['Dinesh', 'Abhinav', 'Deepak'];
            };
            return { getPlayers: getPlayers };
        }
    )
;
