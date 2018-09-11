import Vue from 'vue';
import tagsInput from './tagsInput.vue';
new Vue({
    el: '#main',

    render: f => f(tagsInput),
});