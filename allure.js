/* Page preparation */	//**************************************************
var isLocal = true;

// constants
const SERVICE_APARTMENT = 0;
const SERVICE_CAR = 1;
const SERVICE_YACHT = 2;
const SERVICE_PLANE = 3;

// general
var numColumns = 1;

// pages
var totalCars = 0;
var carsPerPage = 12;
var totalPagesCar = 0;
var lastDoc = null;
var lastPage = 0;

var maxPriceApartment;
var minPriceApartment;
var maxPriceCar;
var minPriceCar;
var maxPriceYacht;
var minPriceYacht;
var maxPricePlane;
var minPricePlane;

// services
var apartments = [];
var cars = [];
var yachts = [];
var planes = [];

// current
var currMinPriceApt = -1;
var currMinPriceCar = -1;
var currMinPriceYach = -1;
var currMinPricePla = -1;

var currCarBrand = 'all';
var currCarModel = 'all';
var currCarColor = 'all';
var currCarPrive = [0, Infinity];

var currPageCar = 1;
var currService = 0;

// cart
var isCartOpen = false;
var totalAmountCart = 0;
var serviceInCart = 0;
var newOrderName = '';
var apartmentsInCart = [];
var carsInCart = [];
var yachtsInCart = [];
var planesInCart = [];

// filters
var citySelected = '';
var pplSelected = 0;
var stDateSelected = '';
var enDateSelected = '';
var filteredCars = '';

/* Set visible first service */	//**************************************************
// Reset all <div id="mainColumnX" class="serviceDiv col-12"> to invisible
var divs = document.getElementsByClassName('serviceDiv');
for (let i = 0; i < divs.length; i++) {
    divs[i].style.display = 'none';
}
// Set actual -> first service = apartments to visibleº
document.getElementById('mainColumn1').style.display = 'block';
// Same with filters <div id="filterX" class="serviceDiv">
document.getElementById('filter1').style.display = 'block';

//*** FireBase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD0f07_UVK0Q5SrMZw6M6vGrHvG3yI30iQ",
    authDomain: "allure-premium-service-a4a9d.firebaseapp.com",
    projectId: "allure-premium-service-a4a9d",
    storageBucket: "allure-premium-service-a4a9d.appspot.com",
    messagingSenderId: "122912019501",
    appId: "1:122912019501:web:ebf41e44668ca038e854a4",
    measurementId: "G-JFKF4BW6V3"
};
firebase.initializeApp(firebaseConfig);

/* PRELOAD */	//**************************************************

if (window.innerWidth < 1024) {
	numColumns = 1;
} else if (window.innerWidth < 1440) {
	numColumns = 2;
} else if (window.innerWidth < 1920) {
	numColumns = 3;
} else {
	numColumns = 4;
}

// JIEOWG78907EWOPGWEIOUGJ
addColumnsToRow('apt');
addColumnsToRow('car');
addColumnsToRow('yac');
addColumnsToRow('pla');

/* DOM */ //**************************************************
document.addEventListener('DOMContentLoaded', async function() {
	// Cart	*****************************************
	document.getElementById('totalRow').style.display = 'none';
	document.getElementById('cartBadge').style.display = 'none';

    // Add buttons with pages to cars	*****************************************
    totalCars = await getCountDocs("car");
	addPageButtonsCars(totalCars);

	// Data from main page	*****************************************
	// City
	setCitiesDropdown();
	// People
	setPeopleDropdown();

	// Calendar	*****************************************
	setCalendarFilter();
});

/* ON LOAD ONLOAD */ //**************************************************
// Show service	based on URL
window.onload = async function() {//city=&ppl=0&start_date=&end_date=
	const preloadService = new URLSearchParams(window.location.search).get('preloadService');
	const preloadCity = new URLSearchParams(window.location.search).get('city');
	const preloadPpl = new URLSearchParams(window.location.search).get('ppl');
	const preloadStDate = new URLSearchParams(window.location.search).get('start_date');
	const preloadEnDate = new URLSearchParams(window.location.search).get('end_date');
    console.log('Recieved: ' + preloadService);    // String
    //console.log(typeof preloadService)

	if (preloadService == null) {
		setDefaultURL();
		preloadService = '0';
	}

	if (preloadCity != null) {
		switchCity(preloadCity);
		citySelected = preloadCity;
	}
	if (preloadPpl != null) {
		switchPeople(parseInt(preloadPpl));
		pplSelected = parseInt(preloadPpl);
	}
	if (preloadStDate != null || preloadEnDate != null) {
		changeCalendarDates(preloadStDate, preloadEnDate)
	}
	if (preloadStDate != null) {
		stDateSelected = preloadStDate;
	}
	if (preloadEnDate != null) {
		enDateSelected = preloadEnDate;
	}
	
	if (preloadService === '0') {
		currService = 0;
		showDiv('mainColumn1', 'filter1')
	} else if (preloadService === '1') {
		currService = 1;
		showDiv('mainColumn2', 'filter2')
	} else if (preloadService === '2') {
		currService = 2;
		showDiv('mainColumn3', 'filter3')
	} else if (preloadService === '3') {
		currService = 3;
		showDiv('mainColumn4', 'filter4')
	}
}

/* Methods general */ //**************************************************

function createServicesApartment() {
    let serviceA = new CarService("Cleaning", 20, true, false);	
    let serviceB = new CarService("Transfer", 30, true, false);
    let serviceC = new CarService("Baby sitter", 15, true, false);
    return [serviceA, serviceB, serviceC];
}

function createServicesCar() {
    let serviceA = new CarService("Cleaning", 20, true, false);	
    let serviceB = new CarService("Transfer", 30, true, false);
    let serviceC = new CarService("Driver", 15, true, false);
    return [serviceA, serviceB, serviceC];
}

function createServicesYacht() {
    let serviceYacht1A = new YachtService("Cleaning", 200, true, false);	
    let serviceYacht1B = new YachtService("Transfer", 30, true, false);
    let serviceYacht1C = new YachtService("Driver", 50, true, false);
    return [serviceYacht1A, serviceYacht1B, serviceYacht1C];
}

function createServicesPlane() {
    let servicePlane1A = new PlaneService("Cleaning", 200, true, false);	
    let servicePlane1B = new PlaneService("Transfer", 30, true, false);
    let servicePlane1C = new PlaneService("Food", 150, true, false);
    return [servicePlane1A, servicePlane1B, servicePlane1C];
}

function createCardApartment(apartment) {
	let titleText = '';
	let fontSize = '';
	if (apartment.title.length > 46) {
		fontSize = '12px';
	} else if (apartment.title.length > 36) {
		fontSize = '13px';
	} else if (apartment.title.length > 26) {
		fontSize = '14px';
	} else {
		fontSize = '15px';
	}
	titleText = `<h5 class="bold-centered" style="font-size: ${fontSize}">${apartment.title}</h5>`;
	let priceText = '';
	if (apartment.isForSale) {
		priceText = 'Sale price: €' + apartment.priceSell;
	} else {
		if (apartment.dayRent) {
			priceText = apartment.price + '€/day';
			if (apartment.monthRent) {
				priceText += '. ' + apartment.monthPrice + '€/month'
			}
		} else {
			priceText = apartment.monthPrice + '€/month';
		}
		
		
	}
	wifiText = '';
	if (apartment.wifi) {
		wifiText = 'Yes';
	} else {
		wifiText = 'No';
	}
	parkingText = '';
	if (apartment.parking) {
		parkingText = 'Yes';
	} else {
		parkingText = 'No';
	}
	conditioneerText = '';
	if (apartment.conditioner) {
		conditioneerText = 'Yes';
	} else {
		conditioneerText = 'No';
	}
    let cardBodyContent;
	cardBodyContent = `
		<div class="row-title position-relative">
			<div class="col-12">
				<!--<h5 class="bold-centered" style="font-size: 12px;">${apartment.title}</h5>-->
				${titleText}
			</div>
		</div>
		<div class="row-centered">
			<div class="col-1"></div>
			<div class="col-3 column-car-body">
				<div class="row row-level1">
					<div class="col col-level1">
						<img width="25" height="25" src="https://img.icons8.com/ios-filled/50/wifi-logo.png" style="padding-bottom: 2px;" alt="wifi-logo"/>
					</div>
					<div class="col col-level1">
						<h5 style="font-size: 14px; padding-top: 4px;">${wifiText}</h5>
					</div>
				</div>
			</div>
			<div class="col column-car-body">
				<div class="row row-level1">
					<div class="col col-level1">
						<img width="25" height="25" src="https://img.icons8.com/ios-filled/50/parking.png" style="padding-bottom: 2px;" alt="parking"/>
					</div>
					<div class="col col-level1">
						<h5 style="font-size: 14px; padding-top: 4px;">${parkingText}</h5>
					</div>
				</div>
			</div>
			<div class="col-3 column-car-body">
				<div class="row row-level1">
					<div class="col col-level1">
						<img width="25" height="25" src="https://img.icons8.com/ios-filled/50/air-conditioner.png" style="padding-bottom: 2px;" alt="air-conditioner"/>
					</div>
					<div class="col col-level1">
						<h5 style="white-space: nowrap; font-size: 14px; padding-top: 4px;">${conditioneerText}</h5>
					</div>
				</div>
			</div>
			<div class="col-1"></div>
		</div>
	`;
	return `
        <div class="col-12 col-serv-pre-card">
            <div class="mb-3 service-card" aptId="${apartment.id}">
                <img class="card-car-img-top" src="${apartment.urlImage}" onclick="openServiceModal(${apartment.id}, 0)" alt="Apartment card image">
                <div class="card-car-body" onclick="openServiceModal(${apartment.id}, 0)">
                    ${cardBodyContent}
                </div>
                <div class="row row-card-reserve-button">
					<div class="col-12">
						<button id="add-${apartment.id}" class="card-service-reserve-button center-button-in-row12" onclick="openServiceModal(${apartment.id}, 0)">
							<span class="transition"></span>
							<span class="gradient"></span>
							<span class="label">Reserve</span>
						</button>
					</div>
                </div>
            </div>
			<div class="badge-outer">${priceText}</div>
        </div>
    `;
}
function createCardCar(car) {
	let titleText = car.brand + ' ' + car.model;
	let fontSize = '';
	if (titleText.length > 36) {
		fontSize = '13px';
	} else if (titleText.length > 26) {
		fontSize = '14px';
	} else if (titleText.length > 16) {
		fontSize = '15px';
	} else {
		fontSize = '16px';
	}
	titleText = `<h5 class="bold-centered" style="font-size: ${fontSize}">${car.brand + " " + car.model}</h5>`;

    let cardBodyContent;
    if (car.isSportCar) {
        cardBodyContent = `
            <div class="row-title position-relative">
                <div class="col-12">
                    <!--<h5 class="bold-centered" style="font-size: 12px;">${car.brand + " " + car.model}</h5>-->
					${titleText}
                </div>
            </div>
            <div class="row-centered">
				<div class="col-1"></div>
                <div class="col-3 column-car-body">
                    <div class="row row-level1">
                        <div class="col col-level1">
                            <img width="25" height="25" src="https://img.icons8.com/metro/26/engine.png" style="padding-bottom: 2px;" alt="engine"/>
                        </div>
                        <div class="col col-level1">
                            <h5 style="font-size: 13px; padding-top: 3px;">${car.hp}HP</h5>
                        </div>
                    </div>
                </div>
                <div class="col column-car-body">
                    <div class="row row-level1">
                        <div class="col col-level1">
                            <img width="25" height="25" src="https://img.icons8.com/ios-filled/50/speed.png" alt="speed"/>
                        </div>
                        <div class="col col-level1">
                            <h5 style="font-size: 13px; padding-top: 3px;">${car.topSpeed}km/h</h5>
                        </div>
                    </div>
                </div>
                <div class="col-3 column-car-body">
                    <div class="row row-level1">
                        <div class="col col-level1">
                            <img width="25" height="25" src="https://img.icons8.com/fluency-systems-filled/48/lightning-bolt.png" alt="lightning-bolt"/>
                        </div>
                        <div class="col col-level1">
                            <h5 style="white-space: nowrap; font-size: 13px; padding-top: 3px;">0-100:${car.timeToHundred}s</h5>
                        </div>
                    </div>
                </div>
				<div class="col-1"></div>
            </div>
        `;
    } else {
		let changeText = '';
		if (car.isManual) {
			changeText = 'Manual';
		} else {
			changeText = 'Auto';
		}
        cardBodyContent = `
            <div class="row-title position-relative">
                <div class="col-12">
                    <!--<h5 class="bold-centered" style="font-size: 12px">${car.brand + " " + car.model}</h5>-->
					${titleText}
                </div>
            </div>
            <div class="row-centered">
				<div class="col-1"></div>
                <div class="col-3 column-car-body">
                    <div class="row row-level1">
                        <div class="col col-level1">
                            <img width="25" height="25" src="https://img.icons8.com/forma-regular-filled/24/user.png" alt="user"/>
                        </div>
                        <div class="col col-level1">
                            <h5 style="font-size: 15px; padding-top: 2px;">${car.numPeople}</h5>
                        </div>
                    </div>
                </div>
                <div class="col column-car-body">
                    <div class="row row-level1">
                        <div class="col col-level1">
                            <img width="25" height="25" src="https://img.icons8.com/pastel-glyph/64/1A1A1A/suitcase--v3.png" style="padding-bottom: 0.2em; line-height: 0.4em;" alt="suitcase--v3"/>
                        </div>
                        <div class="col col-level1">
                            <h5 style="font-size: 15px; padding-top: 4px;">${car.suitcases}</h5>
                        </div>
                    </div>
                </div>
				<div class="col-3 column-car-body">
                    <div class="row row-level1">
                        <div class="col col-level1">
                            <img width="25" height="25" src="https://img.icons8.com/external-outline-design-circle/66/external-Car-Gear-car-parts-outline-design-circle.png" style="padding-bottom: 0.2em; line-height: 0.4em;" alt="external-Car-Gear-car-parts-outline-design-circle"/>
                        </div>
                        <div class="col col-level1">
                            <h5 style="font-size: 14px; padding-top: 4px;">${changeText}</h5>
                        </div>
                    </div>
                </div>
				<div class="col-1"></div>
            </div>
        `;
    }
    return `
        <div class="col-12 col-serv-pre-card">
            <div class="mb-3 service-card" carId="${car.id}">
                <img class="card-car-img-top" src="${car.urlImage}" onclick="openServiceModal(${car.id}, 1)" alt="Car card image">
                <div class="card-car-body" onclick="openServiceModal(${car.id}, 1)">
                    ${cardBodyContent}
                </div>
                <div class="row row-card-reserve-button">
					<div class="col-12">
						<button id="add-${car.id}" class="card-service-reserve-button center-button-in-row12" onclick="openServiceModal(${car.id}, 1)">
							<span class="transition"></span>
							<span class="gradient"></span>
							<span class="label">Reserve</span>
						</button>
					</div>
                </div>
            </div>
            <div class="badge-outer">${car.price} €/day</div>
        </div>
    `;
}

