/* Methods for Database */ //**************************************************

async function sendDataToSummary(orderId) {
    const db = firebase.firestore();
    const aptsData = [];
    const carsData = [];
    const yachtsData = [];
    const planesData = [];
    
    if (!apartmentsInCart.empty) {
        apartmentsInCart.forEach((apartment) => {
            const apartmentData = {
                price: apartment.price || 0,
				id: apartment.id || 0,
				title: apartment.title || '',
				meters: apartment.meters || 0,
				location: apartment.location || '',
				urlImage: apartment.urlImage || '',
				urlImages: apartment.urlImages || [],
				desc: apartment.desc || '',
				services: apartment.services.map(service => ({
					name: service.name || '',
					price: service.price || 0,
					isAvailable: service.isAvailable || false,
					isAdd: service.isAdd || false
				})),
				deposit: apartment.deposit || 0,
				startDate: apartment.startDate || '',
				endDate: apartment.endDate || '',
				conditioner: apartment.conditioner || false,
				firstLine: apartment.firstLine || false,
				withPets: apartment.withPets || false,
				wifi: apartment.wifi || false,
				isForSale: apartment.isForSale || false,
				priceSell: apartment.priceSell || 0,
				monthRent: apartment.monthRent || false,
				monthPrice: apartment.monthPrice || 0,
				dayRent: apartment.dayRent || false,
				numPeople: apartment.numPeople || 0,
				numBedrooms: apartment.numBedrooms || 0,
				numBathrooms: apartment.numBathrooms || 0,
				isHouse: apartment.isHouse || false,
				parking: apartment.parking || false,
				isVilla: apartment.isVilla || false
            };
            aptsData.push(apartmentData);
        });
    }
    if (!carsInCart.empty) {
        carsInCart.forEach((car) => {
            const carData = {
                price: car.price || 0,
				id: car.id || 0,
				brand: car.brand || '',
				model: car.model || '',
				includedKmDay: car.includedKmDay || 0,
				oneExtraKmPrice: car.oneExtraKmPrice || 0,
				deposit: car.deposit || 0,
				urlImage: car.urlImage || '',
				urlImages: car.urlImages || [],
				desc: car.desc || '',
				services: car.services.map(service => ({
					name: service.name || '',
					price: service.price || 0,
					isAvailable: service.isAvailable || false,
					isAdd: service.isAdd || false
				})),
				startDate: car.startDate || '',
				endDate: car.endDate || '',
				color: car.color || '',
				hp: car.hp || 0,
				numPeople: car.numPeople || 0,
				suitcases: car.suitcases || 0,
				isSportCar: car.isSportCar || false,
				topSpeed: car.topSpeed || 0,
				timeToHundred: car.timeToHundred || 0,
				isManual: car.isManual || false
            };
            carsData.push(carData);
        });
    }
    if (!yachtsInCart.empty) {
        yachtsInCart.forEach((yacht) => {
            const yachtData = {
                price: yacht.price || 0,
				id: yacht.id || 0,
				title: yacht.title || '',
				deposit: yacht.deposit || 0,
				urlImage: yacht.urlImage || '',
				urlImages: yacht.urlImages || [],
				desc: yacht.desc || '',
				services: yacht.services.map(service => ({
					name: service.name || '',
					price: service.price || 0,
					isAvailable: service.isAvailable || false,
					isAdd: service.isAdd || false
				})),
				startDate: yacht.startDate || '',
				endDate: yacht.endDate || '',
				length: yacht.length || 0,
				width: yacht.width || 0,
				cabins: yacht.cabins || 0,
				bathrooms: yacht.bathrooms || 0,
				crew: yacht.crew || 0,
				maxPeople: yacht.maxPeople || 0,
				priceWeek: yacht.priceWeek || 0
            };
            yachtsData.push(yachtData);
        });
    }
    if (!planesInCart.empty) {
        planesInCart.forEach((plane) => {
            const planeData = {
                price: plane.price || 0,
				id: plane.id || 0,
				title: plane.title || '',
				urlImage: plane.urlImage || '',
				urlImages: plane.urlImages || [],
				desc: plane.desc || '',
				services: plane.services.map(service => ({
					name: service.name || '',
					price: service.price || 0,
					isAvailable: service.isAvailable || false,
					isAdd: service.isAdd || false
				})),
				startDate: plane.startDate || '',
				endDate: plane.endDate || '',
				passengers: plane.passengers || 0,
				isIndividualPrice: plane.isIndividualPrice || false
            };
            planesData.push(planeData);
        });
    }
    console.log(aptsData);
    console.log(carsData);
    console.log(yachtsData);
    console.log(planesData);
    
    try {
        await db.collection('orders').doc(orderId).set({
            apartments: aptsData,
            cars: carsData,
            yachts: yachtsData,
            planes: planesData
        });
        console.log(`Cars uploaded to document '${orderId}'`);
    } catch (error) {
        console.error("Error uploading data:", error);
    }
}

