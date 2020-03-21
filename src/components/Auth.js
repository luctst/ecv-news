import talkToApi from "../utils/talkToApi";

export default (element, route) => {
	const state = {
		error: false,
		msg: ""
	};

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
			if (result.err) return render();
			return (window.location.href = window.location.origin + "/news");
		});
	}

	function render() {
		const form = document.createElement("form");
		form.classList.add("container");
		form.style = "height:100vh;display:flex;justify-content:center;align-items:center;";

		form.innerHTML = `
			<div class="row">
				<div class="col-12 p-5 rounded border ${state.error ? "border-danger" : "bordeprimary"}">
				${
					state.error
						? `<div class="form-group bg-danger rounded p-2">
						<p class="text-light" style="margin:0;">${state.msg}</p>
					</div>`
						: ""
				}
					<div class="form-group">
						<label><small>Email</small></label>
						<input type="mail" class="form-control"/>
					</div>
					<div class="form-group">
						<label><small>Password</small></label>
						<input type="password" class="form-control"/>
					</div>
					${
						route === "/inscription"
							? `<div class="form-group">
								<label><small>Name</small></label>
								<input type="text" class="form-control" name="name"/>
							</div>
							<div class="form-group">
								<label><small>Surname</small></label>
								<input type="text" class="form-control" name="surname"/>
							</div>
							`
							: ``
					}
					<button type="submit" class="btn btn-primary mb-auto">${
						route === "/" ? "Login" : "Register"
					}</button>
					<div class="form-group mt-2">
						<small>${
							route === "/inscription"
								? `Already have an account ?<a href="${window.location.origin +
										"/"}">Click here</a>`
								: `Do not have an account yet ?<a href="${window.location.origin +
										"/inscription"}">Click here</a>`
						}
						</small>
					</div>
				</div>
			</div>
		`;

		element.appendChild(form);
		const submit = document.querySelector("form");

		submit.addEventListener("submit", e => {
			e.preventDefault();
			const mail = document.querySelector("input[type=mail]");
			const password = document.querySelector("input[type=password]");

			if (!mail.value.length !== 0) {
				if (
					/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
						mail.value
					) === false
				) {
					element.innerHTML = "";
					state.error = true;
					state.msg = "Email incorrect";
					return render();
				}
			}

			if (password.value.length === 0) {
				element.innerHTML = "";
				state.error = true;
				state.msg = "Enter a password";
				return render();
			}

			if (route === "/inscription") {
				const name = document.querySelector("input[name=name]");
				const surname = document.querySelector("input[name=surname]");

				if (name.value.length === 0) {
					element.innerHTML = "";
					state.error = true;
					state.msg = "Enter a name";
					return render();
				}

				if (surname.value.length === 0) {
					element.innerHTML = "";
					state.error = true;
					state.msg = "Enter a surname";
					return render();
				}

				return talkToApi("https://newsapp.dwsapp.io/api/register", "post", {
					useCustomRoute: true,
					headers: {
						"content-type": "application/json"
					},
					body: {
						email: mail.value,
						password: password.value,
						firstname: name.value,
						lastname: surname.value
					}
				})
					.then(result => {
						if (result.err === null) {
							return talkToApi("https://newsapp.dwsapp.io/api/login", "post", {
								useCustomRoute: true,
								headers: {
									"content-type": "application/json"
								},
								body: {
									email: mail.value,
									password: password.value
								}
							});
						}

						element.innerHTML = "";
						state.error = true;
						state.msg = result.message;
						return render();
					})
					.then(userData => {
						sessionStorage.setItem("userToken", userData.data.token);
						window.location.href = window.location.origin + "/news";
					});
			}

			return talkToApi("https://newsapp.dwsapp.io/api/login", "post", {
				useCustomRoute: true,
				headers: {
					"content-type": "application/json"
				},
				body: {
					email: mail.value,
					password: password.value
				}
			}).then(result => {
				if (result.err === null) {
					sessionStorage.setItem("userToken", result.data.token);
					window.location.href = window.location.origin + "/news";
				}

				element.innerHTML = "";
				state.error = true;
				state.msg = result.message;
				return render();
			});
		});
	}

	return render();
};