function createCardYacht(yacht) {
	let titleText = yacht.title;
	let fontSize = '';
	if (titleText.length > 36) {
		fontSize = '13px';
	} else if (titleText.length > 26) {
		fontSize = '14px';
	} else if (titleText.length > 16) {
		fontSize = '15px';
	} else {
		fontSize = '16px';
	}
	titleText = `<h5 class="bold-centered" style="font-size: ${fontSize}">${yacht.title}</h5>`;

	let priceText = '';
	if (yacht.priceWeek === 0) {
		if (yacht.price === 0) {
			priceText = 'Contact for price'
		} else {
			priceText = yacht.price + ' €/day'
		}
	} else {
		priceText = yacht.price + '€/day. ' + yacht.priceWeek + '€/week';
	}
    let cardBodyContent;
    cardBodyContent = `
		<div class="row-title position-relative">
			<div class="col-12">
				<!--<h5 class="bold-centered" style="font-size: 12px;">${yacht.title}</h5>-->
				${titleText}
			</div>
		</div>
		<div class="row-centered">
			<div class="col-1"></div>
			<div class="col-3 column-car-body">
				<div class="row row-level1">
					<div class="col col-level1">
						<img width="25" height="25" src="https://img.icons8.com/ios-filled/50/queue.png" style="padding-bottom: 2px;" alt="people"/>
					</div>
					<div class="col col-level1">
						<h5 style="font-size: 14px; padding-top: 4px;">${yacht.maxPeople}</h5>
					</div>
				</div>
			</div>
			<div class="col column-car-body">
				<div class="row row-level1">
					<div class="col col-level1">
						<img width="25" height="25" src="https://img.icons8.com/ios-filled/50/1A1A1A/bed.png" style="padding-bottom: 2px;" alt="cabins"/>
					</div>
					<div class="col col-level1">
						<h5 style="font-size: 14px; padding-top: 4px;">${yacht.cabins}</h5>
					</div>
				</div>
			</div>
			<div class="col-3 column-car-body">
				<div class="row row-level1">
					<div class="col col-level1">
						<img width="25" height="25" src="https://img.icons8.com/material-rounded/24/1A1A1A/toilet-bowl.png" style="padding-bottom: 2px;" alt="toilet"/>
					</div>
					<div class="col col-level1">
						<h5 style="white-space: nowrap; font-size: 14px; padding-top: 4px;">${yacht.bathrooms}</h5>
					</div>
				</div>
			</div>
			<div class="col-1"></div>
		</div>
	`;
    return `
        <div class="col-12 col-serv-pre-card">
            <div class="mb-3 service-card" yachtId="${yacht.id}">
                <img class="card-car-img-top" src="${yacht.urlImage}" onclick="openServiceModal(${yacht.id}, 2)" alt="Card image">
                <div class="card-car-body" onclick="openServiceModal(${yacht.id}, 2)">
                    ${cardBodyContent}
                </div>
                <div class="row row-card-reserve-button">
					<div class="col-12">
						<button id="add-${yacht.id}" class="card-service-reserve-button center-button-in-row12" onclick="openServiceModal(${yacht.id}, 2)">
							<span class="transition"></span>
							<span class="gradient"></span>
							<span class="label">Reserve</span>
						</button>
					</div>
                </div>
            </div>
			<div class="badge-outer">${priceText}</div>
        </div>
    `;
}

function createCardPlane(plane) {
	let titleText = plane.title;
	let fontSize = '';
	if (titleText.length > 36) {
		fontSize = '13px';
	} else if (titleText.length > 26) {
		fontSize = '14px';
	} else if (titleText.length > 16) {
		fontSize = '15px';
	} else {
		fontSize = '16px';
	}
	titleText = `<h5 class="bold-centered" style="font-size: ${fontSize}">${plane.title}</h5>`;

    let priceText = plane.price == -1 ? "Individual price by request" : `${plane.price}€/day`;
    let cardBodyContent;
    cardBodyContent = `
		<div class="row-title position-relative">
			<div class="col-12">
				<!--<h5 class="bold-centered" style="font-size: 12px;">${plane.title}</h5>-->
				${titleText}
			</div>
		</div>
		<div class="row-centered">
			<div class="col"></div>
			<div class="col-3 column-car-body">
				<div class="row row-level1">
					<div class="col col-level1">
						<img width="25" height="25" src="https://img.icons8.com/ios-filled/50/queue.png" style="padding-bottom: 2px;" alt="people"/>
					</div>
					<div class="col col-level1">
						<h5 style="font-size: 14px; padding-top: 2px;">${plane.passengers}</h5>
					</div>
				</div>
			</div>
			<div class="col"></div>
		</div>
	`;
    return `
        <div class="col-12 col-serv-pre-card">
            <div class="mb-3 service-card" planeId="${plane.id}">
                <img class="card-car-img-top" src="${plane.urlImage}" onclick="openServiceModal(${plane.id}, 3)" alt="Card image">
                <div class="card-car-body" onclick="openServiceModal(${plane.id}, 3)">
                    ${cardBodyContent}
                </div>
                <div class="row row-card-reserve-button">
					<div class="col-12">
						<button id="add-${plane.id}" class="card-service-reserve-button center-button-in-row12" onclick="openServiceModal(${plane.id}, 3)">
							<span class="transition"></span>
							<span class="gradient"></span>
							<span class="label">Reserve</span>
						</button>
					</div>
                </div>
            </div>
			<div class="badge-outer">${priceText}</div>
        </div>
    `;
}

/**
 * Open in new tab detailed page of service.
 * @param {number} serviceId Service id.
 * @param {string} serviceType apt, car, yac, pla.
 */
function openServiceNewTab(serviceId, serviceType) {
	let url;
	if (isLocal) {
		if (serviceType === 'apt') {
			url = `service.html?id=${serviceId}&type=apt`;
		} else if (serviceType === 'car') {
			url = `service.html?id=${serviceId}&type=car`;
		} else if (serviceType === 'yac') {
			url = `service.html?id=${serviceId}&type=yac`;
		} else if (serviceType === 'pla') {
			url = `service.html?id=${serviceId}&type=pla`;
		}
	} else {
		if (serviceType === 'apt') {
			url = `https://allurepremiumservice.com/service?id=${serviceId}&type=apt`;
		} else if (serviceType === 'car') {
			url = `https://allurepremiumservice.com/service?id=${serviceId}&type=car`;
		} else if (serviceType === 'yac') {
			url = `https://allurepremiumservice.com/service?id=${serviceId}&type=yac`;
		} else if (serviceType === 'pla') {
			url = `https://allurepremiumservice.com/service?id=${serviceId}&type=pla`;
		}
	}
    const newWindow = window.open(url, '_blank');
    
    if (newWindow) {

    } else {
        alert('The window opening was blocked. Please allow pop-ups for this page.');
    }
}

function switchCarByColor(carId) {
    let car = cars.find(car => car.id === carId);
    if (!car) {
      console.error(`There is not car with ID ${carId}`);
      return;
    }
    
    // Images
    const carousel = document.getElementById("carouselCarIndicators");
    const carouselInner = carousel.querySelector(".carousel-inner");
    const carouselIndicators = carousel.querySelector(".carousel-indicators");
    carouselInner.innerHTML = "";
    carouselIndicators.innerHTML = "";
    car.urlImages.forEach((url, index) => {
        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");
        if (index === 0) {
            carouselItem.classList.add("active");
        }
      
        const img = document.createElement("img");
        img.classList.add("d-block", "w-100");
        img.src = url;
        img.alt = `Slide ${index + 1}`;
      
        carouselItem.appendChild(img);
        carouselInner.appendChild(carouselItem);
      
        const indicator = document.createElement("li");
        indicator.dataTarget = "#carouselCarIndicators";
        indicator.dataset.slideTo = index;
        if (index === 0) {
            indicator.classList.add("active");
        }
        carouselIndicators.appendChild(indicator);
    });
    $(carousel).carousel();

    document.getElementById("modalCarPriceTextP").textContent = `${car.price} € / Day`;
    document.getElementById("modalCarDescTextP").innerHTML = `${car.desc.replace(/\n/g, '<br>')}`;
}

/**
 * Change selected service in cart & update total price
 * @param {number} serviceID 
 * @param {string} serviceName
 * @returns 
 */
function changeServicesInCart(serviceID, serviceName, type) {
    if (type === SERVICE_APARTMENT) {
        let apartment = apartmentsInCart.find(apartment => apartment.id === serviceID);
        if (!apartment) {
            console.error(`There is not apartment in cart with ID ${serviceID}`);
            return;
        }

        // Change total in cart
        if (serviceName != "") {
            let service = apartment.services.find(service => service.name === serviceName);
            if (service) {
                service.isAdd = !service.isAdd;
            }
        }
    } else if (type === SERVICE_CAR) {
        let car = carsInCart.find(car => car.id === serviceID);
        if (!car) {
            console.error(`There is not car in cart with ID ${serviceID}`);
            return;
        }

        // Change total in cart
        if (serviceName != "") {
            let service = car.services.find(service => service.name === serviceName);
            if (service) {
                service.isAdd = !service.isAdd;
            }
        }
    } else if (type == SERVICE_YACHT) {
        let yacht = yachtsInCart.find(yacht => yacht.id === serviceID);
        if (!yacht) {
            console.error(`There is not yacht in cart with ID ${serviceID}`);
            return;
        }

        // Change total in cart
        if (serviceName != "") {
            let service = yacht.services.find(service => service.name === serviceName);
            if (service) {
                service.isAdd = !service.isAdd;
            }
        }
    } else if (type == SERVICE_PLANE) {
        let plane = planesInCart.find(plane => plane.id === serviceID);
        if (!plane) {
            console.error(`There is not plane in cart with ID ${serviceID}`);
            return;
        }

        // Change total in cart
        if (serviceName != "") {
            let service = plane.services.find(service => service.name === serviceName);
            if (service) {
                service.isAdd = !service.isAdd;
            }
        }
    }

	document.getElementById('totalCart').innerText = getTotalInCart() + ' €';
}

/**
 * Change the sub service of service & change total modal price
 * @param {number} serviceID Main service ID
 * @param {string} serviceName Sub service name to change
 * @param {number} type 0 - house, 1 - car, 2 - yacht, 3 - plane
 */
function changeSubServiceShowModal(serviceID, serviceName, type) {
	const serv = getServiceFromAll(serviceID, type);

	const subServ = serv.services.find(service => service.name === serviceName);
	if (!subServ) {
		console.error(`There is not sub service with name: ${serviceName}`);
		return;
	}

	// change input & save in object
	subServ.isAdd = !subServ.isAdd;
	
	// change modal total
	updateShowModalTotal(serviceID, type);
}

function getTotalShowModal(serviceID, type) {
	const serv = getServiceFromAll(serviceID, type);
	let total = 0;

	if (serv.services.length > 0) {
		let days = getCountDaysShowModal(serviceID, type);
		if (days === 0 || isNaN(days)) {
			days = 1;
		}
		total = serv.price * days;
		for (let service of serv.services) {
			if (service.isAdd) {
				total += service.price;
			}
		}
	}
	return total;
}

/**
 * Calculate summary of all services
 * @returns Total amount in cart
 */
function getTotalInCart() {
	let totalAmountCart = 0;
	if (apartmentsInCart.length > 0) {
		let total = 0;
		apartmentsInCart.forEach((serv) => {
			// Price between days
			const startDate = new Date(serv.startDate);
			const endDate = new Date(serv.endDate);
			const differenceInMs = Math.abs(startDate - endDate);
			const daysDifference = Math.round(differenceInMs / (1000 * 60 * 60 * 24));
			total += serv.price * daysDifference;
			// Summary of services
			for (let service of serv.services) {
				if (service.isAdd) {
					total += service.price;
				}
			}
		});
		totalAmountCart += total;
    }
    if (carsInCart.length > 0) {
		let total = 0;
		carsInCart.forEach((serv) => {
			// Price between days
			const startDate = new Date(serv.startDate);
			const endDate = new Date(serv.endDate);
			const differenceInMs = Math.abs(startDate - endDate);
			const daysDifference = Math.round(differenceInMs / (1000 * 60 * 60 * 24));
			total += serv.price * daysDifference;
			// Summary of services
			for (let service of serv.services) {
				if (service.isAdd) {
					total += service.price;
				}
			}
		});
		totalAmountCart += total;
    }
    if (yachtsInCart.length > 0) {
		let total = 0;
		yachtsInCart.forEach((serv) => {
			// Price between days
			const startDate = new Date(serv.startDate);
			const endDate = new Date(serv.endDate);
			const differenceInMs = Math.abs(startDate - endDate);
			const daysDifference = Math.round(differenceInMs / (1000 * 60 * 60 * 24));
			total += serv.price * daysDifference;
			// Summary of services
			for (let service of serv.services) {
				if (service.isAdd) {
					total += service.price;
				}
			}
		});
		totalAmountCart += total;
    }
    if (planesInCart.length > 0) {
		let total = 0;
		planesInCart.forEach((serv) => {
			// Price between days
			const startDate = new Date(serv.startDate);
			const endDate = new Date(serv.endDate);
			const differenceInMs = Math.abs(startDate - endDate);
			const daysDifference = Math.round(differenceInMs / (1000 * 60 * 60 * 24));
			total += serv.price * daysDifference;
			// Summary of services
			for (let service of serv.services) {
				if (service.isAdd) {
					total += service.price;
				}
			}
		});
		totalAmountCart += total;
    }
    return totalAmountCart;
}

