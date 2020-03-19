import talkToApi from "../utils/talkToApi";

export default (element, data) => {
	function render() {
		const section = document.createElement("section");
		section.classList.add("container");

		section.innerHTML = `
			<div class="row">
				<div class="col-12"></div>
			</div>
		`

		element.appendChild(section)
	}
}
