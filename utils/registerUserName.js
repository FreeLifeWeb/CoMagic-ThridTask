import { accessConstants } from './accessConstants.js';

const accessConstant = accessConstants();
export function registerUserName() {
    accessConstant.userName.textContent = localStorage.getItem('login');
}