/**
 * Show Modal -> start date input, on change
 * Logic for date inputs and set start date to the serv
 * @param {number} serviceID Service ID
 * @param {number} type 0 - house, 1 - car, 2 - yacht, 3 - plane
 * @returns null
 */
function checkStartDate(serviceID, type) {
	const serv = getServiceFromAll(serviceID, type);
	const startDateInput = document.getElementById("startDateInputShowModal");
	const endDateInput = document.getElementById("endDateInputShowModal");

	const selectedStartDate = new Date(startDateInput.value);

	// Set date to global serv
	serv.startDate = selectedStartDate.toISOString().split("T")[0];

	let selectedEndDate;

	if (type === 0 && !serv.dayRent && serv.monthRent) {
		
	} else {
		selectedEndDate = new Date(endDateInput.value);
	}

	if (!isNaN(selectedEndDate.getTime())) {
		if (selectedStartDate >= selectedEndDate) {
			selectedEndDate.setDate(selectedStartDate.getDate() + 1);
			endDateInput.value = selectedEndDate.toISOString().split("T")[0];
			serv.endDate = endDateInput.value;
		}
		updateSelectedDaysShowModal(serviceID, type)
	}

	const minEndDate = new Date(selectedStartDate);
	minEndDate.setDate(minEndDate.getDate() + 1);
	const formattedMinEndDate = minEndDate.toISOString().split("T")[0];
	endDateInput.min = formattedMinEndDate;

	if (endDateInput.disabled === true) {
		endDateInput.disabled = false;
	}
}

/**
 * Show Modal -> start date input, on click
 * @param {number} type 0 - house, 1 - car, 2 - yacht, 3 - plane
 */
function clearStartDate(type) {
	const startDateInput = document.getElementById("startDateInputShowModal");
	const endDateInput = document.getElementById("endDateInputShowModal");

	startDateInput.value = '';
	startDateInput.placeholder = 'dd/mm/yyyy';
	endDateInput.disabled = true;
	endDateInput.value = '';
	endDateInput.placeholder = 'dd/mm/yyyy';
}

function checkEndDate(serviceID, type) {
	const serv = getServiceFromAll(serviceID, type);

	const endDateInput = document.getElementById("endDateInputShowModal");

	const selectedEndDate = new Date(endDateInput.value);

	// Set date to global serv
	serv.endDate = selectedEndDate.toISOString().split("T")[0];

	updateSelectedDaysShowModal(serviceID, type);
	updateShowModalTotal(serviceID, type)
}

/**
 * Get difference in days between 2 dates from service
 * @param {number} serviceID Service ID
 * @param {number} type 0 - apt, 1 - car, 2 - yacht, 3 - plane
 * @returns Number of days
 */
function getCountDaysShowModal(serviceID, type) {
	const serv = getServiceFromAll(serviceID, type);
	
	const startDateInput = serv.startDate;
	const endDateInput = serv.endDate;

	const selectedStartDate = new Date(startDateInput);
	const selectedEndDate = new Date(endDateInput);

	const differenceInMs = Math.abs(selectedEndDate - selectedStartDate);

	const daysDifference = Math.round(differenceInMs / (1000 * 60 * 60 * 24));

	return daysDifference;
}

function updateShowModalTotal(serviceID, type) {
	const serv = getServiceFromAll(serviceID, type);

	if (type == SERVICE_APARTMENT) {
		const total = getTotalShowModal(serviceID, type);
		document.getElementById("totalModalPriceApartment").innerText = "Total: " + total + " €";
    } else if (type == SERVICE_CAR) {
        const total = getTotalShowModal(serviceID, type);
		document.getElementById("totalModalPriceCar").innerText = "Total: " + total + " €";
    } else if (type == SERVICE_YACHT) {
        const total = getTotalShowModal(serviceID, type);
		document.getElementById("totalModalPriceYacht").innerText = "Total: " + total + " €";
    } else if (type == SERVICE_PLANE) {
        const total = getTotalShowModal(serviceID, type);
        if (serv.price == -1) {
            total += 1;
        }
		document.getElementById("totalModalPricePlane").innerText = "Total: " + total + " €";
    }
}

function getServiceFromAll(serviceID, type) {
	let serv;
	if (type == SERVICE_APARTMENT) {
		serv = apartments.find(apartment => apartment.id === serviceID);
        if (!serv) {
            console.error(`There is not apartment with ID ${serviceID}`);
            return;
        }
	} else if (type == SERVICE_CAR) {
		serv = cars.find(car => car.id === serviceID);
        if (!serv) {
            console.error(`There is not car with ID ${serviceID}`);
            return;
        }
	} else if (type == SERVICE_YACHT) {
		serv = yachts.find(yacht => yacht.id === serviceID);
        if (!serv) {
            console.error(`There is not yacht with ID ${serviceID}`);
            return;
        }
	} else if (type == SERVICE_PLANE) {
		serv = planes.find(plane => plane.id === serviceID);
        if (!serv) {
            console.error(`There is not plane with ID ${serviceID}`);
            return;
        }
	}
	return serv;
}

function clearEndDate(type) {
	let dateInput;

	dateInput = document.getElementById("endDateInputShowModal");

	dateInput.value = '';
	dateInput.placeholder = 'dd/mm/yyyy';
}

function updateSelectedDaysShowModal(serviceID, type) {
	if (type === SERVICE_APARTMENT) {
        document.getElementById("selectedDaysApartment").innerText = `Selected days: ${getCountDaysShowModal(serviceID, type)}`;
    } else if (type === SERVICE_CAR) {
        document.getElementById("selectedDaysCar").innerText = `Selected days: ${getCountDaysShowModal(serviceID, type)}`;
    } else if (type === SERVICE_YACHT) {
        document.getElementById("selectedDaysYacht").innerText = `Selected days: ${getCountDaysShowModal(serviceID, type)}`;
    } else if (type === SERVICE_PLANE) {
        document.getElementById("selectedDaysPlane").innerText = `Selected days: ${getCountDaysShowModal(serviceID, type)}`;
    }
}

/**
 * Add service to cart
 * @param {number} serviceID Service ID
 * @param {number} type 0, 1, 2, 3
 */
function addServiceToCart(serviceID, type) {
	// Date YYYY-MM-DD
	const startDateInput = document.getElementById('startDateInputShowModal').value;
	const endDateInput = document.getElementById('endDateInputShowModal').value;
	const dateAlert = document.getElementById('showDatesAlert');
	const serv = getServiceFromAll(serviceID, type);
	let serviceTitleTextCart;

	if (!startDateInput || !endDateInput) {
		dateAlert.style.display = 'block';
	} else {
		dateAlert.style.display = 'none';


		// Title	********************************************
		if (type === SERVICE_APARTMENT) {
			serviceTitleTextCart = document.getElementById('apartmentTitleTextCart');
			if (!serviceTitleTextCart.textContent) {
				serviceTitleTextCart.textContent = 'APARTMENTS';
			}
		} else if (type === SERVICE_CAR) {
			serviceTitleTextCart = document.getElementById('carTitleTextCart');
			if (!serviceTitleTextCart.textContent) {
				serviceTitleTextCart.textContent = 'CARS';
			}
		} else if (type === SERVICE_YACHT) {
			serviceTitleTextCart = document.getElementById('yachtTitleTextCart');
			if (!serviceTitleTextCart.textContent) {
				serviceTitleTextCart.textContent = 'YACHTS';
			}
		} else if (type === SERVICE_PLANE) {
			serviceTitleTextCart = document.getElementById('planeTitleTextCart');
			if (!serviceTitleTextCart.textContent) {
				serviceTitleTextCart.textContent = 'PLANES';
			}
		}

		document.getElementById('totalRow').style.display = 'flex';
		document.getElementById('emptyCart').style.display = 'none';

		// Cart	********************************************
		// services
		const rowSubServices = document.createElement('div');
		rowSubServices.classList.add('row');

		if (serv.services.length) {
			for (let subServ of serv.services) {
				const colService = document.createElement('div');
				colService.classList.add('col-12');

				const colServiceRow = document.createElement('div');
				colServiceRow.classList.add('row');
				// col 1/3
				const colService1 = document.createElement('div');
				colService1.classList.add('col-4');

				const serName = document.createElement('p');
				serName.style.whiteSpace = 'nowrap';
				serName.textContent = subServ.name;

				colService1.appendChild(serName);

				// col 2/3
				const colService2 = document.createElement('div');
				colService2.classList.add('col-4');

				const serPrice = document.createElement('p');
				serPrice.textContent = subServ.price + '€';

				colService2.appendChild(serPrice);

				// col 3/3
				const colService3 = document.createElement('div');
				colService3.classList.add('col-4');

				const serSelect = document.createElement('input');
				serSelect.classList.add('form-check-input', 'service-checkbox');
				serSelect.type = 'checkbox';
				serSelect.value = subServ.isAdd;
				serSelect.setAttribute('onclick', `changeServicesInCart(${serviceID}, '${subServ.name}', ${type})`);
				if (subServ.isAdd) {
					serSelect.setAttribute('checked', '');
				}

				colService3.appendChild(serSelect);

				// final append
				colServiceRow.append(colService1, colService2, colService3);

				colService.appendChild(colServiceRow);

				rowSubServices.appendChild(colService);
			}
		}

		// main structure
		const rowService = document.createElement('div');
		if (type === SERVICE_APARTMENT) {
			rowService.id = 'apartmentInCartDiv-' + serviceID;
		} else if (type === SERVICE_CAR) {
			rowService.id = 'carInCartDiv-' + serviceID;
		} else if (type === SERVICE_YACHT) {
			rowService.id = 'yachtInCartDiv-' + serviceID;
		} else if (type === SERVICE_PLANE) {
			rowService.id = 'planeInCartDiv-' + serviceID;
		}
		rowService.classList.add('row', 'row-cart-each-item');

			// top
		const colServTop = document.createElement('div');
		colServTop.classList.add('col-12');

		const colServTopRow = document.createElement('div');
		colServTopRow.classList.add('row');

		const colServTopRowColTitle = document.createElement('div');
		colServTopRowColTitle.classList.add('col-11', 'col-inside-each-data');

		const colServTopRowColTitleTitle = document.createElement('h6');
		colServTopRowColTitleTitle.style.marginTop = '3px';
		colServTopRowColTitleTitle.style.fontWeight = 'bold';
		if (type === SERVICE_CAR) {
			colServTopRowColTitleTitle.textContent = serv.brand + ' ' + serv.model;
		} else {
			colServTopRowColTitleTitle.textContent = serv.title;
		}

		colServTopRowColTitle.appendChild(colServTopRowColTitleTitle);

		const colServTopRowColClose = document.createElement('div');
		colServTopRowColClose.classList.add('col-1');

		const colServTopRowColCloseBtn = document.createElement('button');
		colServTopRowColCloseBtn.type = 'button';
		colServTopRowColCloseBtn.classList.add('close');
		colServTopRowColCloseBtn.ariaLabel = 'Close';
		if (type === SERVICE_APARTMENT) {
			colServTopRowColCloseBtn.setAttribute('onclick', `deleteApartmentFromCart(${serviceID})`);
		} else if (type === SERVICE_CAR) {
			colServTopRowColCloseBtn.setAttribute('onclick', `deleteCarFromCart(${serviceID})`);
		} else if (type === SERVICE_YACHT) {
			colServTopRowColCloseBtn.setAttribute('onclick', `deleteYachtFromCart(${serviceID})`);
		} else if (type === SERVICE_PLANE) {
			colServTopRowColCloseBtn.setAttribute('onclick', `deletePlaneFromCart(${serviceID})`);
		}

		const colServTopRowColCloseBtnSpan = document.createElement('span');
		colServTopRowColCloseBtnSpan.setAttribute('aria-hidden', 'true');
		colServTopRowColCloseBtnSpan.textContent = 'x'

		colServTopRowColCloseBtn.appendChild(colServTopRowColCloseBtnSpan);

		colServTopRowColClose.appendChild(colServTopRowColCloseBtn);

		colServTopRow.append(colServTopRowColTitle, colServTopRowColClose);

		colServTop.appendChild(colServTopRow);
			// bottom
		const colServBottom = document.createElement('div');
		colServBottom.classList.add('col-12');

		const colServBottomRow = document.createElement('div');
		colServBottomRow.classList.add('row');
				// 1/4
		const colServBottomRowColImg = document.createElement('div');
		colServBottomRowColImg.classList.add('col-6', 'col-md-3', 'col-inside-each-data');

		const colServBottomRowColImgImg = document.createElement('img');
		colServBottomRowColImgImg.src = serv.urlImage;
		colServBottomRowColImgImg.style.width = '104px';
		colServBottomRowColImgImg.style.height = '65px';
		colServBottomRowColImgImg.style.borderRadius = '5px';
		if (type === SERVICE_APARTMENT) {
			colServBottomRowColImgImg.alt = 'apartment image';
		} else if (type === SERVICE_CAR) {
			colServBottomRowColImgImg.alt = 'car image';
		} else if (type === SERVICE_YACHT) {
			colServBottomRowColImgImg.alt = 'yacht image';
		} else if (type === SERVICE_PLANE) {
			colServBottomRowColImgImg.alt = 'plane image';
		}

		colServBottomRowColImg.appendChild(colServBottomRowColImgImg);

				// 2/4
		const colServBottomRowColDate = document.createElement('div');
		colServBottomRowColDate.classList.add('col-6', 'col-md-2', 'col-inside-each-data-date');

		const colServBottomRowColDateStart = document.createElement('div');
		colServBottomRowColDateStart.classList.add('col-12');

		const colServBottomRowColDateStartP = document.createElement('p');
		colServBottomRowColDateStartP.style.textAlign = 'center';
		colServBottomRowColDateStartP.textContent = startDateInput;

		colServBottomRowColDateStart.appendChild(colServBottomRowColDateStartP);

		const colServBottomRowColDateMiddle = document.createElement('div');
		colServBottomRowColDateMiddle.classList.add('col-12', 'col-inside-each-data');

		const colServBottomRowColDateMiddleP = document.createElement('p');
		colServBottomRowColDateMiddleP.style.textAlign = 'center';
		colServBottomRowColDateMiddleP.textContent = 'to';

		colServBottomRowColDateMiddle.appendChild(colServBottomRowColDateMiddleP);

		const colServBottomRowColDateEnd = document.createElement('div');
		colServBottomRowColDateEnd.classList.add('col-12');

		const colServBottomRowColDateEndP = document.createElement('p');
		colServBottomRowColDateEndP.style.textAlign = 'center';
		colServBottomRowColDateEndP.textContent = endDateInput;

		colServBottomRowColDateEnd.appendChild(colServBottomRowColDateEndP);

		colServBottomRowColDate.append(colServBottomRowColDateStart, colServBottomRowColDateMiddle, colServBottomRowColDateEnd);

				// 3/4
		const colServBottomRowColServ = document.createElement('div');
		colServBottomRowColServ.classList.add('col-9', 'col-md-5');

		colServBottomRowColServ.appendChild(rowSubServices);

				// 4/4
		const colServBottomRowColPrice = document.createElement('div');
		colServBottomRowColPrice.classList.add('col-3', 'col-md-2', 'col-inside-each-data');

		const colServBottomRowColPriceText = document.createElement('h6');
		colServBottomRowColPriceText.classList.add('textBold');
		colServBottomRowColPriceText.textContent = serv.price + '€/day';

		colServBottomRowColPrice.appendChild(colServBottomRowColPriceText);

				// final

		colServBottomRow.append(colServBottomRowColImg, colServBottomRowColDate, colServBottomRowColServ, colServBottomRowColPrice);

		colServBottom.appendChild(colServBottomRow);

		rowService.append(colServTop, colServBottom);

		// Rest	********************************************
		if (type === SERVICE_APARTMENT) {
			document.getElementById('apartmentsContainer').appendChild(rowService);

			// To this class
			if (!apartmentsInCart.find(s => s.id === serviceID)) {
				apartmentsInCart.push(serv);
			} else {	// Update article in cart if exists

			}
		} else if (type === SERVICE_CAR) {
			document.getElementById('carsContainer').appendChild(rowService);

			// To this class
			if (!carsInCart.find(s => s.id === serviceID)) {
				carsInCart.push(serv);
			} else {	// Update article in cart if exists

			}
		} else if (type === SERVICE_YACHT) {
			document.getElementById('yachtsContainer').appendChild(rowService);

			// To this class
			if (!yachtsInCart.find(s => s.id === serviceID)) {
				yachtsInCart.push(serv);
			} else {	// Update article in cart if exists

			}
		} else if (type === SERVICE_PLANE) {
			document.getElementById('planesContainer').appendChild(rowService);

			// To this class
			if (!planesInCart.find(s => s.id === serviceID)) {
				planesInCart.push(serv);
			} else {	// Update article in cart if exists

			}
		}

		serviceInCart++;
		if (serviceInCart > 0) {
			createSummaryButton()
		}

		// Cart badge
		document.getElementById('cartBadge').textContent = serviceInCart;
		document.getElementById('cartBadge').style.display = 'flex';

		startDateInput.value = '';
		endDateInput.value = '';

		$('#showModal').modal('hide');
		openCart();
		$('#cartModal').modal('show');
	}
}