// FALTA EL ID 3, 2, 18
function uploadApartments() {
    const db = firebase.firestore();
	let list = []

    list.forEach((apartment) => {
        const apartmentData = {
            price: apartment.price || 0,
            id: apartment.id || 0,
            title: apartment.title || '',
            meters: apartment.meters || 0,
            location: apartment.location || '',
            urlImage: apartment.urlImage || '',
            urlImages: apartment.urlImages || [],
            desc: apartment.desc || '',
            services: apartment.services.map(service => ({
                name: service.name || '',
                price: service.price || 0,
                isAvailable: service.isAvailable || false,
                isAdd: service.isAdd || false
            })),
            deposit: apartment.deposit || 0,
            startDate: apartment.startDate || '',
            endDate: apartment.endDate || '',
            conditioner: apartment.conditioner || false,
            firstLine: apartment.firstLine || false,
            withPets: apartment.withPets || false,
            wifi: apartment.wifi || false,
			isForSale: apartment.isForSale || false,
			priceSell: apartment.priceSell || 0,
			monthRent: apartment.monthRent || false,
			monthPrice: apartment.monthPrice || 0,
			dayRent: apartment.dayRent || false,
			numPeople: apartment.numPeople || 0,
			numBedrooms: apartment.numBedrooms || 0,
			numBathrooms: apartment.numBathrooms || 0,
			isHouse: apartment.isHouse || false,
			parking: apartment.parking || false,
			isVilla: apartment.isVilla || false
        };

        db.collection('apartments').doc('' + apartment.id).set(apartmentData)
        .then(() => {
            console.log(`Apartment with id '${apartment.id}' was uploaded successfully.`);
        })
        .catch((error) => {
            console.log("Error uploading data: ", error);
        });
    });
}

function uploadCars() {
    const db = firebase.firestore();
    let carList = []
    carList.forEach(car => {
        const carData = {
            price: car.price || 0,
            id: car.id || 0,
            brand: car.brand || '',
            model: car.model || '',
            includedKmDay: car.includedKmDay || 0,
            oneExtraKmPrice: car.oneExtraKmPrice || 0,
            deposit: car.deposit || 0,
            urlImage: car.urlImage || '',
            urlImages: car.urlImages || [],
            desc: car.desc || '',
            services: car.services.map(service => ({
                name: service.name || '',
                price: service.price || 0,
                isAvailable: service.isAvailable || false,
                isAdd: service.isAdd || false
            })),
            startDate: car.startDate || '',
            endDate: car.endDate || '',
            color: car.color || '',
            hp: car.hp || 0,
            numPeople: car.numPeople || 0,
            suitcases: car.suitcases || 0,
            isSportCar: car.isSportCar || false,
            topSpeed: car.topSpeed || 0,
            timeToHundred: car.timeToHundred || 0,
			isManual: car.isManual || false
        };
    
        db.collection('cars').doc('' + car.id).set(carData)
        .then(() => {
            console.log(`Car with id '${car.id}' was uploaded successfully.`);
        })
        .catch((error) => {
            console.log("Error uploading data: ", error);
        });
    });
}

