import talkToApi from "../utils/talkToApi";
import Cards from "./Cards";

export default element => {
	if (sessionStorage.getItem("userToken")) {
		return talkToApi("https://newsapp.dwsapp.io/api/me", "post", {
			useCustomRoute: true,
			headers: {
				"content-type": "application/json"
			},
			body: {
				token: sessionStorage.getItem("userToken")
			}
		}).then(result => {
			if (result.err === null)
				return talkToApi("/sources", "POST", {
					headers: {
						"content-type": "application/json"
					},
					body: {
						news_api_token: process.env.API_KEY
					}
				}).then(result => render(result));

			element.innerHTML = "";
			state.error = true;
			state.msg = result.message;
			return render();
		});
	}

	function createCards(rootElement, selectValue, searchValue) {
		return talkToApi(
			`/${selectValue}/${searchValue === "" ? null : searchValue}`,
			"POST",
			{
				body: {
					news_api_token: process.env.API_KEY
				}
			}
		).then(result => Cards(rootElement, result.data.articles));
	}

	function render(dataApi) {
		const form = document.createElement("form");
		form.classList.add("container", "rounded", "border", "border-primary", "mt-4");

		form.innerHTML = `
		<div class="row p-3">
			<div class="col-12">
				<div class="form-group">
					<label><small>Source</small></label>
					<select class="form-control"></select>
				</div>
				<div class="form-group">
					<label><small>Search articles<small></label>
					<input type="text" class="form-control col-5"/>
				</div>
			</div>
		</div>
		`;

		// First create the new form html tag to be able to manipulate his data.
		element.appendChild(form);

		const journal = document.querySelector("select");
		const search = document.querySelector("input");

		// add listener
		journal.addEventListener("change", e => {
			return createCards(element, e.target.value, document.querySelector("input").value);
		});

		search.addEventListener("input", e => {
			return createCards(element, document.querySelector("select").value, e.target.value);
		});

		// Return newspaepper in <select></select>
		dataApi.data.sources.map(i => {
			const option = document.createElement("option");

			option.textContent = i.id;
			journal.appendChild(option);
		});

		// Call Cards function who return Cards components
		createCards(element, journal.value, search.value);
	}
};