function deleteApartmentFromCart(apartmentId) {
    let aptId = apartmentsInCart.findIndex(apartment => apartment.id === apartmentId);

    // Delete from list
    if (aptId !== -1) {
        apartmentsInCart.splice(aptId, 1);
    } else {
        console.error(`There is not apartment in cart with ID ${apartmentId}`);
        return;
    }

    // Delete from cart
    const divElement = document.getElementById(`apartmentInCartDiv-${apartmentId}`);
    if (!divElement) {
        console.error(`There is no div with ID apartmentInCartDiv-${apartmentId}`);
        return;
    }
    divElement.parentNode.removeChild(divElement);

    // Calculate total in cart
    totalAmountCart = getTotalInCart();
	document.getElementById('totalCart').textContent = totalAmountCart + ' €';

    // Delete title if no service
    if (apartmentsInCart.length === 0) {
        document.getElementById('apartmentTitleTextCart').textContent = '';
    }

	// Subtraction
	serviceInCart -= 1;

	// Update cart badge
	if (serviceInCart === 0) {
		document.getElementById('cartBadge').style.display = 'none';
		document.getElementById('cartBadge').textContent = 0;
	} else {
		document.getElementById('cartBadge').textContent = serviceInCart;
	}

	// Remove summary button if no services
	if (serviceInCart === 0) {
		document.getElementById('summaryButtonRow').style.display = 'none';
	}
}

function deleteCarFromCart(carId) {
    let cId = carsInCart.findIndex(car => car.id === carId);

    // Delete from list
    if (cId !== -1) {
        carsInCart.splice(cId, 1);
    } else {
        console.error(`There is not car in cart with ID ${carId}`);
        return;
    }

    // Delete from cart
    const divElement = document.getElementById(`carInCartDiv-${carId}`);
    if (!divElement) {
        console.error(`There is no div with ID carInCartDiv-${carId}`);
        return;
    }
    divElement.parentNode.removeChild(divElement);

    // Calculate total in cart
    totalAmountCart = getTotalInCart();
	document.getElementById('totalCart').textContent = totalAmountCart + ' €';

    // Delete title if no service
    if (carsInCart.length === 0) {
        document.getElementById('carTitleTextCart').textContent = '';
    }

	// Subtraction
	serviceInCart -= 1;

	// Update cart badge
	if (serviceInCart === 0) {
		document.getElementById('cartBadge').style.display = 'none';
		document.getElementById('cartBadge').textContent = 0;
	} else {
		document.getElementById('cartBadge').textContent = serviceInCart;
	}

	// Remove summary button if no services
	if (serviceInCart === 0) {
		document.getElementById('summaryButtonRow').style.display = 'none';
	}
}

function deleteYachtFromCart(yachtId) {
    let yachId = yachtsInCart.findIndex(yacht => yacht.id === yachtId);

    // Delete from list
    if (yachId !== -1) {
        yachtsInCart.splice(yachId, 1);
    } else {
        console.error(`There is not yacht in cart with ID ${yachtId}`);
        return;
    }

    // Delete from cart
    const divElement = document.getElementById(`yachtInCartDiv-${yachtId}`);
    if (!divElement) {
        console.error(`There is no div with ID yachtInCartDiv-${yachtId}`);
        return;
    }
    divElement.parentNode.removeChild(divElement);

    // Calculate total in cart
    totalAmountCart = getTotalInCart();
	document.getElementById('totalCart').textContent = totalAmountCart + ' €';

    // Delete title if no service
    if (yachtsInCart.length === 0) {
        document.getElementById('yachtTitleTextCart').textContent = '';
    }

	// Subtraction
	serviceInCart -= 1;

	// Update cart badge
	if (serviceInCart === 0) {
		document.getElementById('cartBadge').style.display = 'none';
		document.getElementById('cartBadge').textContent = 0;
	} else {
		document.getElementById('cartBadge').textContent = serviceInCart;
	}

	// Remove summary button if no services
	if (serviceInCart === 0) {
		document.getElementById('summaryButtonRow').style.display = 'none';
	}
}

function deletePlaneFromCart(planeId) {
    let plId = planesInCart.findIndex(plane => plane.id === planeId);

    // Delete from list
    if (plId !== -1) {
        planesInCart.splice(plId, 1);
    } else {
        console.error(`There is not plane in cart with ID ${planeId}`);
        return;
    }

    // Delete from cart
    const divElement = document.getElementById(`planeInCartDiv-${planeId}`);
    if (!divElement) {
        console.error(`There is no div with ID planeInCartDiv-${planeId}`);
        return;
    }
    divElement.parentNode.removeChild(divElement);

    // Calculate total in cart
    totalAmountCart = getTotalInCart();
	document.getElementById('totalCart').textContent = totalAmountCart + ' €';

    // Delete title if no service
    if (planesInCart.length === 0) {
        document.getElementById('planeTitleTextCart').textContent = '';
    }

	// Subtraction
	serviceInCart -= 1;

	// Update cart badge
	if (serviceInCart === 0) {
		document.getElementById('cartBadge').style.display = 'none';
		document.getElementById('cartBadge').textContent = 0;
	} else {
		document.getElementById('cartBadge').textContent = serviceInCart;
	}

	// Remove summary button if no services
	if (serviceInCart === 0) {
		document.getElementById('summaryButtonRow').style.display = 'none';
	}
}

/**
 * Set preload service in URL.
 * @param {number} currService 0 apt, 1 car, 2 yac, 3 pla
 */
function changeURL(currService) {
	/*
	const preloadService = new URLSearchParams(window.location.search).get('preloadService');
	const preloadCity = new URLSearchParams(window.location.search).get('city');
	const preloadPpl = new URLSearchParams(window.location.search).get('ppl');
	const preloadStDate = new URLSearchParams(window.location.search).get('start_date');
	const preloadEnDate = new URLSearchParams(window.location.search).get('end_date');
	*/
	const currentUrl = new URL(window.location.href);
	currentUrl.searchParams.set('preloadService', currService.toString());
	window.history.replaceState({}, '', currentUrl);
}

function setDefaultURL() {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('preloadService', '0');
    window.history.replaceState({}, '', currentUrl);
}

/**
 * Add page buttons in car page.
 * @param {number} totalPagesCar Total count of pages.
 * @param {number} totalCars Total count of cars.
 */
function addPageButtonsCars(totalCars) {
	totalPagesCar = Math.ceil(totalCars/carsPerPage);
	let paginationContainer = document.querySelector('.pagination-cars');

	// Botón de Anterior
	let previousPageItem = document.createElement('li');
	previousPageItem.className = 'page-item';

	let previousPageLink = document.createElement('a');
	previousPageLink.className = 'page-link';
	previousPageLink.setAttribute('aria-label', 'Previous');
	previousPageLink.innerHTML = '<span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span>';
	previousPageLink.style.color = 'black';
	previousPageLink.addEventListener('click', function(event) {
		event.preventDefault();
		displayCarsPageNextPrev('prev');
	});
	previousPageItem.appendChild(previousPageLink);
	paginationContainer.appendChild(previousPageItem);

	// Generate buttons
	for (let i = 1; i <= totalPagesCar; i++) {
		let pageItem = document.createElement('li');
		pageItem.className = 'page-item';

		let pageButton = document.createElement('a');
		pageButton.className = 'page-link';
		pageButton.textContent = i;
		pageButton.style.color = 'black';

		if (i === currPageCar) {
			pageButton.classList.add('current-page');
		}

		pageButton.addEventListener('click', function(event) {
			event.preventDefault();

			let allButtons = document.querySelectorAll('.pagination-cars .page-item .page-link');
			allButtons.forEach(function(button) {
				button.classList.remove('current-page');
			});

			this.classList.add('current-page');

			displayCarsPage(parseInt(this.textContent));
			currPageCar = parseInt(this.textContent);

		});

		pageItem.appendChild(pageButton);
		paginationContainer.appendChild(pageItem);
	}

	// Botón de Siguiente
	let nextPageItem = document.createElement('li');
	nextPageItem.className = 'page-item';

	let nextPageLink = document.createElement('a');
	nextPageLink.className = 'page-link';
	nextPageLink.setAttribute('aria-label', 'Next');
	nextPageLink.innerHTML = '<span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span>';
	nextPageLink.style.color = 'black';
	nextPageLink.addEventListener('click', function(event) {
		event.preventDefault();
		displayCarsPageNextPrev('next');
	});
	nextPageItem.appendChild(nextPageLink);
	paginationContainer.appendChild(nextPageItem);
}

/**
 * Open modal with selected service.
 * @param {number} id Service id.
 * @param {number} type 0 - apartment, 1 - car, 2 - yacht, 3 - plane.
 */
