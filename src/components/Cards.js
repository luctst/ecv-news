export default (element, data) => {
	if (document.querySelector(".card-wrapper")) {
		document.querySelector(".card-wrapper").innerHTML = "";
	}

	function render() {
		const section = document.createElement("section");
		section.classList.add("container");

		section.innerHTML = `
			<div class="row">
				<div class="col-12 card-wrapper"></div>
			</div>
		`

		element.appendChild(section)
		const cardwrapper = document.querySelector(".card-wrapper");
		cardwrapper.style = "display:flex;flex-wrap:wrap;justify-content:space-between;";

		data.map(article => {
			const div = document.createElement("div");
			div.classList.add("card")
			div.style = "width:32%;margin: 4% 0;";

			div.innerHTML = `
				<img class="card-img-top" src="${article.urlToImage}"/>
				<div class="card-body">
					<h5 class="card-title">${article.author}</h5>
					<p class="card-text">${article.description}</p>
					<a href="${article.url}" class="btn btn-primary" target="_blank">Read</a>
				</div>
			`;

			cardwrapper.appendChild(div);
		})
	}

	return render()
}
