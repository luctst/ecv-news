export default element => {
	function render(element) {
		const header = document.createElement('header');
		header.setAttribute("class", "container mt-3");
		header.innerHTML = `
        <div class="row">
            <div class="col-9 d-flex align-items-center">
                <h1 class="display-5">News</h1>
			</div>
			${
				sessionStorage.getItem("userToken") ?
					`<div class="col-3 d-flex align-items-center justify-content-end">
						<small class="text-danger" id="disconnect">Disconnect</small>
					</div>`
				: ""
			}
        </div>
        `;
		element.appendChild(header);

		if (document.querySelector("#disconnect")) {
			document.querySelector("#disconnect").addEventListener("click", () => {
				sessionStorage.clear();
				window.location.href = window.location.origin+"/";
			});
		}
	}

	return render(element)
}
