import talkToApi from "../utils/talkToApi";
import Cards from "./Cards";

export default element => {
	talkToApi("/sources")
	.then(result => render(result))

	function createCards (rootElement, selectValue, searchValue) {
		talkToApi(`/${selectValue}/${searchValue === "" ? null : searchValue}`)
		.then(result => {
			console.log(result)
			return Cards(rootElement, result.data.articles)
		})
	}

	function render(dataApi) {
		const form = document.createElement("form")
		form.classList.add("container", "rounded", "border", "border-primary", "mt-4")

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
		element.appendChild(form)

		const journal = document.querySelector("select")
		const search = document.querySelector("input")

		// add listener
		journal.addEventListener("change", e => {
			return createCards(element, e.target.value, search.value);
		})

		search.addEventListener("input", e => {
			console.log(e.target.value)
		})

		// Return newspaepper in <select></select>
		dataApi.data.sources.map(i => {
			const option = document.createElement("option")

			option.textContent = i.id
			journal.appendChild(option)
		})

		// Call Cards function who return Cards components
		createCards(element, journal.value, search.value)
	}
}
