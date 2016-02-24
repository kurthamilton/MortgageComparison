(function() {
    angular.module('app').directive('formGroup', function() {
        return {
            restrict: 'A',
            template:
                `<div class="form-group required" ng-class="{ 'has-error': form.{{controlName}}.$touched && form.{{controlName}}.$invalid }">
                    <label for="{{controlName}}">{{controlName}}</label>
                    <input name="{{controlName}}" type="number" class="form-control"
                        ng-model="model.test" required />
                    <div ng-show="form.{{controlName}}.$touched" ng-messages="form.test.$error" role="alert">
                        <span class="text-danger field-validation-error" ng-message="required">Required</span>
                    </div>
                </div>`,

            scope: {
                formName: "@",
                controlName: "@"
            }
        };
    });
})();

/*
`<div class="form-group required" ng-class="{ 'has-error': {{formName}}.{{controlName}}.$touched && {{formName}}.{{controlName}}.$invalid }">
                    <label for="{{controlName}}">Balance</label>
                    <input name="{{controlName}}" type="number" class="form-control"
                        ng-model="model.balance" required />
                    <div ng-show="{{formName}}.{{controlName}}.$touched" ng-messages="{{formName}}.{{controlName}}.$error" role="alert">
                        <span class="text-danger field-validation-error" ng-message="required">Required</span>
                    </div>
                </div>`
*/