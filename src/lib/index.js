// place files you want to import through the `$lib` alias in this folder.

/**
 *
 * @param {HTMLElement} node
 */
export function useOutsideClick(node, exceptions = []) {
	function hasExceptions(event, _exceptions = []) {
		let _has = false;
		for (const i of _exceptions) {
			if (event.target === i) {
				_has = true;
				break;
			}
		}
		return _has;
	}

	function handleClick(event) {
		if (!node.contains(event.target) && !hasExceptions(event, exceptions)) {
			node.dispatchEvent(new Event('outclick'));
		}
	}
	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
