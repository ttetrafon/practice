/* Framework code */
(function () {
    var controllers = {};
    var addController = function (name, constructor) {
      // Store controller constructor
      controllers[name] = {
        factory: constructor,
        instances: []
      };

      // Look for elements using the controller
      var element = document.querySelector('[ng-controller=' + name + ']');
      if (!element){
        return;
      }

      // Create a new instance and save it
      var ctrl = new controllers[name].factory();
      controllers[name].instances.push(ctrl);

      // Get elements bound to properties
      var bindings = {};
      Array.prototype.slice.call(element.querySelectorAll('[ng-bind]'))
        .map(function (element) {
        var boundValue = element.getAttribute('ng-bind');

        if (!bindings[boundValue]) {
          bindings[boundValue] = {
            boundValue: boundValue,
            elements: []
          }
        }

        bindings[boundValue].elements.push(element);
      });

      // Update DOM element bound when controller property is set
      var proxy = new Proxy (ctrl, {
        set: function (target, prop, value) {
          var bind = bindings[prop];
          if (bind) {
            bind.elements.forEach(function (element) {
              element.value = value;
              element.setAttribute('value', value);
            });
          }
          return Reflect.set(target, prop, value);
        }
      });

      // Listen DOM element update to set the controller property
      Object.keys(bindings).forEach(function (boundValue) {
        var bind = bindings[boundValue];
        bind.elements.forEach(function (element) {
          element.addEventListener('input', function (event) {
            proxy[bind.boundValue] = event.target.value;
          });
        })
      });

      // Fill proxy with ctrl properties
      // and return proxy, not the ctrl !
      Object.assign(proxy, ctrl);
      return proxy;
    }

    // Export framework in window
    this.angular = {
      controller: addController
    }
  })();

  /* User code */
  function InputController () {
    this.message = 'Hello World!';
  }

  var myInputController = angular.controller('InputController', InputController);

  function onButtonClick () {
    myInputController.message = 'Clicked!';
  }