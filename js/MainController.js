app.controller("MainController", MainController);

MainController.$inject = ["MainService"];

function MainController(MainService) {

    var _this = this;

    _this.categories = 0;
    _this.products = 0;
    _this.product = 0;

    _this.categoryId = 0;
    _this.productId = 0;

    _this.countOnPage = 3;
    _this.itemsToShow = [];
    _this.indexes = [];
    _this.productsIndex = 0;

    _this.filterByName = '';

    _this.stepValue = 1;

    _this.getCategoryProducts = getCategoryProducts;
    _this.getProducts = getProducts;
    _this.getProduct = getProduct;
    _this.getItemsToShow = getItemsToShow;

    init();

    function init(){

        _this.categoryId = parseInt(localStorage.getItem('categoryId'));
        _this.filterByName = localStorage.getItem('filter');

        MainService
            .getCategories()
            .then(function (response) {
                _this.categories = response.data;
                if(_this.categoryId || _this.categoryId == 0) {
                    _this.getProducts(_this.categoryId);
                }
                else{
                    _this.categoryId = 0;
                }
            });
    }

    function getCategoryProducts(categoryId){
        _this.filterByName = '';
        localStorage.setItem('filter', _this.filterByName);
        getProducts(categoryId);
    }

    function getProducts(categoryId) {
        MainService
            .getProducts()
            .then(function (response) {

                _this.productId = parseInt(localStorage.getItem('productId'));

                filterProducts(response, categoryId);
                if (_this.productId || _this.productId == 0) {
                    _this.getProduct(_this.productId);
                }
                else{
                    _this.productId = 0;
                }
                saveProductsIndex();
                getItemsToShow(_this.productsIndex);
            });

        _this.categoryId = categoryId;
        localStorage.setItem('categoryId', categoryId);
    }

    function filterProducts(response, categoryId){
        _this.products = response.data.filter(function(elem){
            return parseInt(elem.categoryId) === categoryId+1;
        });
        if(_this.filterByName.length) {
            _this.products = _this.products.filter(function (elem) {
                return !elem.name.indexOf(_this.filterByName);
            });
        }
    }

    function saveProductsIndex(){

        var countOfPages = _this.products.length/_this.countOnPage;

        _this.productsIndex = 0;
        _this.indexes = null;
        _this.indexes = [];
        for(var i = 0; i < countOfPages; ++i){
            _this.indexes.push({index: i+1});
        }
    }


    function getItemsToShow(index){
        _this.itemsToShow = _this.products.slice(index*_this.countOnPage, (index+1)*_this.countOnPage);
        _this.productsIndex = index;
    }

    function getProduct(productId){

        _this.product = _this.products[productId];

        _this.productId = productId;
        _this.stepValue = 1;
        localStorage.setItem('productId', productId);
        localStorage.setItem('filter', _this.filterByName);
    }
}