function openServiceModal(id, type) {
	// GENERAL	************************************************************
	let serv = getServiceFromAll(id, type);
	console.log(serv);
	const body = document.getElementById('showModalBody');
	body.innerHTML = '';

	const container = document.createElement('div');
    container.classList.add('container', 'show-container-main');

	// TITLE	************************************************************
	const modalTitle = document.getElementById('showModalTitle');
	if (type !== 1) {
		modalTitle.innerText = serv.title;
	} else {
		modalTitle.innerText = serv.brand + ' ' + serv.model;
	}

	// BOTTOM BUTTONS	************************************************************
	const moreDetailsBtn = document.getElementById('showModalMoreDetails');
	const addToCartButton = document.getElementById('showModalAddToCart');
	moreDetailsBtn.onclick = function() {
		if (type === 0) {
			openServiceNewTab(serv.id, 'apt');
		} else if (type === 1) {
			openServiceNewTab(serv.id, 'car');
		} else if (type === 2) {
			openServiceNewTab(serv.id, 'yac');
		} else if (type === 3) {
			openServiceNewTab(serv.id, 'pla');
		}
    };
	addToCartButton.onclick = function() {
		addServiceToCart(serv.id, type);
	};

	// ROW IMAGES
	const row1 = document.createElement('div');
    row1.classList.add('row', 'show-row-1');

	const colImage = document.createElement('div');
    colImage.classList.add('col-12', 'show-col-image');

	const carousel = document.createElement('div');
	carousel.classList.add('carousel', 'slide');
	carousel.id = 'show-carousel';
	carousel.setAttribute('data-ride', 'carousel');

	const carouselInner = document.createElement('div');
    carouselInner.classList.add('carousel-inner');

	const carouselIndicators = document.createElement('ol');
	carouselIndicators.classList.add('carousel-indicators');

	for (let i = 0; i < serv.urlImages.length; i++) {
        const image = serv.urlImages[i];

        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');

        if (i === 0) {
            carouselItem.classList.add('active');
        }

        const img = document.createElement('img');
        img.classList.add('d-block', 'w-100', 'show-carousel-img');
        img.src = image;
        img.alt = 'Slide ' + (i + 1);

        carouselItem.appendChild(img);

        carouselInner.appendChild(carouselItem);

		const indicator = document.createElement('li');
		indicator.setAttribute('data-target', '#show-carousel');
		indicator.setAttribute('data-slide-to', i);
		if (i === 0) {
			indicator.classList.add('active');
		}

		carouselIndicators.appendChild(indicator);
    }

	carousel.appendChild(carouselInner);

	carousel.appendChild(carouselIndicators);

	const prevControl = document.createElement('a');
    prevControl.classList.add('carousel-control-prev');
    prevControl.href = '#show-carousel';
    prevControl.role = 'button';
    prevControl.setAttribute('data-slide', 'prev');

    const prevIcon = document.createElement('span');
    prevIcon.classList.add('carousel-control-prev-icon');
    prevIcon.setAttribute('aria-hidden', 'true');

    const prevText = document.createElement('span');
    prevText.classList.add('sr-only');
    prevText.textContent = 'Previous';

    prevControl.appendChild(prevIcon);
    prevControl.appendChild(prevText);

    const nextControl = document.createElement('a');
    nextControl.classList.add('carousel-control-next');
    nextControl.href = '#show-carousel';
    nextControl.role = 'button';
    nextControl.setAttribute('data-slide', 'next');

    const nextIcon = document.createElement('span');
    nextIcon.classList.add('carousel-control-next-icon');
    nextIcon.setAttribute('aria-hidden', 'true');

    const nextText = document.createElement('span');
    nextText.classList.add('sr-only');
    nextText.textContent = 'Next';

    nextControl.appendChild(nextIcon);
    nextControl.appendChild(nextText);

    carousel.appendChild(prevControl);
    carousel.appendChild(nextControl);

	colImage.appendChild(carousel);

	row1.appendChild(colImage);

	// ROW TOP DATA	************************************************************
	const row2 = document.createElement('div');
    row2.classList.add('row', 'show-row-2');

	const colTopData = document.createElement('div');
    colTopData.classList.add('col-12', 'show-col-topData');

	// row 1 Price
	const row21 = document.createElement('div');
    row21.classList.add('row', 'show-row-2-each');

	// col 1/4 Empty
	const col21 = document.createElement('div');
    col21.classList.add('d-none', 'd-md-block', 'col-md-1', 'col-no-padding');

	// col 2/4 Main price
	const col22 = document.createElement('div');
    col22.classList.add('col-4', 'col-md-2', 'show-col-top-data-align', 'col-no-padding');

	const priceElement = document.createElement('h3');
	priceElement.classList.add('show-col-price-main-text');
	if (type === 0) {
		if (serv.isForSale) {
			priceElement.innerText = serv.priceSell + '€'
		} else {
			if (serv.dayRent && serv.monthRent) {
				priceElement.innerText = serv.price + '€/day'
			} else if (serv.dayRent && !serv.monthRent) {
				priceElement.innerText = serv.price + '€/day'
			} else if (!serv.dayRent && serv.monthRent) {
				priceElement.innerText = serv.monthPrice + '€/mo'
			}
		}
	} else if (type === 1) {
		priceElement.innerText = serv.price + '€/day'
	} else if (type === 2) {
		priceElement.innerText = serv.price + '€/day'
	} else if (type === 3) {
		if (serv.price === -1) {
			priceElement.innerText = 'Individual price by request'
			priceElement.style.textWrap = 'nowrap';
		} else {
			priceElement.innerText = serv.price + '€'
		}
	}

	col22.appendChild(priceElement);

	// col 3/4 Sec price
	const col23 = document.createElement('div');
    col23.classList.add('col-4', 'col-md-2', 'show-col-top-data-align', 'col-no-padding');

	const priceElement2 = document.createElement('h3');
	priceElement2.classList.add('show-col-price-sec-text');
	priceElement2.style.paddingTop = '3px';

	if (type === 0) {
		if (serv.dayRent && serv.monthRent) {
			priceElement2.innerText = serv.monthPrice + '€/mo'
		}
	} else if (type === 2) {
		if (serv.priceWeek != 0) {
			priceElement2.innerText = serv.priceWeek + '€/week';
		}
	}

	col23.appendChild(priceElement2);

	// col 4/4 Empty
	const col24 = document.createElement('div');
    col24.classList.add('col', 'col-no-padding');

	row21.append(col21, col22, col23, col24);

	// row 2 Data
	const row22 = document.createElement('div');
    row22.classList.add('row', 'show-row-2-each');

	// col 1/6
	const col221 = document.createElement('div');
    col221.classList.add('d-none', 'd-md-block', 'col-md-1', 'col-no-padding');

	// col 2/6
	const col222 = document.createElement('div');
    col222.classList.add('col-2', 'show-col-top-data-align', 'col-no-padding');

	const secondRowTopData1 = document.createElement('h3');
	secondRowTopData1.style.fontSize = 'large';

	const secondRowTopData1Span1 = document.createElement('span');
	secondRowTopData1Span1.style.color = 'whitesmoke'
	if (type === 0) {
		secondRowTopData1Span1.innerText = serv.numBedrooms;
	} else if (type === 1) {
		secondRowTopData1Span1.innerText = serv.numPeople;
	} else if (type === 2) {
		secondRowTopData1Span1.innerText = serv.cabins;
	} else if (type === 3) {
		secondRowTopData1Span1.innerText = serv.passengers;
	}

	const secondRowTopData1Span2 = document.createElement('span');
	secondRowTopData1Span2.style.color = 'grey';
	if (type === 0 || type === 2) {
		secondRowTopData1Span2.textContent = 'BD';
	} else if (type === 1 || type === 3) {
		secondRowTopData1Span2.textContent = 'PPL';
	}

	secondRowTopData1.appendChild(secondRowTopData1Span1);
	secondRowTopData1.appendChild(document.createTextNode(' '));
	secondRowTopData1.appendChild(secondRowTopData1Span2);

	col222.appendChild(secondRowTopData1);

	// col 3/6
	const col223 = document.createElement('div');
    col223.classList.add('col-2', 'show-col-top-data-align', 'col-no-padding');

	const secondRowTopData2 = document.createElement('h3');
	secondRowTopData2.style.fontSize = 'large';

	const secondRowTopData2Span1 = document.createElement('span');
	secondRowTopData2Span1.style.color = 'whitesmoke'
	if (type === 0) {
		secondRowTopData2Span1.innerText = serv.numBathrooms;
	} else if (type === 1) {
		secondRowTopData2Span1.innerText = serv.hp;
	} else if (type === 2) {
		secondRowTopData2Span1.innerText = serv.bathrooms;
	}

	const secondRowTopData2Span2 = document.createElement('span');
	secondRowTopData2Span2.style.color = 'grey';
	if (type === 0 || type === 2) {
		secondRowTopData2Span2.textContent = 'BA';
	} else if (type === 1) {
		secondRowTopData2Span2.textContent = 'HP';
	}

	secondRowTopData2.appendChild(secondRowTopData2Span1);
	secondRowTopData2.appendChild(document.createTextNode(' '));
	secondRowTopData2.appendChild(secondRowTopData2Span2);

	col223.appendChild(secondRowTopData2);

	// col 4/6
	const col224 = document.createElement('div');
    col224.classList.add('col-2', 'show-col-top-data-align', 'col-no-padding');

	const secondRowTopData3 = document.createElement('h3');
	secondRowTopData3.style.fontSize = 'large';

	const secondRowTopData3Span1 = document.createElement('span');
	secondRowTopData3Span1.style.color = 'whitesmoke'
	if (type === 0) {
		secondRowTopData3Span1.innerText = serv.meters;
	} else if (type === 1) {
		secondRowTopData3Span1.innerText = serv.suitcases;
	} else if (type === 2) {
		secondRowTopData3Span1.innerText = serv.maxPeople;
	}

	const secondRowTopData3Span2 = document.createElement('span');
	secondRowTopData3Span2.style.color = 'grey';
	if (type === 0) {
		secondRowTopData3Span2.textContent = 'm²';
	} else if (type === 1) {
		secondRowTopData3Span2.textContent = 'BAG';
	} else if (type === 2) {
		secondRowTopData3Span2.textContent = 'PPL';
	}

	secondRowTopData3.appendChild(secondRowTopData3Span1);
	secondRowTopData3.appendChild(document.createTextNode(' '));
	secondRowTopData3.appendChild(secondRowTopData3Span2);

	col224.appendChild(secondRowTopData3);

	// col 5/6
	const col225 = document.createElement('div');
    col225.classList.add('col-2', 'show-col-top-data-align', 'col-no-padding');

	const secondRowTopData4 = document.createElement('span');
	secondRowTopData4.classList.add('badge', 'badge-success');
	secondRowTopData4.textContent = 'Available';

	col225.appendChild(secondRowTopData4);

	// col 6/6
	const col226 = document.createElement('div');
    col226.classList.add('col', 'col-no-padding');

	row22.append(col221, col222, col223, col224, col225, col226)

	// row 3 Location
	const row23 = document.createElement('div');
    row23.classList.add('row', 'show-row-2-each');

	// col 1/2
	const col231 = document.createElement('div');
	col231.classList.add('d-none', 'd-md-block', 'col-md-1', 'col-no-padding');

	// col 2/2
	const col232 = document.createElement('div');
	col232.classList.add('col', 'show-col-top-data-align', 'col-no-padding');

	const thirdRowLocation = document.createElement('h3');
	thirdRowLocation.style.fontSize = 'large';
	thirdRowLocation.style.color = 'whitesmoke';
	thirdRowLocation.textContent = 'Spain, ';

	const thirdRowLocationCity = document.createElement('span');
	thirdRowLocationCity.innerText = serv.location ? serv.location : 'Alicante';

	thirdRowLocation.appendChild(thirdRowLocationCity);

	col232.appendChild(thirdRowLocation);

	row23.append(col231, col232);

	colTopData.append(row21, row22, row23);

	row2.appendChild(colTopData);

	// ROW REST DATA	************************************************************
	const row3 = document.createElement('div');
    row3.classList.add('row', 'show-row-3');

	// col 1/2
	const colRestDataLeft = document.createElement('div');
    colRestDataLeft.classList.add('col-12', 'col-md-6', 'show-col-restData-left');
	colRestDataLeft.style.overflowY = 'auto';

	const colRestDataLeftText = document.createElement('p');
	colRestDataLeftText.style.textAlign = 'justify';
	colRestDataLeftText.innerText = serv.desc;

	colRestDataLeft.appendChild(colRestDataLeftText);

	// col 2/2
	const colRestDataRight = document.createElement('div');
    colRestDataRight.classList.add('col-12', 'col-md-6', 'show-col-restData-right');

	const colRestDataRightTable = document.createElement('div');
    colRestDataRightTable.classList.add('row', 'row-table-parent');

		// element 1
		const colRestDataRightTable1 = document.createElement('div');
		colRestDataRightTable1.classList.add('col-12');

		const colRestDataRightTable1r = document.createElement('div');
		colRestDataRightTable1r.classList.add('row', 'col-table-each', 'col-table-each-styled');

		const colRestDataRightTable1c1 = document.createElement('div');
		colRestDataRightTable1c1.classList.add('col', 'col-align-left');

		const colRestDataRightTable1c1K = document.createElement('h3');
		colRestDataRightTable1c1K.classList.add('col-text-style-styled');

		if (type === 0) {
			colRestDataRightTable1c1K.innerText = 'Wifi';
		} else if (type === 1) {
			colRestDataRightTable1c1K.innerText = 'Transmission';
		} else if (type === 2) {
			colRestDataRightTable1c1K.innerText = 'Length';
		} else if (type === 3) {
			colRestDataRightTable1c1K.innerText = 'Model';
		}

		colRestDataRightTable1c1.appendChild(colRestDataRightTable1c1K);

		const colRestDataRightTable1c2 = document.createElement('div');
		colRestDataRightTable1c2.classList.add('col', 'col-align-right');

		const colRestDataRightTable1c1V = document.createElement('h3');
		colRestDataRightTable1c1V.classList.add('col-text-style-styled');

		if (type === 0) {
			colRestDataRightTable1c1V.innerText = serv.wifi ? 'Yes' : 'No';
		} else if (type === 1) {
			colRestDataRightTable1c1V.innerText = serv.isManual ? 'Manual' : 'Auto';
		} else if (type === 2) {
			colRestDataRightTable1c1V.innerText = serv.length + 'm';
		} else if (type === 3) {
			colRestDataRightTable1c1V.innerText = serv.title;
			colRestDataRightTable1c1V.style.textWrap = 'nowrap';
		}

		colRestDataRightTable1c2.appendChild(colRestDataRightTable1c1V);

		colRestDataRightTable1r.append(colRestDataRightTable1c1, colRestDataRightTable1c2);

		colRestDataRightTable1.appendChild(colRestDataRightTable1r);

		// element 2
		const colRestDataRightTable2 = document.createElement('div');
		colRestDataRightTable2.classList.add('col-12');

		const colRestDataRightTable2r = document.createElement('div');
		colRestDataRightTable2r.classList.add('row', 'col-table-each', 'col-table-each-default');

		const colRestDataRightTable2c1 = document.createElement('div');
		colRestDataRightTable2c1.classList.add('col', 'col-align-left');

		const colRestDataRightTable2c1K = document.createElement('h3');
		colRestDataRightTable2c1K.classList.add('col-text-style-default');

		if (type === 0) {
			colRestDataRightTable2c1K.innerText = 'Conditioneer';
		} else if (type === 1) {
			colRestDataRightTable2c1K.innerText = 'Color';
		} else if (type === 2) {
			colRestDataRightTable2c1K.innerText = 'Width';
		} else if (type === 3) {
			colRestDataRightTable2c1K.innerText = 'Passengers';
		}

		colRestDataRightTable2c1.appendChild(colRestDataRightTable2c1K);

		const colRestDataRightTable2c2 = document.createElement('div');
		colRestDataRightTable2c2.classList.add('col', 'col-align-right');

		const colRestDataRightTable2c2V = document.createElement('h3');
		colRestDataRightTable2c2V.classList.add('col-text-style-default');

		if (type === 0) {
			colRestDataRightTable2c2V.innerText = serv.conditioner ? 'Yes' : 'No';
		} else if (type === 1) {
			colRestDataRightTable2c2V.innerText = serv.color.charAt(0).toUpperCase() + serv.color.slice(1);
		} else if (type === 2) {
			colRestDataRightTable2c2V.innerText = serv.width + 'm';
		} else if (type === 3) {
			colRestDataRightTable2c2V.innerText = serv.passengers;
		}

		colRestDataRightTable2c2.appendChild(colRestDataRightTable2c2V);

		colRestDataRightTable2r.append(colRestDataRightTable2c1, colRestDataRightTable2c2);

		colRestDataRightTable2.appendChild(colRestDataRightTable2r);

		// element 3
		const colRestDataRightTable3 = document.createElement('div');
		colRestDataRightTable3.classList.add('col-12');

		const colRestDataRightTable3r = document.createElement('div');
		colRestDataRightTable3r.classList.add('row', 'col-table-each', 'col-table-each-styled');

		const colRestDataRightTable3c1 = document.createElement('div');
		colRestDataRightTable3c1.classList.add('col', 'col-align-left');

		const colRestDataRightTable3c1K = document.createElement('h3');
		colRestDataRightTable3c1K.classList.add('col-text-style-styled');

		if (type === 0) {
			colRestDataRightTable3c1K.innerText = 'Parking';
		} else if (type === 1) {
			colRestDataRightTable3c1K.innerText = 'Included Km/day';
			colRestDataRightTable3c1K.style.textWrap = 'nowrap';
		} else if (type === 2) {
			colRestDataRightTable3c1K.innerText = 'Crew';
		} else if (type === 3) {
			colRestDataRightTable3.style.display = 'none';
		}

		colRestDataRightTable3c1.appendChild(colRestDataRightTable3c1K);

		const colRestDataRightTable3c2 = document.createElement('div');
		colRestDataRightTable3c2.classList.add('col', 'col-align-right');

		const colRestDataRightTable3c1V = document.createElement('h3');
		colRestDataRightTable3c1V.classList.add('col-text-style-styled');

		if (type === 0) {
			colRestDataRightTable3c1V.innerText = serv.parking ? 'Yes' : 'No';
		} else if (type === 1) {
			colRestDataRightTable3c1V.innerText = serv.includedKmDay;
		} else if (type === 2) {
			colRestDataRightTable3c1V.innerText = serv.crew;
		} else if (type === 3) {

		}

		colRestDataRightTable3c2.appendChild(colRestDataRightTable3c1V);

		colRestDataRightTable3r.append(colRestDataRightTable3c1, colRestDataRightTable3c2);

		colRestDataRightTable3.appendChild(colRestDataRightTable3r);

		// element 4
		const colRestDataRightTable4 = document.createElement('div');
		colRestDataRightTable4.classList.add('col-12');

		const colRestDataRightTable4r = document.createElement('div');
		colRestDataRightTable4r.classList.add('row', 'col-table-each', 'col-table-each-default');

		const colRestDataRightTable4c1 = document.createElement('div');
		colRestDataRightTable4c1.classList.add('col', 'col-align-left');

		const colRestDataRightTable4c1K = document.createElement('h3');
		colRestDataRightTable4c1K.classList.add('col-text-style-default');

		if (type === 0) {
			colRestDataRightTable4c1K.innerText = 'People';
		} else if (type === 1) {
			colRestDataRightTable4c1K.innerText = '1 Extra km';
		} else if (type === 2) {
			colRestDataRightTable4c1K.innerText = 'Deposit';
		} else if (type === 3) {
			colRestDataRightTable4.style.display = 'none';
		}

		colRestDataRightTable4c1.appendChild(colRestDataRightTable4c1K);

		const colRestDataRightTable4c2 = document.createElement('div');
		colRestDataRightTable4c2.classList.add('col', 'col-align-right');

		const colRestDataRightTable4c2V = document.createElement('h3');
		colRestDataRightTable4c2V.classList.add('col-text-style-default');

		if (type === 0) {
			colRestDataRightTable4c2V.innerText = serv.numPeople;
		} else if (type === 1) {
			colRestDataRightTable4c2V.innerText = serv.oneExtraKmPrice + '€';
		} else if (type === 2) {
			colRestDataRightTable4c2V.innerText = serv.deposit + '€';
		} else if (type === 3) {

		}

		colRestDataRightTable4c2.appendChild(colRestDataRightTable4c2V);

		colRestDataRightTable4r.append(colRestDataRightTable4c1, colRestDataRightTable4c2);

		colRestDataRightTable4.appendChild(colRestDataRightTable4r);

		// element 5
		const colRestDataRightTable5 = document.createElement('div');
		colRestDataRightTable5.classList.add('col-12');

		const colRestDataRightTable5r = document.createElement('div');
		colRestDataRightTable5r.classList.add('row', 'col-table-each', 'col-table-each-styled');

		const colRestDataRightTable5c1 = document.createElement('div');
		colRestDataRightTable5c1.classList.add('col', 'col-align-left');

		const colRestDataRightTable5c1K = document.createElement('h3');
		colRestDataRightTable5c1K.classList.add('col-text-style-styled');

		if (type === 0) {
			colRestDataRightTable5c1K.innerText = 'Type';
		} else if (type === 1) {
			colRestDataRightTable5c1K.innerText = 'Top speed';
		} else if (type === 2) {
			colRestDataRightTable5c1K.innerText = 'Week price';
		} else if (type === 3) {
			colRestDataRightTable5.style.display = 'none';
		}

		colRestDataRightTable5c1.appendChild(colRestDataRightTable5c1K);

		const colRestDataRightTable5c2 = document.createElement('div');
		colRestDataRightTable5c2.classList.add('col', 'col-align-right');

		const colRestDataRightTable5c1V = document.createElement('h3');
		colRestDataRightTable5c1V.classList.add('col-text-style-styled');

		if (type === 0) {
			if (serv.isHouse) {
				colRestDataRightTable5c1V.innerText = 'House';
			} else if (serv.isVilla) {
				colRestDataRightTable5c1V.innerText = 'Villa';
			} else {
				colRestDataRightTable5c1V.innerText = 'Apartment';
			}
		} else if (type === 1) {
			colRestDataRightTable5c1V.innerText = serv.topSpeed + 'km/h';
		} else if (type === 2) {
			colRestDataRightTable5c1V.innerText = serv.priceWeek + '€';
		} else if (type === 3) {

		}

		colRestDataRightTable5c2.appendChild(colRestDataRightTable5c1V);

		colRestDataRightTable5r.append(colRestDataRightTable5c1, colRestDataRightTable5c2);

		colRestDataRightTable5.appendChild(colRestDataRightTable5r);

	// final
	colRestDataRightTable.append(colRestDataRightTable1, colRestDataRightTable2, colRestDataRightTable3, colRestDataRightTable4, colRestDataRightTable5);

	colRestDataRight.appendChild(colRestDataRightTable);

	row3.append(colRestDataLeft, colRestDataRight);

	// ROW RESERVATION	************************************************************
	const row4 = document.createElement('div');
    row4.classList.add('row', 'show-row-4');

	// col 1/2 Title
	const colRes1 = document.createElement('div');
    colRes1.classList.add('col-12', 'show-col-res1', 'col-align-center');

	const colResText = document.createElement('h2');
	colResText.style.fontWeight = '400';
	colResText.style.color = 'whitesmoke';
	colResText.innerText = 'RESERVATION MENU';

	colRes1.appendChild(colResText);

	// col 2/2 Menu
	const colRes2 = document.createElement('div');
	colRes2.classList.add('col-12', 'show-col-res2', 'col-align-center');

	const colRes2Row = document.createElement('div');
	colRes2Row.classList.add('row', 'row-show-resMenu-father');

		// row 1/6 Start Date
		const colRes2Row1 = document.createElement('div');
		colRes2Row1.classList.add('col-12', 'padding-zero', 'col-show-resMenu-1');
		
		const colRes2Row1Row = document.createElement('div');
		colRes2Row1Row.classList.add('row', 'row-show-resMenu-1', 'justify-content-center');

		const colRes2Row1Col1 = document.createElement('div');
		colRes2Row1Col1.classList.add('col-5', 'col-md-3', 'col-align-left', 'col-show-resMenu-1-startDate');

		const colRes2Row1Col1Text = document.createElement('h4');
		colRes2Row1Col1Text.innerText = 'Rent start date:';

		colRes2Row1Col1.appendChild(colRes2Row1Col1Text);

		const colRes2Row1Col2 = document.createElement('div');
		colRes2Row1Col2.classList.add('col-7', 'col-md-3', 'col-align-center', 'col-show-resMenu-1-startDateInput');

		const colRes2Row1Col1StDate = document.createElement('input');
		colRes2Row1Col1StDate.id = 'startDateInputShowModal';

		colRes2Row1Col1StDate.type = 'date';

		const today = new Date().toISOString().split('T')[0];
		colRes2Row1Col1StDate.min = today;

		colRes2Row1Col1StDate.onchange = function() {
			if (colRes2Row1Col1StDate.value) {
				checkStartDate(serv.id, type);
			}
		};
		colRes2Row1Col1StDate.addEventListener('input', function() {
			if (!colRes2Row1Col1StDate.value) {
				clearStartDate(type);
			}
		});

		colRes2Row1Col2.appendChild(colRes2Row1Col1StDate);

		colRes2Row1Row.append(colRes2Row1Col1, colRes2Row1Col2);

		colRes2Row1.appendChild(colRes2Row1Row);

		// row 2/6 End date 
		const colRes2Row2 = document.createElement('div');
		colRes2Row2.classList.add('col-12', 'padding-zero', 'col-show-resMenu-2');
		
		const colRes2Row2Row = document.createElement('div');
		colRes2Row2Row.classList.add('row', 'row-show-resMenu-2', 'justify-content-center');

		const colRes2Row2Col1 = document.createElement('div');
		colRes2Row2Col1.classList.add('col-5', 'col-md-3', 'col-align-left', 'col-show-resMenu-1-endDate');

		const colRes2Row2Col1Text = document.createElement('h4');
		colRes2Row2Col1Text.innerText = 'Rent end date:';

		colRes2Row2Col1.appendChild(colRes2Row2Col1Text);

		const colRes2Row2Col2 = document.createElement('div');
		colRes2Row2Col2.classList.add('col-7', 'col-md-3', 'col-align-center');

		const colRes2Row2Col1StDate = document.createElement('input');
		colRes2Row2Col1StDate.id = 'endDateInputShowModal';

		colRes2Row2Col1StDate.type = 'date';

		colRes2Row2Col1StDate.disabled = true;

		if (type === SERVICE_APARTMENT) {
			colRes2Row2Col1StDate.onchange = function() {
				if (colRes2Row2Col1StDate.value) {
					checkEndDate(serv.id, type);
				}
			};
			colRes2Row2Col1StDate.addEventListener('input', function() {
				if (!colRes2Row2Col1StDate.value) {
					clearEndDate(type);
				}
			});
		} else if (type === SERVICE_CAR) {
			colRes2Row2Col1StDate.onchange = function() {
				if (colRes2Row2Col1StDate.value) {
					checkEndDate(serv.id, type);
				}
			};
			colRes2Row2Col1StDate.addEventListener('input', function() {
				if (!colRes2Row2Col1StDate.value) {
					clearEndDate(type);
				}
			});
		} else if (type === SERVICE_YACHT) {
			colRes2Row2Col1StDate.onchange = function() {
				if (colRes2Row2Col1StDate.value) {
					checkEndDate(serv.id, type);
				}
			};
			colRes2Row2Col1StDate.addEventListener('input', function() {
				if (!colRes2Row2Col1StDate.value) {
					clearEndDate(type);
				}
			});
		} else if (type === SERVICE_PLANE) {
			colRes2Row2Col1StDate.onchange = function() {
				if (colRes2Row2Col1StDate.value) {
					checkEndDate(serv.id, type);
				}
			};
			colRes2Row2Col1StDate.addEventListener('input', function() {
				if (!colRes2Row2Col1StDate.value) {
					clearEndDate(type);
				}
			});
		}

		colRes2Row2Col2.appendChild(colRes2Row2Col1StDate);

		if (type === 0 && !serv.dayRent && serv.monthRent) {

		} else {
			colRes2Row2Row.append(colRes2Row2Col1, colRes2Row2Col2);
		}

		colRes2Row2.append(colRes2Row2Row);

		// row 3/6
		const colRes2Row3 = document.createElement('div');
		colRes2Row3.classList.add('col-12', 'padding-zero', 'col-show-resMenu-3');
		
		const colRes2Row3Row = document.createElement('div');
		colRes2Row3Row.classList.add('row', 'row-show-resMenu-3', 'justify-content-center');

		const colRes2Row3SDCol = document.createElement('div');
		colRes2Row3SDCol.classList.add('col-12');

		const colRes2Row3SDColText = document.createElement('p');
		colRes2Row3SDColText.style.textAlign = 'center';
		if (type === 0) {
			colRes2Row3SDColText.id = 'selectedDaysApartment';
		} else if (type === 1) {
			colRes2Row3SDColText.id = 'selectedDaysCar';
		} else if (type === 2) {
			colRes2Row3SDColText.id = 'selectedDaysYacht';
		} else if (type === 3) {
			colRes2Row3SDColText.id = 'selectedDaysPlane';
		}

		colRes2Row3SDCol.appendChild(colRes2Row3SDColText);

		colRes2Row3Row.appendChild(colRes2Row3SDCol);

		colRes2Row3.appendChild(colRes2Row3Row);

		// row 4/6 Service title
		const colRes2Row4 = document.createElement('div');
		colRes2Row4.classList.add('col-12', 'padding-zero', 'col-show-resMenu-4');
		
		const colRes2Row4Row = document.createElement('div');
		colRes2Row4Row.classList.add('row', 'row-show-resMenu-4', 'justify-content-center');

		const colRes2Row4Col = document.createElement('div');
		colRes2Row4Col.style.display = 'flex';
		colRes2Row4Col.style.alignItems = 'center';
		colRes2Row4Col.style.justifyContent = 'center';
		colRes2Row4Col.classList.add('col-12');

		const colRes2Row4ColText = document.createElement('h2');
		colRes2Row4ColText.style.width = '120px';
		colRes2Row4ColText.style.textAlign = 'center';
		colRes2Row4ColText.style.fontWeight = '400';
		colRes2Row4ColText.style.color = 'whitesmoke';
		colRes2Row4ColText.innerText = 'SERVICES';

		colRes2Row4Col.appendChild(colRes2Row4ColText);

		colRes2Row4Row.appendChild(colRes2Row4Col);

		colRes2Row4.appendChild(colRes2Row4Row);

		// row 5/6
		const colRes2Row5 = document.createElement('div');
		colRes2Row5.classList.add('col-12', 'padding-zero', 'col-show-resMenu-5');
		
		const colRes2Row5Row = document.createElement('div');
		colRes2Row5Row.classList.add('row', 'row-show-resMenu-5', 'justify-content-center');

		serv.services.forEach((ser) => {
			const serColMain = document.createElement('div');
			serColMain.classList.add('col-6', 'col-md-2', 'col-align-center');

			const serColMainRow = document.createElement('div');
			serColMainRow.classList.add('row');

			const serColMainRowCol1 = document.createElement('div');
			serColMainRowCol1.style.display = 'flex';
			serColMainRowCol1.style.alignItems = 'center';
			serColMainRowCol1.style.justifyContent = 'center';
			serColMainRowCol1.classList.add('col-12');

			const serColMainRowCol1Name = document.createElement('p');
			serColMainRowCol1Name.style.fontWeight = 'bold';
			serColMainRowCol1Name.style.whiteSpace = 'nowrap';
			serColMainRowCol1Name.innerText = ser.name;

			serColMainRowCol1.appendChild(serColMainRowCol1Name);

			const serColMainRowCol2 = document.createElement('div');
			serColMainRowCol2.style.display = 'flex';
			serColMainRowCol2.style.alignItems = 'center';
			serColMainRowCol2.style.justifyContent = 'center';
			serColMainRowCol2.classList.add('col-12');

			const serColMainRowCol2Price = document.createElement('p');
			serColMainRowCol2Price.style.fontWeight = 'normal';
			serColMainRowCol2Price.style.whiteSpace = 'nowrap';
			serColMainRowCol2Price.innerText = 'Since ' + ser.price + '€';

			serColMainRowCol2.appendChild(serColMainRowCol2Price);

			const serColMainRowCol3 = document.createElement('div');
			serColMainRowCol3.style.display = 'flex';
			serColMainRowCol3.style.alignItems = 'center';
			serColMainRowCol3.style.justifyContent = 'center';
			serColMainRowCol3.classList.add('col-12');

			const serColMainRowCol3Available = document.createElement('p');
			serColMainRowCol3Available.style.fontWeight = 'normal';
			serColMainRowCol3Available.style.whiteSpace = 'nowrap';
			serColMainRowCol3Available.style.color = ser.isAvailable ? 'green' : 'red';
			serColMainRowCol3Available.innerText = ser.isAvailable ? 'Available' : 'Not available';

			serColMainRowCol3.appendChild(serColMainRowCol3Available);

			const serColMainRowCol4 = document.createElement('div');
			serColMainRowCol4.style.display = 'flex';
			serColMainRowCol4.style.alignItems = 'center';
			serColMainRowCol4.style.justifyContent = 'center';
			serColMainRowCol4.style.height = '20px';
			serColMainRowCol4.style.marginLeft = '7px';
			serColMainRowCol4.classList.add('col-12');

			const serColMainRowCol4Input = document.createElement('input');
			serColMainRowCol4Input.classList.add('form-check-input', 'service-checkbox');
			serColMainRowCol4Input.type = 'checkbox';
			serColMainRowCol4Input.value = ser.price;
			serColMainRowCol4Input.onchange = function() {
				changeSubServiceShowModal(serv.id, ser.name, type);
			};

			serColMainRowCol4.appendChild(serColMainRowCol4Input);

			serColMainRow.append(serColMainRowCol1, serColMainRowCol2, serColMainRowCol3, serColMainRowCol4);

			serColMain.appendChild(serColMainRow);

			colRes2Row5Row.appendChild(serColMain);

			colRes2Row5.appendChild(colRes2Row5Row);
		});

		// row 6/6
		const colRes2Row6 = document.createElement('div');
		colRes2Row6.classList.add('col-12', 'padding-zero', 'col-show-resMenu-6');
		
		const colRes2Row6Row = document.createElement('div');
		colRes2Row6Row.classList.add('row', 'row-show-resMenu-6', 'justify-content-center');

		const serColRes2Row6 = document.createElement('div');
		serColRes2Row6.classList.add('col-12');

		const serColRes2Row6Text = document.createElement('h3');
		if (type === 0) {
			serColRes2Row6Text.id = 'totalModalPriceApartment';
		} else if (type === 1) {
			serColRes2Row6Text.id = 'totalModalPriceCar';
		} else if (type === 2) {
			serColRes2Row6Text.id = 'totalModalPriceYacht';
		} else if (type === 3) {
			serColRes2Row6Text.id = 'totalModalPricePlane';
		}
		serColRes2Row6Text.style.color = 'whitesmoke';
		serColRes2Row6Text.innerText = 'Total: ' + serv.price + '€';

		serColRes2Row6.appendChild(serColRes2Row6Text);

		colRes2Row6Row.appendChild(serColRes2Row6);

		colRes2Row6.appendChild(colRes2Row6Row);

	if (type === 0 && !serv.dayRent && serv.monthRent) {
		colRes2Row.append(colRes2Row1, colRes2Row3, colRes2Row4, colRes2Row5, colRes2Row6);		
	} else {
		colRes2Row.append(colRes2Row1, colRes2Row2, colRes2Row3, colRes2Row4, colRes2Row5, colRes2Row6);
	}

	colRes2.append(colRes2Row)

	row4.append(colRes1, colRes2);
	
	// ADD ALL	************************************************************
	container.append(row1, row2, row3, row4);

	body.appendChild(container);

	// ALERT IF DATES NOT SELECTED
	const showDatesAlert = document.createElement('div');
	showDatesAlert.id = 'showDatesAlert';
	showDatesAlert.classList.add('alert', 'alert-warning');
	showDatesAlert.style.display = 'none';
	showDatesAlert.style.marginTop = '10px';
	showDatesAlert.textContent = 'Please, select dates!';

	container.appendChild(showDatesAlert);

	$('#showModal').modal('show');
}

