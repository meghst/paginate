/** MDM Controllers **/
angular.module('mdmUI.controllers', ['mdmUI.services','ngTable','ngTableExport'])

    /** Base Controller **/

    .controller('dashboard', function ($scope, $http,ngTableParams,$filter) {
        $scope.showTable=false
        
        $scope.click =  function(value)
        {

            $scope.value=value
            $scope.url=mdmServer+'/'+value
            
            
            $scope.exclude=[]
            if(value=="locations")
            {
                $scope.exclude=["associations","attributes"]
                $scope.url+="?exclude="
                $scope.url+=$scope.exclude.join()
                
                
            }
            
            $http.get($scope.url)
                .success(function(data) {
                    $scope.entities=[]
                    if(data.length==0|| !data)
                    {
                        alert($scope.value+" was null")
                        temp=$scope.url.split(value)[0]
                        console.log("temp: ",temp)
                        value=temp.split(mdmServer)[1]
                        
                        
                    }
                    
                    $scope.showTable=true
                    $scope.entities = $scope.entities.concat(data)
                    
                    $scope.keys = Object.keys($scope.entities[0]);
                    
                    columns=[]

                    for(var key in $scope.keys)
                    {   
                        field=$scope.keys[key]

                        row={"title":field,"field":field,"visible":true,"sortable":field,"filter":{},"excluded":false}
                        row["filter"][field]="text"
                        //console.log(row)
                        columns.push(row);
                    }
                    for(var key in $scope.exclude)
                    {
                        field=$scope.exclude[key]

                        row={"title":field,"field":field,"visible":true,"excluded":true}
                        columns.push(row);
                    }

                    $scope.columns=columns
                    
                    $scope.title = "All " + value;
                    
                    $scope.tableParams = new ngTableParams({
                        page: 1,            // show first page
                        count: 10,           // count per page
                        filter:{}
                    }, {
                        total: $scope.entities.length, // length of data
                        getData: function($defer, params) {
                            var filterData=params.filter()?
                                                $filter('filter')($scope.entities, params.filter()) :
                                                $scope.entities;

                            var orderedData = params.sorting() ?
                                                $filter('orderBy')(filterData, params.orderBy()) :
                                                $scope.entities;
                            

                           params.total(orderedData.length);
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    });
                    
                });
            
        };
    })
    
;
