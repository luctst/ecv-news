import Auth from "./components/Auth";
import Header from "./components/Header";
import FormNews from "./components/FormNews";

(root => {
	if (window.location.pathname === "/" || window.location.pathname === "/inscription")
		return Auth(root, window.location.pathname);

	// Secure routes
	if (sessionStorage.getItem("userToken")) {
		if (window.location.pathname === "/news") {
			Header(root);
			return FormNews(root);
		}
	}

	window.location.href = window.location.origin + "/";
})(document.querySelector("#root"));
