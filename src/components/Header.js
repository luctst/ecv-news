export default element => {
	function render(element) {
		const header = document.createElement('header');
		header.setAttribute("class", "container-fluid mt-3");
		header.innerHTML = `
        <div class="row">
            <div class="col-12">
                <h1 class="text-center display-5">News</h1>
            </div>
        </div>
        `;
		element.appendChild(header);
	}

	return render(element)
}
