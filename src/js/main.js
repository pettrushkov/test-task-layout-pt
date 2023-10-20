/**
 * Custom scripts.
 */
import AOS from 'aos';

window.addEventListener("load", function (event) {
	initAOS();
});

const initAOS = () => {
	AOS.init();
}