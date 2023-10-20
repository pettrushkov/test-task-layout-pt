import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

document.addEventListener( 'DOMContentLoaded', () => {
	'use strict'

	/**
	 * @example of bodyScrollLock usage:
	 *
		let targetElement = document.querySelector( '#some-id' )	// Use ID of the element that will have normal scrolling behaviour.
		disableBodyScroll( targetElement, { reserveScrollBarGap: true } )	// Disable main scroll.
		enableBodyScroll( targetElement )	// Enable main scroll.
	*/
} )