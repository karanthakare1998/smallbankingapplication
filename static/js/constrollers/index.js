var app = angular.module('COMMON', []);
angular.module('app',[]);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('..').endSymbol('..');
});

app.controller('INDEX~CONTROLLER', function($scope,$window,$http,$log,$rootScope) {
$scope.records={}
$scope.balanceamt=0;
$scope.recordnotfound=true;
$scope.showbalanceamt=false;
$scope.showfirst=true;
var page_name = $("#page_name").val();
var input_date = $("#input_date").val();
var input_ID = $("#input_ID").val();


$scope.INTIALIZE_PAGE =function(page_name,input_date){

if(page_name=='TRANSACTION' || page_name=='BALANCE' || page_name=='HOME'){
$scope.showfirst=true;
}else {
$scope.showfirst=false;
  if(input_ID==0){
    FETCH_ADDED_DATA();
  }else{
    FETCH_ADDED_DATA_USEING_ID(input_ID)
  }

}





  if(page_name=='TRANSACTION' || page_name=='BALANCE'){
    Notiflix.Loading.Pulse('Please wait ...');
    $http.post("/FETCH_TRANSACTION_DATA.do",input_date).
    success(function(results) {
      if(Object.keys(results).length>0){
        $scope.records=results;

        if(page_name=='BALANCE'){
          for (let value of Object.values(results)) {
              $scope.balanceamt=value['Balance AMT'];
              $scope.accno= value['Account No'];
          }
          mesg='Hey user, Balance amount for account no. : ' +  $scope.accno + ' on '+input_date+' is Rs.' +$scope.balanceamt;
          Notiflix.Report.Success('Successfully Fetched',mesg,'Okey');
          $scope.showbalanceamt=true;
        }


        Notiflix.Notify.Success('Data Found !');
        Notiflix.Loading.Remove();
        $scope.recordnotfound=false;
      }else{
        Notiflix.Notify.Failure('No Record Found !');
        Notiflix.Loading.Remove();
        $scope.recordnotfound=true;
        $scope.records={}
      }
    }).
    error(function(error) {
    console.log("Errro--> FILTER_DATE_WISE");
    Notiflix.Notify.Failure('Invalid Date Format !');
    Notiflix.Loading.Remove();
    $scope.recordnotfound=true;
  });
  }
}
$scope.INTIALIZE_PAGE(page_name,input_date);


$scope.SHOW_ALL_ACC_DATA =function(){
  $scope.showbalanceamt=false;
  Notiflix.Loading.Pulse('Please wait ...');
  $http({
  method : "GET",
  url : "/SHOW_ALL_ACC_DATA.do",
   }).then(function mySuccess(response) {
           if(Object.keys(response.data).length>0){
            $scope.records=response.data;
            Notiflix.Notify.Success('Data Fetch Successfully');
            Notiflix.Loading.Remove();
            $scope.recordnotfound=false;
          }else{
            Notiflix.Notify.Failure('No Record Found.');
            Notiflix.Loading.Remove();
            $scope.recordnotfound=true;
            $scope.records={}
          }
   }, function myError(response) {
          console.log("error in all account data.");
          Notiflix.Notify.Failure('Error !');
          Notiflix.Loading.Remove();
          $scope.recordnotfound=true;
   });
  }


  $scope.FILTER_DATE_WISE=function(){
  $scope.showbalanceamt=false;

    if(typeof $scope.selecteddate  === 'undefined' ){
          Notiflix.Confirm.Show('Oops !','Please select date.','Try Again');
    }else {
    Notiflix.Loading.Pulse('Please wait ...');
    $http.post("/FILTER_DATE_WISE.do",dateconvert($scope.selecteddate)).
    success(function(results) {
      if(Object.keys(results).length>0){
        $scope.records=results;
        Notiflix.Notify.Success('Data Found !');
        Notiflix.Loading.Remove();
        $scope.recordnotfound=false;
      }else{
        Notiflix.Notify.Failure('No Record Found.');
        Notiflix.Loading.Remove();
        $scope.recordnotfound=true;
        $scope.records={}
      }
    }).
    error(function(error) {
    console.log("Errro--> FILTER_DATE_WISE");
    Notiflix.Notify.Failure('Error !');
    Notiflix.Loading.Remove();
    $scope.recordnotfound=true;
  });
  }

  }


  $scope.SubmitForm=function(){

    $scope.accform={}
    $scope.accform.accno=$scope.accno;
    $scope.accform.date=dateconvert($scope.date) ;
    $scope.accform.valuedate=dateconvert($scope.valuedate) ;
    $scope.accform.details=$scope.details;
    $scope.accform.WA=$scope.WA;
    $scope.accform.DA=$scope.DA;
    $scope.accform.BalanceAmt=$scope.BalanceAmt;


    if($scope.SubmitFormValidation($scope.accform)){
      $http.post("/SUBMIT_FORM.do",$scope.accform).
      success(function(results) {
        if(results.issuccess){
         Notiflix.Report.Success('Successfully done!!',results.mesg,'Okey');
         FETCH_ADDED_DATA();
        }else{
          Notiflix.Report.Warning('Failed !!! ',results.mesg,'Okey');
        }
      }).
      error(function(error) {
        console.log("Errro--> SUBMIT_FORM");
    });
    }
  }

  $scope.SubmitFormValidation=function( accform){
    if(typeof accform  === undefined  ){
    return false
    }else
  if(typeof accform.accno === 'undefined'  ){
  return false
  }else  if(typeof accform.date === 'undefined' ){
  return false
  }else  if(typeof accform.valuedate === 'undefined' ){
  return false
  }else  if(typeof accform.details === 'undefined'  ){
  return false
  }else  if(typeof accform.WA === 'undefined'  ){
  return false
  }else  if(typeof accform.DA === 'undefined'  ){
  return false
  }else  if(typeof accform.BalanceAmt === 'undefined' ){
  return false
  }
  return true;

  }

 function FETCH_ADDED_DATA(){
    $http({
    method : "GET",
    url : "/FETCH_ADDED_DATA.do",
     }).then(function mySuccess(response) {
             if(Object.keys(response.data).length>0){
              $scope.records=response.data;
              $scope.recordnotfound=false;
            }
     }, function myError(response) {
            console.log("error in FETCH_ADDED_DATA");
            $scope.recordnotfound=true;
     });
    }

  function FETCH_ADDED_DATA_USEING_ID(ID){
    $http.post("/FETCH_ADDED_DATA_USEING_ID.do",ID).
    success(function(results) {
      if(Object.keys(results).length>0){
        Notiflix.Notify.Success('Data Found !');
        $scope.records=results;
        $scope.recordnotfound=false;
      }else{
          Notiflix.Notify.Failure('No Record Found.');
          $scope.recordnotfound=true;
      }
    }).
    error(function(error) {
      console.log("Errro--> FETCH_ADDED_DATA_USEING_ID");
  });
      }

  function dateconvert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }


  (function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }

          form.classList.add('was-validated')
        }, false)
      })
  })()

}); //end app.controller
