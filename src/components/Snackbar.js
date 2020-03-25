export default (error, content, pixelScrolled) => {
	function render() {
		const section = document.createElement("section");
		section.style = `position:absolute;top: ${pixelScrolled}px; right: 2%; margin: 0 auto; height: 5vh;`;

		if (error) {
			section.classList.add(
				"snackbar",
				"bg-danger",
				"d-flex",
				"justify-content-center",
				"align-items-center",
				"rounded",
				"p-2"
			);
		} else {
			section.classList.add(
				"snackbar",
				"bg-success",
				"d-flex",
				"justify-content-center",
				"align-items-center",
				"rounded",
				"p-2"
			);
		}

		section.innerHTML = `
			<p class="text-light m-0">${content} consultez la liste <a href="${window.location
			.origin + "/bookmark"}">içi</a></p>
		`;

		document.querySelector("body").appendChild(section);
		const closeInterval = setInterval(m, 1000);
		let i = 0;

		function m() {
			if (i === 4) {
				clearInterval(closeInterval);
				return document
					.querySelector("body")
					.removeChild(document.querySelector(".snackbar"));
			}

			i += 1;
		}
	}

	return render();
};
