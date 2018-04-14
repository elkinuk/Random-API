import '../scss/style.scss'
import App from './app.js'
import $ from 'jquery';

let btn_load_rapi = $('#btn-load_rapi');

let btn_load_local = $('#btn-load_local');
let btn_reset_local = $('#btn-reset_local');

let btn_clear = $('#btn-clear');
let modal = $('#modal');

let app = new App(20,'main');

btn_load_rapi.on('click', app.loadPeopleRapi );

btn_load_local.on('click', app.loadPeopleLocal );
btn_reset_local.on('click', app.resetLocal );

btn_clear.on('click', app.clear );

modal.on('click',(e) => {
    let current = $(e.currentTarget);
    if (current.hasClass('modal')) current.removeClass('modal__visible');
});
