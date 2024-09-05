/* Preload methods */ //**************************************************
/**
 * Dynamically add columns to the main row depending on the service.
 * @param {string} typeService apt, car, yac, pla
 */
function addColumnsToRow(typeService) {
	if (typeService === 'apt') {
		let apartmentRow = document.getElementById('apartmentRow');
		for (let i = 1; i <= numColumns; i++) {
			let columnDiv = document.createElement('div');
			columnDiv.id = `column${i}apartment`;
			columnDiv.className = 'col col-serv col-apartment';
			apartmentRow.appendChild(columnDiv);
		}
	} else if (typeService === 'car') {
		let carRow = document.getElementById('carRow');
		for (let i = 1; i <= numColumns; i++) {
			let columnDiv = document.createElement('div');
			columnDiv.id = `column${i}car`;
			columnDiv.className = 'col col-serv col-car';
			carRow.appendChild(columnDiv);
		}
	} else if (typeService === 'yac') {
		let yachtRow = document.getElementById('yachtRow');
		for (let i = 1; i <= numColumns; i++) {
			let columnDiv = document.createElement('div');
			columnDiv.id = `column${i}yacht`;
			columnDiv.className = 'col col-serv col-yacht';
			yachtRow.appendChild(columnDiv);
		}
	} else if (typeService === 'pla') {
		let planeRow = document.getElementById('planeRow');
		for (let i = 1; i <= numColumns; i++) {
			let columnDiv = document.createElement('div');
			columnDiv.id = `column${i}plane`;
			columnDiv.className = 'col col-serv col-plane';
			planeRow.appendChild(columnDiv);
		}
	} else {
		console.error("ERROR in addColumnsToRow() -> typeService: " + typeService + ". Expect [apt, car, yac, pla]");
	}
}

/**
 * Dynamically add cards to the columns depending on the service.
 * @param {string} typeService apt, car, yac, pla.
 * @param {Array} serviceList The list of service objects.
 * @param {number} pageNumber The page number.
 * @param {boolean} withPage Flag indicating whether to include pagination.
 */
function addCardsToColumns(typeService, serviceList, pageNumber, withPage) {
	if (typeService === 'apt') {
		for (let i = 0; i < serviceList.length; i++) {
			let cardHTML = createCardApartment(serviceList[i]);
			let columnIndex = i % numColumns + 1;
			let columnId = 'column' + columnIndex + 'apartment';
			let column = document.getElementById(columnId);
			if (column) {
				column.innerHTML += cardHTML;
			}
		}
	} else if (typeService === 'car') {
		if (withPage) {
			const startIndex = (pageNumber - 1) * carsPerPage;
			const endIndex = startIndex + carsPerPage;

			for (let i = startIndex; i < endIndex && i < serviceList.length; i++) {
				let cardHTML = createCardCar(serviceList[i]);
				let columnIndex = i % numColumns + 1;
				let columnId = 'column' + columnIndex + 'car';
				let column = document.getElementById(columnId);
				if (column) {
					column.innerHTML += cardHTML;
				}
			}
		} else {
			for (let i = 0; i < serviceList.length; i++) {
				let cardHTML = createCardCar(serviceList[i]);
				let columnIndex = i % numColumns + 1;
				let columnId = 'column' + columnIndex + 'car';
				let column = document.getElementById(columnId);
				if (column) {
					column.innerHTML += cardHTML;
				}
			}
		}
		
	} else if (typeService === 'yac') {
		for (let i = 0; i < serviceList.length; i++) {
			let cardHTML = createCardYacht(serviceList[i]);
			let columnIndex = i % numColumns + 1;
			let columnId = 'column' + columnIndex + 'yacht';
			let column = document.getElementById(columnId); 
			if (column) {
				column.innerHTML += cardHTML;
			}
		}
	} else if (typeService === 'pla') {
		for (let i = 0; i < serviceList.length; i++) {
			let cardHTML = createCardPlane(serviceList[i]);
			let columnIndex = i % numColumns + 1;
			let columnId = 'column' + columnIndex + 'plane';
			let column = document.getElementById(columnId);
			if (column) {
				column.innerHTML += cardHTML;
			}
		}
	} else {
		console.error("ERROR in addCardsToColumns()");
	}
}

/**
 * Add dropdown options to button.
 */
function setCitiesDropdown() {
	const cityList = ['Any', 'Alicante', 'Benidorm', 'Valencia', 'Calpe', 'Altea', 'Marbella'];
	const dropdownMenusServCity = document.querySelectorAll('.servCityDropdown');
	dropdownMenusServCity.forEach((dropdownMenu) => {
		dropdownMenu.innerHTML = '';
		cityList.forEach((city) => {
			const element = document.createElement('button');
			element.id = 'filterButtonCityIdCity-' + city;
			element.textContent = city;
			element.classList.add('btn', 'dropdown-item', 'btn-dropdown');
			element.onclick = function() {
				switchCity(city);
			};
			element.value = 'false';
			dropdownMenu.appendChild(element);
		});
	});
}

/**
 * Add dropdown options to button.
 */
function setPeopleDropdown() {
	const dropdownMenusServPpl = document.querySelectorAll('.servPplDropdown');
	dropdownMenusServPpl.forEach((dropdownMenu) => {
		dropdownMenu.innerHTML = '';
		for (let i = 1; i <= 12; i++) {
			const element = document.createElement('button');
			element.id = 'filterButtonCityIdPpl-' + i;
			i === 1 ? element.textContent = i + ' person' : element.textContent = i + ' persons';
			element.classList.add('btn', 'dropdown-item', 'btn-dropdown');
			element.onclick = function() {
				switchPeople(i);
			};
			element.value = 'false';
			dropdownMenu.appendChild(element);
		}
	});
}

/**
 * Set calendar buttons.
 */
function setCalendarFilter() {
	let startDateInput = $('.datepicker-input-start');
    let endDateInput = $('.datepicker-input-end');

	startDateInput.datepicker({
        format: 'dd-mm-yyyy',
        language: 'en'
    }).on('changeDate', function(e) {
        let selectedDate = e.date;
        let formattedDate = selectedDate.getDate() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getFullYear();
        startDateInput.val(formattedDate);
    });

    endDateInput.datepicker({
        format: 'dd-mm-yyyy',
        language: 'en'
    }).on('changeDate', function(e) {
        let selectedDate = e.date;
        let formattedDate = selectedDate.getDate() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getFullYear();
        endDateInput.val(formattedDate);
    });
}