function uploadYachts() {
    const db = firebase.firestore();

	let yachts = [];

    yachts.forEach((yacht) => {
        const yachtData = {
            price: yacht.price || 0,
            id: yacht.id || 0,
            title: yacht.title || '',
            deposit: yacht.deposit || 0,
            urlImage: yacht.urlImage || '',
            urlImages: yacht.urlImages || [],
            desc: yacht.desc || '',
            services: yacht.services.map(service => ({
                name: service.name || '',
                price: service.price || 0,
                isAvailable: service.isAvailable || false,
                isAdd: service.isAdd || false
            })),
            startDate: yacht.startDate || '',
            endDate: yacht.endDate || '',
            length: yacht.length || 0,
            width: yacht.width || 0,
            cabins: yacht.cabins || 0,
            bathrooms: yacht.bathrooms || 0,
            crew: yacht.crew || 0,
            maxPeople: yacht.maxPeople || 0,
            priceWeek: yacht.priceWeek || 0
        };

        db.collection('yachts').doc('' + yacht.id).set(yachtData)
        .then(() => {
            console.log(`Yacht with id '${yacht.id}' was uploaded successfully.`);
        })
        .catch((error) => {
            console.log("Error uploading data: ", error);
        });
    });
}

function uploadPlanes() {
    const db = firebase.firestore();
    planes.forEach((plane) => {
        const planeData = {
            price: plane.price || 0,
            id: plane.id || 0,
            title: plane.title || '',
            urlImage: plane.urlImage || '',
            urlImages: plane.urlImages || [],
            desc: plane.desc || '',
            services: plane.services.map(service => ({
                name: service.name || '',
                price: service.price || 0,
                isAvailable: service.isAvailable || false,
                isAdd: service.isAdd || false
            })),
            startDate: plane.startDate || '',
            endDate: plane.endDate || '',
            passengers: plane.passengers || 0,
            isIndividualPrice: plane.isIndividualPrice || false
        };

        db.collection('planes').doc('' + plane.id).set(planeData)
        .then(() => {
            console.log(`Plane with id '${plane.id}' was uploaded successfully.`);
        })
        .catch((error) => {
            console.log("Error uploading data: ", error);
        });
    });
}

