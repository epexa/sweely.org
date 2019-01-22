document.onreadystatechange = function () {
	if (document.readyState === "complete") {
		let pageLang = document.documentElement.lang,
			browserLang = navigator.language,
			url = '';
		switch (browserLang) {
			case 'en':
			case 'en-US':
			case 'en-UK':
			case 'en-AU':
			case 'en-IN':
			case 'en-CA':
			case 'en-NZ':
			case 'en-ZA':
				browserLang = 'en';
				url = 'https://sweely.org/';
				document.querySelector('#textLang').innerHTML = 'Your language is <img class="img-thumbnail" src="https://sweely.org/graphics/flags/en.svg"><p>English?</p>';
				document.querySelector('#acceptLang').innerHTML = 'Yes';
				document.querySelector('#dismissLang').innerHTML = 'No'
				break;
			case 'ru':
			case 'ru-RU':
				browserLang = 'ru';
				url = 'https://sweely.org/ru';
				document.querySelector('#textLang').innerHTML = 'Ваш язык <img class="img-thumbnail" src="https://sweely.org/graphics/flags/ru.svg"><p>Русский?</p>';
				document.querySelector('#acceptLang').innerHTML = 'Да';
				document.querySelector('#dismissLang').innerHTML = 'Нет'
				break;
			case 'it':
			case 'it-IT':
			case 'it-CH':
				browserLang = 'it';
				url = 'https://sweely.org/it';
				document.querySelector('#textLang').innerHTML = 'La tua lingua è <img class="img-thumbnail" src="https://sweely.org/graphics/flags/it.svg"><p>Italiana?</p>';
				document.querySelector('#acceptLang').innerHTML = 'Sì';
				document.querySelector('#dismissLang').innerHTML = 'No'
				break;
			case 'es':
			case 'es-AR':
			case 'es-VE':
			case 'es-HN':
			case 'es-ES':
			case 'es-CO':
			case 'es-CR':
			case 'es-419':
			case 'es-MX':
			case 'es-PE':
			case 'es-US':
			case 'es-UY':
			case 'es-CL':
				browserLang = 'es';
				url = 'https://sweely.org/es';
				document.querySelector('#textLang').innerHTML = 'Es su idioma <img class="img-thumbnail" src="https://sweely.org/graphics/flags/es.svg"><p>Español?</p>';
				document.querySelector('#acceptLang').innerHTML = 'Si';
				document.querySelector('#dismissLang').innerHTML = 'No'
				break;
			case 'pl':
				browserLang = 'pl';
				url = 'https://sweely.org/pl';
				document.querySelector('#textLang').innerHTML = 'Czy twój język <img class="img-thumbnail" src="https://sweely.org/graphics/flags/pl.svg"><p>jest Polski?</p>';
				document.querySelector('#acceptLang').innerHTML = 'Tak';
				document.querySelector('#dismissLang').innerHTML = 'Nie'
				break;
			case 'de':
			case 'de-AT':
			case 'de-DE':
			case 'de-LI':
			case 'de-CH':
				browserLang = 'de';
				url = 'https://sweely.org/de';
				document.querySelector('#textLang').innerHTML = 'Ist deine Sprache <img class="img-thumbnail" src="https://sweely.org/graphics/flags/de.svg"><p>Deutsch?</p>';
				document.querySelector('#acceptLang').innerHTML = 'Ja';
				document.querySelector('#dismissLang').innerHTML = 'Nein'
				break;
			default:
				console.error('Can`t detect this language')
		}

		if (!localStorage.lang && browserLang !== pageLang) $('#modalWrongLang').modal('show');
		document.querySelector('#acceptLang').addEventListener('click', function () {
			localStorage.lang = browserLang
			window.location.href = url
		})
	}
}