/* Summary methods */ //**************************************************

function createSummaryButton() {	// EHWGUHWE23452523-1
	let summaryLink = document.getElementById('summaryLink');
    if (!summaryLink) {
        summaryLink = document.createElement('a');
        summaryLink.id = 'summaryLink';
        summaryLink.className = 'btn btn-dark';
        summaryLink.textContent = 'See summary';
        summaryLink.style.padding = '10px 20px';
        summaryLink.style.fontSize = '20px';
        summaryLink.style.width = '200px';
        summaryLink.style.color = 'black';
        summaryLink.href = 'https://allurepremiumservice.com/summary?orderId=1';
        summaryLink.target = '_blank';

		summaryLink.addEventListener('click', function(event) {
            goToSummary();
        });

		let newCol = document.createElement('div');
		newCol.id = 'summaryButtonRow';
		newCol.className = 'col-12';
		newCol.style.display = 'flex';

        let newRow = document.createElement('div');
        newRow.className = 'row d-flex justify-content-center';

		newRow.appendChild(summaryLink);

		newCol.appendChild(newRow);

        document.getElementById('cartModalBody').appendChild(newCol);
    } else {
		if (serviceInCart === 0) {
			document.getElementById('summaryButtonRow').style.display = 'flex';
		}
	}
}

