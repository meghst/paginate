
/** MDM Controllers **/
angular.module('mdmUI.controllers', ['mdmUI.services', 'ngTable', 'ngTableExport'])

/** Base Controller **/

.controller('dashboard', function($scope, $http, ngTableParams, $filter) {

    $scope.showTable = false
    $scope.history = []
    $scope.entities = []
    $scope.data = []
    $scope.page_num = 2; // hard coded for now since page 1 takes longer to load
    $scope.total_pages = 0;
    $scope.per_page = 10;


    $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        count: 10, // count per page
        

    }, {
        total: $scope.data.length, // length of data

        getData: function($defer, params) {

            if ($scope.history.length==1 && params.page() * params.count() >= $scope.entities
                .length) {
                $scope.fetchPartialData()
            };
            
            params.total($scope.data.length);

            $defer.resolve($scope.data.slice((params.page() - 1) * params.count(),
                params.page() * params.count()));
        },
        $scope: { $data: {} }
    });

    $scope.back = function() {

        if($scope.history.length==1)
        {
            window.location.reload()
            return
        }
        $scope.data = $scope.history.pop()[1]
        $scope.generateTable()

    }

    $scope.chooseFile=function(name)
    {
        console.log("here")
        var chooser = $(name);
        console.log(name)
        chooser.change(function(evt) {
          console.log($(this).val());
        });

        chooser.trigger('click');  
    }
    $scope.download=function()
    {
        // function chooseFile(name)
        // {
        //     var chooser = document.querySelector(name);
        //     chooser.addEventListener("change", function(evt) {
        //     console.log(this.value);
        //     }, false);

        //     chooser.click();  
        // }
        // chooseFile('#fileDialog');
        // //csv.generate($event, "my-file.csv

          $scope.chooseFile('#fileDialog');    
    }

    $scope.fetchPartialData = function() {

        if ($scope.page_num < $scope.total_pages) {

            $scope.full_url = $scope.url + "?per_page=" + $scope.per_page + "&page=" + $scope.page_num

            $http.get($scope.full_url)
                .success(function(data) {

                    $scope.page_num += 1
                    data = data["data"]
                    $scope.entities = $scope.entities.concat(data)
                    $scope.data = angular.copy($scope.entities)
                    $scope.tableParams.reload()
                });
        }

    }

    $scope.generateTable = function() {

        $scope.keys = Object.keys($scope.data[0]);
        columns = []

        for (var key in $scope.keys) {
            field = $scope.keys[key]

            if (($scope.data.length && typeof($scope.data[0][field]) == "object") || (typeof(
                    $scope.data[field]) == "object")) {
                row = {
                    "title": field,
                    "field": field,
                    "visible": true,
                    "child": true
                }
            } else {
                row = {
                    "title": field,
                    "field": field,
                    "visible": true,
                    "child": false
                }
            }
            columns.push(row);
            $scope.tableParams.reload()
        }

        $scope.columns = columns
        $scope.tableParams.reload()
        
    }

    $scope.getChild = function(data, field) {
        $scope.history.push([data['id'] + "(" + field + ")", $scope.data])
        $scope.data = data[field]
        if ($scope.data.length == undefined) {
            temp = angular.copy($scope.data)
            $scope.data = []
            $scope.data.push(temp)
            $scope.tableParams.reload()
        }
        if ($scope.data.length == 0) {
            $scope.data = []
            $scope.tableParams.reload()
            return
        }
        $scope.generateTable()
    }


    $scope.click = function(value) {
        $scope.value = value;
        $scope.url = mdmServer + '/' + value;
        $scope.entities = []; //parent dataset
        $scope.columns = [];
        $scope.exclude = []
        $scope.data = []; //current data


        //hardcoded for locations
        if (value == "locations") {
            $scope.page_num = 2;
            $scope.title=value
            $scope.full_url = $scope.url + "?per_page=" + $scope.per_page + "&page=" + $scope.page_num
            $scope.page_num += 1

        }
       
        $http.get($scope.full_url)
            .success(function(data) {

                //if empty list is returned
                if (data.length == 0 || !data) {
                    $scope.showTable = true
                    $scope.entities = []

                    return

                }

                $scope.showTable = true

                //if first page, get total
                if ($scope.page_num != 0) {
                    $scope.total = data["total"]
                    data = data["data"]
                    $scope.total_pages = $scope.total / 10

                }

                //add new partial data to entities
                $scope.entities = $scope.entities.concat(data)
                $scope.data = angular.copy($scope.entities);
                $scope.generateTable()
                $scope.history.push([value, $scope.data])
                //reload table
                if ($scope.tableParams) {
                    $scope.tableParams.reload()
                }

            });

    };
})

;