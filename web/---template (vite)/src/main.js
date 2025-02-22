import './components/page-1.js';
import './components/page-2.js';
import './style.css'
import { Navigator } from './services/navigator.js';

// document.querySelector('#app').innerHTML = /*html*/`
//   <page-one></page-one>
// `
const navigator = new Navigator('#app');
navigator.navigateTo('/page-one');