async function openCart() {
	/*console.log(apartmentsInCart);
	console.log(carsInCart);
	console.log(yachtsInCart);
	console.log(planesInCart);*/
	const db = firebase.firestore();
    let lastOrder = 0;
    newOrderName = '';

	const lastOrderId = await getLastOrderName(); // String
    if (lastOrderId == '0') {
        newOrderName = '1';
    } else {
        lastOrder = lastOrderId !== '' ? parseInt(lastOrderId) + 1 : 1;
        newOrderName = lastOrder.toString();
    }

	if (serviceInCart > 0) {
		let summaryLink = document.getElementById('summaryLink');
		summaryLink.href = 'https://allurepremiumservice.com/summary?orderId=' + newOrderName;
	}

	document.getElementById('totalCart').textContent = getTotalInCart() + ' €';
}

async function goToSummary() {	// EHWGUHWE23452523-1
    await sendDataToSummary(newOrderName);
    setLastOrderName(newOrderName);
	console.log('SENT ' + newOrderName);
}

async function getLastOrderName() {
    const db = firebase.firestore();
    const docRef = db.collection('totalDocs').doc('countOrders');

    try {
        const doc = await docRef.get();
        if (doc.exists) {
            return doc.data().last;
        } else {
            console.log("Error getting last count of orders");
            return '0';
        }
    } catch (error) {
        console.log("Error getting document: ", error);
        return '0';
    }
}

async function setLastOrderName(newName) {
    const db = firebase.firestore();
    const docRef = db.collection('totalDocs').doc('countOrders');

    try {
        await docRef.update({ last: newName });
        console.log("Last order name updated successfully with id: " + newName);
    } catch (error) {
        console.log("Error updating document: ", error);
    }
}

/**
 * Get total count of documents in Data Base.
 * @param {string} docName apt, car, yac, pla
 * @returns {Promise<number>} The total count of documents.
 */
async function getCountDocs(docName) {
    const db = firebase.firestore();
    let docRef;
    if (docName == "apt") {
        docRef = db.collection('totalDocs').doc('countApartments');
    } else if (docName == "car") {
        docRef = db.collection('totalDocs').doc('countCars');
    } else if (docName == "yac") {
        docRef = db.collection('totalDocs').doc('countYachts');
    } else if (docName == "pla") {
        docRef = db.collection('totalDocs').doc('countPlanes');
    }

    try {
        const doc = await docRef.get();
        if (doc.exists) {
            return doc.data().total;
        } else {
            console.log("Error getting total count of documents");
            return 0;
        }
    } catch (error) {
        console.log("Error getting document: ", error);
        return 0;
    }
}

/**
 * Switch between services page.
 * @param {string} id mainColumnX (1-4)
 * @param {string} idService filterX (1-4)
 */
async function showDiv(id, idService) {
    let divs = document.getElementsByClassName('serviceDiv');
    for (let i = 0; i < divs.length; i++) {
        divs[i].style.display = 'none';
    }
    document.getElementById(id).style.display = 'block';
    let divs2 = document.getElementsByClassName('filterDiv');
    for (let i = 0; i < divs2.length; i++) {
        divs2[i].style.display = 'none';
    }
    document.getElementById(idService).style.display = 'block';

    // Title of page and load data
    if (id == 'mainColumn1') {
		let countDocs = await getCountDocs("apt");
		if (apartments.length != countDocs) {
			console.log("Loading apartments...");
			apartments = [];
			apartments = await downloadApartmentsAll();
		} else {
			console.log("All apartments were previously loaded");
		}

		let columns = document.getElementsByClassName('col-apartment');
		for (let i = 0; i < columns.length; i++) {
			columns[i].innerHTML = '';
		}

		addCardsToColumns('apt', apartments, 0, false)

		// Change URL
		currService = 0;
		changeURL(currService)
	} else if (id == 'mainColumn2') {   // GGEWGWE24543ILHGUUB EGEWOIGEHWJ23875326832-1
        lastPage = 0;
        lastDoc = null;

        let countDocs = await getCountDocs("car");
        if (cars.length != countDocs) {
			cars = [];
            console.log("Loading all cars...");
            cars = await downloadCarsAll();
            // Sort cars by price low to high
            cars.sort((a, b) => a.price - b.price);
        } else {
            console.log("All cars were previously loaded");
        }
        displayCarsPage(1);

		// Change URL
		currService = 1;
		changeURL(currService)

		// Set last page
		displayCarsPage(currPageCar);
    } else if (id == 'mainColumn3') {
        let countDocs = await getCountDocs("yac");
        if (yachts.length != countDocs) {
            console.log("Loading yachts...");
            yachts = [];
            yachts = await downloadYachtsAll();
        } else {
            console.log("All yachts were previously loaded");
        }

		let columns = document.getElementsByClassName('col-yacht');
		for (let i = 0; i < columns.length; i++) {
			columns[i].innerHTML = '';
		}

		addCardsToColumns('yac', yachts, 0, false);

		// Change URL
		currService = 2;
		changeURL(currService)
    } else if (id == 'mainColumn4') {
        let countDocs = await getCountDocs("pla");
        if (planes.length != countDocs) {
            console.log("Loading planes...");
            planes = [];
            planes = await downloadPlanesAll();
        } else {
            console.log("All planes were previously loaded");
        }

		let columns = document.getElementsByClassName('col-plane');
		for (let i = 0; i < columns.length; i++) {
			columns[i].innerHTML = '';
		}

		addCardsToColumns('pla', planes, 0, false);

		// Change URL
		currService = 3;
		changeURL(currService)
    }
}

/* Filters methods */ //**************************************************

function addCardApartment(apartment, column) {
    let cardHTML = createCardApartment(apartment);
    column.innerHTML += cardHTML;
}

function addCardCar(car, column) {
    let cardHTML = createCardCar(car);
    column.innerHTML += cardHTML;
}