async function downloadApartmentsAll() {
    const db = firebase.firestore();
    const ref = db.collection('apartments');

    let apartments = [];

    await ref.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
			
            const apartment = new Apartment(
                data.price,
                data.id,
                data.title,
                data.meters,
                data.location,
                data.urlImage,
                data.urlImages,
                data.desc,
                data.services.map(serviceData => new ApartmentService(
                    serviceData.name,
                    serviceData.price,
                    serviceData.isAvailable,
                    serviceData.isAdd
                )),
                data.deposit,
                data.startDate,
                data.endDate,
                data.conditioner,
                data.firstLine,
                data.withPets,
                data.wifi,
				data.isForSale,
				data.priceSell,
				data.monthRent,
				data.monthPrice,
				data.dayRent,
				data.numPeople,
				data.numBedrooms,
				data.numBathrooms,
				data.isHouse,
				data.parking,
				data.isVilla
            );
            apartments.push(apartment);
        });
    }).catch((error) => {
        console.log("Error getting data: ", error);
    });

	// Filter price apartment ----------------------------
    let apartmentPrices = apartments.map(function(apartment) {
        return apartment.price;
    });
	minPriceApartment = Math.min(...apartmentPrices);
    maxPriceApartment = Math.max(...apartmentPrices);

	// Set type filter to buttons
	const dropdownMenuType = document.getElementById('aptTypeDropdown');
	dropdownMenuType.innerHTML = '';

	const aElement = document.createElement('button');
	aElement.id = 'filterButtonTypeIdApt-Apartment';
	aElement.textContent = 'Apartment';
	aElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
	aElement.onclick = function() {
		filterAptType(0);
	};
	aElement.value = 'false';

	const bElement = document.createElement('button');
	bElement.id = 'filterButtonTypeIdApt-House';
	bElement.textContent = 'House';
	bElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
	bElement.onclick = function() {
		filterAptType(1);
	};
	bElement.value = 'false';

	const eElement = document.createElement('button');
	eElement.id = 'filterButtonTypeIdApt-Villa';
	eElement.textContent = 'Villa';
	eElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
	eElement.onclick = function() {
		filterAptType(2);
	};
	eElement.value = 'false';

	dropdownMenuType.appendChild(aElement);
	dropdownMenuType.appendChild(bElement);
	dropdownMenuType.appendChild(eElement);

	// Set sale filter to buttons
	const dropdownMenuSale = document.getElementById('aptSaleDropdown');
	dropdownMenuSale.innerHTML = '';

	const cElement = document.createElement('button');
	cElement.id = 'filterButtonSaleIdRent';
	cElement.textContent = 'For rent';
	cElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
	cElement.onclick = function() {
		filterAptSale(0);
	};
	cElement.value = 'false';

	const dElement = document.createElement('button');
	dElement.id = 'filterButtonSaleIdBuy';
	dElement.textContent = 'For sale';
	dElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
	dElement.onclick = function() {
		filterAptSale(1);
	};
	dElement.value = 'false';

	dropdownMenuSale.appendChild(cElement);
	dropdownMenuSale.appendChild(dElement);

	// Set month rent filter to buttons
	const dropdownMenuMonthRent = document.getElementById('aptMonthRentDropdown');
	dropdownMenuMonthRent.innerHTML = '';

	const fElement = document.createElement('button');
	fElement.id = 'filterButtonMonthRentIdApt-is';
	fElement.textContent = 'Month';
	fElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
	fElement.onclick = function() {
		filterAptByMonthRent(0);
	};
	fElement.value = 'false';

	const gElement = document.createElement('button');
	gElement.id = 'filterButtonMonthRentIdApt-not';
	gElement.textContent = 'Daily';
	gElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
	gElement.onclick = function() {
		filterAptByMonthRent(1);
	};
	gElement.value = 'false';

	dropdownMenuMonthRent.appendChild(fElement);
	dropdownMenuMonthRent.appendChild(gElement);

	// Set price filter to buttons
	const dropdownMenuPrice = document.getElementById('aptPriceDropdown');
	dropdownMenuPrice.innerHTML = '';

	const sliderElement = document.createElement('div');
	sliderElement.id = 'filterButtonPriceIdApt';

	dropdownMenuPrice.appendChild(sliderElement);

	const priceSlider = noUiSlider.create(sliderElement, {
		start: [maxPriceApartment/4, maxPriceApartment/2],
		step: 10,
		tooltips: [
			wNumb({decimals: 0}),
			wNumb({decimals: 0})
		],
		range: {
			'min': minPriceApartment,
			'max': maxPriceApartment
		}
	});

	priceSlider.on('change', handleSliderChangeApt);

    return apartments;
}

