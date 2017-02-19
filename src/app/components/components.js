import angular from 'angular';
import About from './about/about';
import Home   from './home/home';

let componentModule = angular.module('app.components', [
  About,
  Home
])

.name;

export default componentModule;