function addCardYacht(yacht, column) {
    let cardHTML = createCardYacht(yacht);
    column.innerHTML += cardHTML;
}

function addCardPlane(plane, column) {
    let cardHTML = createCardPlane(plane);
    column.innerHTML += cardHTML;
}

/**
 * 0 apartment, 1 house, 2 villa
 * @param {number} type 
 */
function filterAptType(type) {
	if (type === 0) {
		let aptRow = document.getElementById('apartmentRow');
		aptRow.innerHTML = '';

		addColumnsToRow('apt');

		let columns = document.getElementsByClassName('col-apartment');
		for (let i = 0; i < columns.length; i++) {
			columns[i].innerHTML = '';
		}

		let aptAux = apartments.filter(apartment => !apartment.isHouse);

		addCardsToColumns("apt", aptAux, 0, false);

		// Set button selected/deselected
		const button = document.getElementById('filterButtonTypeIdApartment');
		if (button.value == 'false') {
			button.value = true;

		} else {
			button.value = false;
		}
	} else if (type === 1) {
		let aptRow = document.getElementById('apartmentRow');
		aptRow.innerHTML = '';

		addColumnsToRow('apt');

		let columns = document.getElementsByClassName('col-apartment');
		for (let i = 0; i < columns.length; i++) {
			columns[i].innerHTML = '';
		}

		let aptAux = apartments.filter(apartment => apartment.isHouse);

		addCardsToColumns('apt', aptAux, 0, false);

		// Set button selected/deselected
		const button = document.getElementById('filterButtonTypeIdHouse');
		if (button.value == 'false') {
			button.value = true;

		} else {
			button.value = false;
		}
	} else {
		let aptRow = document.getElementById('apartmentRow');
		aptRow.innerHTML = '';

		addColumnsToRow('apt');

		let columns = document.getElementsByClassName('col-apartment');
		for (let i = 0; i < columns.length; i++) {
			columns[i].innerHTML = '';
		}

		let aptAux = apartments.filter(apartment => apartment.isVilla);

		addCardsToColumns('apt', aptAux, 0, false);

		// Set button selected/deselected
		const button = document.getElementById('filterButtonTypeIdVilla');
		if (button.value == 'false') {
			button.value = true;

		} else {
			button.value = false;
		}
	}
}

/**
 * 0 rent, 1 sale
 * @param {number} type 
 */
function filterAptSale(type) {
	if (type === 0) {
		let aptRow = document.getElementById('apartmentRow');
		aptRow.innerHTML = '';

		addColumnsToRow('apt');

		let columns = document.getElementsByClassName('col-apartment');
		for (let i = 0; i < columns.length; i++) {
			columns[i].innerHTML = '';
		}

		let aptAux = apartments.filter(apartment => !apartment.isForSale);

		addCardsToColumns('apt', aptAux, 0, false);

		// Set button selected/deselected
		const button = document.getElementById('filterButtonSaleIdRent');
		if (button.value == 'false') {
			button.value = true;

		} else {
			button.value = false;
		}
	} else {
		let aptRow = document.getElementById('apartmentRow');
		aptRow.innerHTML = '';

		addColumnsToRow('apt');

		let columns = document.getElementsByClassName('col-apartment');
		for (let i = 0; i < columns.length; i++) {
			columns[i].innerHTML = '';
		}

		let aptAux = apartments.filter(apartment => apartment.isForSale);

		addCardsToColumns('apt', aptAux, 0, false);

		// Set button selected/deselected
		const button = document.getElementById('filterButtonSaleIdBuy');
		if (button.value == 'false') {
			button.value = true;

		} else {
			button.value = false;
		}
	}
}

/**
 * 0 month, 1 daily
 * @param {number} type 
 */
function filterAptByMonthRent(is) {
	let list;

	let row = document.getElementById('apartmentRow');
	row.innerHTML = '';

	addColumnsToRow('apt');

	let columns = document.getElementsByClassName('col-apartment');
	for (let i = 0; i < columns.length; i++) {
		columns[i].innerHTML = '';
	}

	if (is === 0) {
		list = apartments.filter(apartment => apartment.monthRent);

		// Set button selected/deselected
		const button = document.getElementById('filterButtonMonthRentIdApt-is');
		if (button.value == 'false') {
			button.value = true;

		} else {
			button.value = false;
		}
	} else {
		list = apartments.filter(apartment => !apartment.monthRent);
		list = list.filter(apartment => !apartment.isForSale);

		// Set button selected/deselected
		const button = document.getElementById('filterButtonMonthRentIdApt-not');
		if (button.value == 'false') {
			button.value = true;

		} else {
			button.value = false;
		}
	}

	addCardsToColumns('apt', list, 0, false);
}

function filterCarsByBrand(brand) {
	currCarBrand = brand;
    currCarModel = 'all';
    applyFilters();
}

function filterCarsByColor(color) {
	let carRow = document.getElementById('carRow');
	carRow.innerHTML = '';

	addColumnsToRow('car');

	let columns = document.getElementsByClassName('col-car');
	for (let i = 0; i < columns.length; i++) {
		columns[i].innerHTML = '';
	}

	if (color === 'gray' || color === 'grey') {
		color = ['gray', 'grey'];
	}

	let carAux = cars.filter(car => color.includes(car.color));

	addCardsToColumns('car', carAux, 0, false);
}

function switchCarByModel(model) {
    currCarModel = model;
    applyFilters();
}

function filterCarsByColor(color) {
    if (color === 'gray' || color === 'grey') {
        color = ['gray', 'grey'];
    }

    currCarColor = color;
    applyFilters();
}

function applyFilters() {
    filteredCars = cars;
    const dropdownMenuButtonCarBrand = document.getElementById('dropdownMenuButtonCarBrand');
    dropdownMenuButtonCarBrand.querySelector("b").textContent = 'Brand';

    const carModelDisabledOrAbled = document.getElementById('dropdownMenuButtonCarModel');
    carModelDisabledOrAbled.querySelector("b").textContent = 'Model';
    carModelDisabledOrAbled.style.width = '120px';

    const dropdownMenuButtonCarColor = document.getElementById('dropdownMenuButtonCarColor');
    dropdownMenuButtonCarColor.querySelector("b").textContent = 'Color';
    dropdownMenuButtonCarColor.querySelector("b").style.textTransform = 'capitalize';
    carModelDisabledOrAbled.classList.add('disabled');

    if (currCarBrand !== 'all') {
        filteredCars = filteredCars.filter(car => car.brand === currCarBrand);
        dropdownMenuButtonCarBrand.querySelector("b").textContent = currCarBrand;
        carModelDisabledOrAbled.classList.remove('disabled');
    }

    if (currCarModel !== 'all') {
        filteredCars = filteredCars.filter(car => car.model === currCarModel);
        carModelDisabledOrAbled.querySelector("b").textContent = currCarModel;
        if (currCarModel.length > 10) {
            carModelDisabledOrAbled.querySelector("b").style.fontSize = '12px';
            carModelDisabledOrAbled.style.width = 'auto';
            carModelDisabledOrAbled.style.padding = '5px 10px';
        }
    }

    if (currCarColor !== 'all') {
        // filteredCars = filteredCars.filter(car => car.color === currCarColor);
        filteredCars = filteredCars.filter(car => currCarColor.includes(car.color));
        dropdownMenuButtonCarColor.querySelector("b").textContent = currCarColor;
    }

    filteredCars = filteredCars.filter(car => car.price >= currCarPrive[0] && car.price <= currCarPrive[1]);
    filteredCars.sort((a, b) => a.price - b.price);

    let carRow = document.getElementById('carRow');
    carRow.innerHTML = '';
    addColumnsToRow('car');

    let columns = document.getElementsByClassName('col-car');
    for (let i = 0; i < columns.length; i++) {
        columns[i].innerHTML = '';
    }

    addCardsToColumns('car', filteredCars, 0, false);
}

function filterYachtsByMaxPeople(people) {
	let row = document.getElementById('yachtRow');
	row.innerHTML = '';

	addColumnsToRow('yac');

	let columns = document.getElementsByClassName('col-yacht');
	for (let i = 0; i < columns.length; i++) {
		columns[i].innerHTML = '';
	}

	let list = yachts.filter(yacht => yacht.maxPeople === people);

	addCardsToColumns('yac', list, 0, false);
}

function filterYachtsByCabins(cabs) {
	let row = document.getElementById('yachtRow');
	row.innerHTML = '';

	addColumnsToRow('yac');

	let columns = document.getElementsByClassName('col-yacht');
	for (let i = 0; i < columns.length; i++) {
		columns[i].innerHTML = '';
	}

	let list = yachts.filter(yacht => yacht.cabins === cabs);

	addCardsToColumns('yac', list, 0, false);
}

function filterYachtsByBathrooms(baths) {
	let row = document.getElementById('yachtRow');
	row.innerHTML = '';

	addColumnsToRow('yac');

	let columns = document.getElementsByClassName('col-yacht');
	for (let i = 0; i < columns.length; i++) {
		columns[i].innerHTML = '';
	}

	let list = yachts.filter(yacht => yacht.bathrooms === baths);

	addCardsToColumns('yac', list, 0, false);
}

function filterPlanesByPassengers(passeng) {
	let row = document.getElementById('planeRow');
	row.innerHTML = '';

	addColumnsToRow('pla');

	let columns = document.getElementsByClassName('col-plane');
	for (let i = 0; i < columns.length; i++) {
		columns[i].innerHTML = '';
	}

	let list = planes.filter(plane => plane.passengers === passeng);

	addCardsToColumns('pla', list, 0, false);
}

function displayCarsPageNextPrev(direction) {
	let nextPage = 0;
	if (direction === 'prev') {
		if (currPageCar === 1) {
			nextPage = totalPagesCar;
			currPageCar = 7;
		} else {
			nextPage = currPageCar - 1;
			currPageCar = nextPage;
		}
	} else if (direction === 'next') {
		console.log(currPageCar);
		console.log(totalPagesCar);
		if (currPageCar === totalPagesCar) {
			nextPage = 1;
			currPageCar = 1;
		} else {
			nextPage = currPageCar + 1;
			currPageCar = nextPage;
		}
	}
	
	let allButtons = document.querySelectorAll('.pagination-cars .page-item .page-link');
	allButtons.forEach(function(button) {
		button.classList.remove('current-page');
	});

	let pageButtons = document.querySelectorAll('.pagination-buttons .pagination-cars .page-item:not(.prev):not(.next) .page-link:not([aria-label="Previous"]):not([aria-label="Next"])');

	pageButtons.forEach(function(button) {
		let pageNumber = parseInt(button.textContent.trim());

		if (pageNumber === nextPage) {
			button.classList.add('current-page');
		}
	});

	if (direction === 'prev') {
		displayCarsPage(nextPage);
	} else if (direction === 'next') {
		console.log(nextPage);
		displayCarsPage(nextPage);
	}
}

function displayCarsPage(pageNumber) {
	scrollToTop(200);

    let carRow = document.getElementById('carRow');
    carRow.innerHTML = '';

    addColumnsToRow('car');

    let columns = document.getElementsByClassName('col-car');
    for (let i = 0; i < columns.length; i++) {
        columns[i].innerHTML = '';
    }

    addCardsToColumns('car', cars, pageNumber, true)
}

function scrollToTop(duration) {
    const startingY = window.scrollY;
    const startTime = performance.now();

    function scrollStep(timestamp) {
        const timeElapsed = timestamp - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        window.scrollTo(0, startingY * (1 - progress));

        if (timeElapsed < duration) {
            window.requestAnimationFrame(scrollStep);
        }
    }

    window.requestAnimationFrame(scrollStep);
}

/**
 * Price slider for apartments.
 * @param {Array} values 
 */
function handleSliderChangeApt(values) {
    console.log("min: " + values[0] + " | max: " + values[1]);

	let row = document.getElementById('apartmentRow');
	row.innerHTML = '';

	addColumnsToRow('apt');

	let columns = document.getElementsByClassName('col-apartment');
	for (let i = 0; i < columns.length; i++) {
		columns[i].innerHTML = '';
	}

	let list = apartments.filter(apartment => apartment.price >= values[0] && apartment.price <= values[1]);
    list.sort((a, b) => a.price - b.price);

    // Move apartments with price == 0 to bottom
    let zeroPriceApts = list.filter(apartment => apartment.price === 0);
    let nonZeroPriceApts = list.filter(apartment => apartment.price !== 0);
    list = [...nonZeroPriceApts, ...zeroPriceApts];

	addCardsToColumns("apt", list, 0, false);
}

/**
 * Price slider for cars.
 * @param {Array} values 
 */
function handleSliderChangeCar(values) {
	currCarPrive = values;
    applyFilters();
}

/**
 * Price slider for yachts.
 * @param {Array} values 
 */
function handleSliderChangeYacht(values) {
	console.log("min: " + values[0] + " | max: " + values[1]);

	let row = document.getElementById('yachtRow');
	row.innerHTML = '';

	addColumnsToRow('yac');

	let columns = document.getElementsByClassName('col-yacht');
	for (let i = 0; i < columns.length; i++) {
		columns[i].innerHTML = '';
	}

	let list = yachts.filter(yacht => yacht.price >= values[0] && yacht.price <= values[1]);
    list.sort((a, b) => a.price - b.price);

	addCardsToColumns("yac", list, 0, false);
}

function switchCity(city) {
	const elements = document.querySelectorAll('.filters-dropdown-city-text');
    
    elements.forEach((element) => {
        element.innerText = city;
    });
}

function switchPeople(ppl) {
	const elements = document.querySelectorAll('.filters-dropdown-ppl-text');
    
    elements.forEach((element) => {
        element.innerText = ppl === 1 ? ppl + ' person' : ppl + ' persons';
    });
}

function changeCalendarDates(sDate, eDate) {
	if (sDate != null) {
		let startDateInput = $('.datepicker-input-start');
		startDateInput.val(sDate);
	}
	if (eDate != null) {
		let endDateInput = $('.datepicker-input-end');
		endDateInput.val(eDate);
	}
}