async function downloadCarsAll() {
    const db = firebase.firestore();
    const ref = db.collection('cars');

    let cars = [];
    await ref.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            const car = new Car(
                data.price,
                data.id,
                data.brand,
                data.model,
                data.includedKmDay,
                data.oneExtraKmPrice,
                data.deposit,
                data.urlImage,
                data.urlImages,
                data.desc,
                data.services.map(serviceData => new CarService(
                    serviceData.name,
                    serviceData.price,
                    serviceData.isAvailable,
                    serviceData.isAdd
                )),
                data.startDate,
                data.endDate,
                data.color,
                data.hp,
                data.numPeople,
                data.suitcases,
                data.isSportCar,
                data.topSpeed,
                data.timeToHundred,
				data.isManual
            );

            cars.push(car);
        });
    }).catch((error) => {
        console.log("Error getting data: ", error);
    });

	// Filter price car ----------------------------
    let carPrices = cars.map(function(car) {
        return car.price;
    });
	minPriceCar = Math.min(...carPrices);
    maxPriceCar = Math.max(...carPrices);

	// Set brand filter to buttons
	const dropdownMenuBrand = document.getElementById('carBrandDropdown');
	dropdownMenuBrand.innerHTML = '';
	

	let carBrands = cars.map(car => car.brand).filter((brand, index, self) => self.indexOf(brand) === index).sort();

	// Al brand
	const bElement = document.createElement('button');
	bElement.id = 'filterButtonBrandIdCar-all';
	bElement.textContent = 'All brands';
	bElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
	bElement.onclick = function() {
		filterCarsByBrand('all');
		setModelByBrandColorPrice();
	};
	bElement.value = 'false';
	dropdownMenuBrand.appendChild(bElement);

	// Specific brand
	carBrands.forEach(brand => {
		const aElement = document.createElement('button');
		aElement.id = 'filterButtonBrandIdCar-' + brand;
		aElement.textContent = brand;
		aElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
		aElement.onclick = function() {
			filterCarsByBrand(brand);
			setModelByBrandColorPrice();
		};
		aElement.value = 'false';
	
		dropdownMenuBrand.appendChild(aElement);
	});

	function setModelByBrandColorPrice() {
		// Set model filter to buttons
		const dropdownMenuModel = document.getElementById('carModelDropdown');
		dropdownMenuModel.innerHTML = '';

		let carModels = filteredCars.map(car => car.model).filter((model, index, self) => self.indexOf(model) === index).sort();
		
		// All model
		const mElement = document.createElement('button');
		mElement.id = 'filterButtonModelIdCar-all';
		mElement.textContent = 'All models';
		mElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
		mElement.onclick = function() {
			switchCarByModel('all');
		};
		mElement.value = 'false';
		dropdownMenuModel.appendChild(mElement);

		// Specific model
		carModels.forEach(model => {
			const aElement = document.createElement('button');
			aElement.id = 'filterButtonModelIdCar-' + model;
			aElement.textContent = model;
			aElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
			aElement.onclick = function() {
				switchCarByModel(model);
			};
			aElement.value = 'false';
			dropdownMenuModel.appendChild(aElement);
		});
	}

	

	// Set color filter to buttons
	const dropdownMenuColor = document.getElementById('carColorDropdown');
	dropdownMenuColor.innerHTML = '';

	let carColors = cars.map(car => car.color === 'gray' ? 'grey' : car.color).filter((color, index, self) => self.indexOf(color) === index);

	const cElement = document.createElement('button');
	cElement.id = 'filterButtonColorIdCar-all';
	cElement.textContent = 'All colors';
	cElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
	cElement.onclick = function() {
		filterCarsByColor('all');
		setModelByBrandColorPrice();
	};
	cElement.value = 'false';
	dropdownMenuColor.appendChild(cElement);

	carColors.forEach(color => {
		const aElement = document.createElement('button');
		aElement.id = 'filterButtonColorIdCar-' + color;
		aElement.classList.add('btn', 'dropdown-item');
		aElement.style.backgroundColor = color;
		aElement.style.borderRadius = '0%';
		aElement.style.width = '150px';
		aElement.style.height = '15px';
		aElement.style.marginBottom = '5px';
		aElement.style.border = '1px solid grey';
		aElement.onclick = function() {
			filterCarsByColor(color);
			setModelByBrandColorPrice();
		};
		aElement.value = 'false';
	
		dropdownMenuColor.appendChild(aElement);
	});


	// Set price filter to buttons
	const dropdownMenuPrice = document.getElementById('carPriceDropdown');
	dropdownMenuPrice.innerHTML = '';

	const sliderElement = document.createElement('div');
	sliderElement.id = 'filterButtonPriceIdCar';

	dropdownMenuPrice.appendChild(sliderElement);
	
	// All prices
	const pElement = document.createElement('button');
	pElement.id = 'filterButtonPriceIdCar-all';
	pElement.textContent = 'All prices';
	pElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
	pElement.style.margin = '10px 0 0 0';
	pElement.style.borderRadius = '0';
	pElement.style.width = '100%';
	pElement.style.textAlign = 'center';
	pElement.onclick = function() {
		handleSliderChangeCar([minPriceCar, maxPriceCar]);
		priceSlider.set([minPriceCar, maxPriceCar]);
		setModelByBrandColorPrice();
	};
	pElement.value = 'false';
	dropdownMenuPrice.appendChild(pElement);

	const priceSlider = noUiSlider.create(sliderElement, {
		start: [minPriceCar, maxPriceCar],
		step: 10,
		tooltips: [
			wNumb({decimals: 0}),
			wNumb({decimals: 0})
		],
		range: {
			'min': minPriceCar,
			'max': maxPriceCar
		}
	});

	priceSlider.on('change', handleSliderChangeCar);
	priceSlider.on('change', setModelByBrandColorPrice);

    return cars;
}

