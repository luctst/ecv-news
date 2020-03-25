import talkToApi from "../utils/talkToApi";

export default element => {
	talkToApi("https://newsapp.dwsapp.io/api/me", "POST", {
		useCustomRoute: true,
		headers: {
			"Content-Type": "application/json"
		},
		body: {
			token: sessionStorage.getItem("userToken")
		}
	}).then(result => {
		if (result.err === null) return render(result.data.bookmark);
	});

	function render(data) {
		if (element.querySelector("section")) {
			element.removeChild(element.querySelector("section"));
		}

		const section = document.createElement("section");
		section.classList.add("container");

		section.innerHTML = `
			<div class="row">
				<div class="col-12 bookmark-list"></div>
			</div>
		`;

		element.appendChild(section);

		data.map((bookmark, index) => {
			const article = document.createElement("article");
			article.classList.add(
				"border",
				"rounded-left",
				"border-dark",
				`${index === 0 && "mt-4"}`,
				"p-2"
			);

			article.innerHTML = `
				<h2 style="font-size:1.1rem;">${bookmark.name}</h2>
				<p class="text-secondary m-0" style="font-size:12px;">${bookmark.description}</p>
				<div class="d-flex mt-2">
					<p class="text-primary m-0" style="font-size:10px;"><a href='${bookmark.url}' target="_blank">Read</a></p>
					<p class="text-danger bk-${index}" style="font-size:10px; margin: 0 0 0 1%;">Delete</p>
				</div>
			`;

			document.querySelector(".bookmark-list").appendChild(article);
			document.querySelector(`.bk-${index}`).addEventListener("click", function() {
				talkToApi(`https://newsapp.dwsapp.io/api/bookmark/${bookmark._id}`, "delete", {
					useCustomRoute: true,
					headers: {
						"Content-type": "Application/json"
					},
					body: {
						token: sessionStorage.getItem("userToken")
					}
				}).then(result => {
					if (result.err === null) {
						data.map(
							oldBkItem =>
								oldBkItem._id === result.data._id &&
								data.splice(data.indexOf(oldBkItem), 1)
						);
						return render(data);
					}
				});
			});
		});
	}
};
