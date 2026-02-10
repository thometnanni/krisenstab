import { replaceState } from '$app/navigation';
import { resolve } from '$app/paths';

export default function (name = '') {
	return function (el) {
		const options = {
			root: null,
			rootMargin: '-30% 0px -70% 0px',
			threshold: 0
		};

		let observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					replaceState(resolve(`/${name}`));
				}
			});
		}, options);

		observer.observe(el);

		return {
			destroy() {
				if (observer) {
					observer.disconnect();
					observer = null;
				}
			}
		};
	};
}