async function downloadYachtsAll() {
    const db = firebase.firestore();
    const ref = db.collection('yachts');

    let yachts = [];
    
    await ref.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            const yacht = new Yacht(
                data.price,
                data.id,
                data.title,
                data.deposit,
                data.urlImage,
                data.urlImages,
                data.desc,
                data.services.map(serviceData => new YachtService(
                    serviceData.name,
                    serviceData.price,
                    serviceData.isAvailable,
                    serviceData.isAdd
                )),
                data.startDate,
                data.endDate,
                data.length,
                data.width,
                data.cabins,
                data.bathrooms,
                data.crew,
                data.maxPeople,
                data.priceWeek
            );

            yachts.push(yacht);
        });
    }).catch((error) => {
        console.log("Error getting data: ", error);
    });

	// Filter price yacht ----------------------------
	let yachtPrices = yachts.map(function(yacht) {
		return yacht.price;
	});

	minPriceYacht = Math.min(...yachtPrices);
	maxPriceYacht = Math.max(...yachtPrices);

	// Set max people filter to buttons
	const dropdownMenuMaxPeople = document.getElementById('yachtMaxPeopleDropdown');
	dropdownMenuMaxPeople.innerHTML = '';

	let yachtMaxPeople = yachts.map(yac => yac.maxPeople)
    	.filter((maxPeople, index, self) => self.indexOf(maxPeople) === index)
        .sort((a, b) => a - b);

	yachtMaxPeople.forEach(maxPeople => {
		const aElement = document.createElement('button');
		aElement.id = 'filterButtonMaxPeopleIdYacht-' + maxPeople;
		aElement.textContent = maxPeople + ' people';
		aElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
		aElement.onclick = function() {
			filterYachtsByMaxPeople(maxPeople);
		};
		aElement.value = 'false';
	
		dropdownMenuMaxPeople.appendChild(aElement);
	});

	// Set cabins filter to buttons
	const dropdownMenuCabins = document.getElementById('yachtCabinsDropdown');
	dropdownMenuCabins.innerHTML = '';

	let yachtCabins = yachts.map(yac => yac.cabins)
    	.filter((cabins, index, self) => self.indexOf(cabins) === index)
        .sort((a, b) => a - b);

	yachtCabins.forEach(cabins => {
		const aElement = document.createElement('button');
		aElement.id = 'filterButtonCabinsIdYacht-' + cabins;
		aElement.textContent = cabins + ' cabins';
		aElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
		aElement.onclick = function() {
			filterYachtsByCabins(cabins);
		};
		aElement.value = 'false';
	
		dropdownMenuCabins.appendChild(aElement);
	});

	// Set cabins filter to buttons
	const dropdownMenuBathrooms = document.getElementById('yachtBathroomsDropdown');
	dropdownMenuBathrooms.innerHTML = '';

	let yachtBathrooms = yachts.map(yac => yac.bathrooms)
    	.filter((bathrooms, index, self) => self.indexOf(bathrooms) === index)
        .sort((a, b) => a - b);

	yachtBathrooms.forEach(bathrooms => {
		const aElement = document.createElement('button');
		aElement.id = 'filterButtonBathroomsIdYacht-' + bathrooms;
		aElement.textContent = bathrooms + ' bathrooms';
		aElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
		aElement.onclick = function() {
			filterYachtsByBathrooms(bathrooms);
		};
		aElement.value = 'false';
	
		dropdownMenuBathrooms.appendChild(aElement);
	});

	// Set price filter to buttons
	const dropdownMenuPrice = document.getElementById('yachtPriceDropdown');
	dropdownMenuPrice.innerHTML = '';

	const sliderElement = document.createElement('div');
	sliderElement.id = 'filterButtonPriceIdYacht';

	dropdownMenuPrice.appendChild(sliderElement);

	const priceSlider = noUiSlider.create(sliderElement, {
		start: [maxPriceYacht/4, maxPriceYacht/2],
		step: 10,
		tooltips: [
			wNumb({decimals: 0}),
			wNumb({decimals: 0})
		],
		range: {
			'min': minPriceYacht,
			'max': maxPriceYacht
		}
	});

	priceSlider.on('change', handleSliderChangeYacht);

    return yachts;
}

