angular.module("App")
    .controller("MainController", MainController);

MainController.$inject = ["MainService", "$timeout"];

function MainController(MainService, $timeout) {

    var _this = this;

    _this.categories = 0;
    _this.products = 0;
    _this.product = 0;

    _this.countOnPage = 2;
    _this.itemsToShow = [];
    _this.indexes = [];

    function init(){

        var categoryID = localStorage.getItem('categoryId'),
            productID = localStorage.getItem('productId');

        MainService
            .getCategories()
            .then(function (response) {
                _this.categories = response.data;
            });

        if(categoryID != undefined) {
            _this.getProducts(parseInt(categoryID));

            if(productID != undefined) {
                $timeout(function () {
                    _this.getProduct(parseInt(productID));
                }, 50);
            }
        }
    }

    _this.getProducts = function(categoryId){
        MainService
            .getProducts()
            .then(function (response) {
                _this.products = response.data.filter(function(elem){
                    return parseInt(elem.categoryId) === categoryId+1;
                });
            });

        $timeout(function() {
            _this.itemsToShow = _this.products.slice(0, _this.countOnPage);
            _this.indexes = [];
            for(var i = 0; i < _this.products.length/_this.countOnPage; ++i){
                _this.indexes.push({index: i+1});
            }
        }, 50);

        localStorage.setItem('categoryId', categoryId);
    };

    _this.getItemsToShow = function(index){
        _this.itemsToShow = _this.products.slice(index*_this.countOnPage, (index+1)*_this.countOnPage);
    };

    _this.getProduct = function(productId){
        _this.product = _this.products[productId];

        localStorage.setItem('productId', productId);
    };

    init();
}
