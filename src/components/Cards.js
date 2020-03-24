import talkToApi from "../utils/talkToApi";
import Snackbar from "./Snackbar";

export default (element, data) => {
	if (document.querySelector(".card-wrapper")) {
		document.querySelector(".card-wrapper").innerHTML = "";
	}

	function render() {
		const section = document.createElement("section");
		section.classList.add("container");

		section.innerHTML = `
			<div class="row">
				<div class="col-12 card-wrapper" style="display:flex;flex-wrap:wrap;justify-content:space-between;"></div>
			</div>
		`;

		element.appendChild(section);
		const cardwrapper = document.querySelector(".card-wrapper");

		data.map((article, index) => {
			const div = document.createElement("div");
			div.classList.add("card");
			div.style = "width:32%;margin: 4% 0;";

			div.innerHTML = `
				<img class="card-img-top" src="${article.urlToImage}"/>
				<div class="card-body">
					<h5 class="card-title">${article.author}</h5>
					<p class="card-text">${article.description}</p>
					<a href="${article.url}" class="btn btn-primary" target="_blank">Read</a>
					<small class="article-${index}">Bookmark</small>
				</div>
			`;

			cardwrapper.appendChild(div);
			document.querySelector(`.article-${index}`).addEventListener("click", function (e) {
				talkToApi("https://newsapp.dwsapp.io/api/bookmark/", "post", {
					useCustomRoute: true,
					headers: {
						"content-type": "Application/json"
					},
					body: {
						id: article.source.id,
						name: article.source.name,
						description: article.description,
						url: article.url,
						category: "general",
						language: "en",
						country: "us",
						token: sessionStorage.getItem("userToken")
					}
				})
				.then(result => {
					if (result.err === null) {
						return Snackbar(false, `${article.author} ajouté aux favoris`, e.pageY);
					}

					return Snackbar(true, `${article.author} existe déja`, e.pageY);
				});
			});
		});
	}

	return render();
};