async function downloadPlanesAll() {
    const db = firebase.firestore();
    const ref = db.collection('planes');

    let planes = [];
    
    await ref.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            const plane = new Plane(
                data.price,
                data.id,
                data.title,
                data.urlImage,
                data.urlImages,
                data.desc,
                data.services.map(serviceData => new PlaneService(
                    serviceData.name,
                    serviceData.price,
                    serviceData.isAvailable,
                    serviceData.isAdd
                )),
                data.startDate,
                data.endDate,
                data.passengers,
                data.isIndividualPrice
            );

            planes.push(plane);
        });
    }).catch((error) => {
        console.log("Error getting data: ", error);
    });

	// Filter price plane ----------------------------
	let planePrices = planes.map(function(plane) {
		return plane.price;
	});

	minPricePlane = Math.min(...planePrices);
	maxPricePlane = Math.max(...planePrices);

	// Set passengers filter to buttons
	const dropdownMenuPassengers = document.getElementById('planePassengersDropdown');
	dropdownMenuPassengers.innerHTML = '';

	let planePassengers = planes.map(plane => plane.passengers)
		.filter((passengers, index, self) => self.indexOf(passengers) === index)
		.sort((a, b) => a - b);

	planePassengers.forEach(passengers => {
		const aElement = document.createElement('button');
		aElement.id = 'filterButtonPassengersIdPlane-' + passengers;
		aElement.textContent = passengers + ' passengers';
		aElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
		aElement.onclick = function() {
			filterPlanesByPassengers(passengers);
		};
		aElement.value = 'false';
	
		dropdownMenuPassengers.appendChild(aElement);
	});

    return planes;
}

/**
 * Add to all apartments one or more new propierties.
 */
async function addPropertiesApartment() {
    const db = firebase.firestore();
    let ref = db.collection('apartments');

    let newPropertyName = 'isVilla';
    let newValueBool = false;
    let newValueNumber = 0;

	let addProperties = async () => {
		let snapshot = await ref.get();
	  
		snapshot.docs.forEach((doc) => {
			let docRef = ref.doc(doc.id);
			docRef.update({[newPropertyName]: newValueBool});
			//docRef.update({[newPropertyName]: newValueBool, [newPropertyName]: newValueNumber});
		});
	  
		console.log('Properties added successfully.');
	};

	addProperties().catch(console.error);
}

/**
 * Add to all cars one or more new propierties.
 */
async function addPropertiesCar() {
    const db = firebase.firestore();
    let ref = db.collection('cars');

    let newPropertyName = 'isManual';
    let newValueBool = false;
    let newValueNumber = 0;

	let addProperties = async () => {
		let snapshot = await ref.get();
	  
		snapshot.docs.forEach((doc) => {
			let docRef = ref.doc(doc.id);
			docRef.update({[newPropertyName]: newValueBool});
		});
	  
		console.log('Properties added successfully.');
	};

	addProperties().catch(console.error);
}