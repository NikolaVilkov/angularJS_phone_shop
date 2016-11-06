app.service("MainService", MainService);

MainService.$inject = ["$http"];

function MainService($http) {

    this.getCategories = function() {
        return $http.get('categories.json');
    };

    this.getProducts = function() {
        return $http.get('products.json');
    };
}